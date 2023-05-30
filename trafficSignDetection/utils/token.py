from database.connection import app,User
from itsdangerous import TimedJSONWebSignatureSerializer,SignatureExpired
from flask import request, jsonify
from io import BytesIO
from random import randint
from PIL import Image, ImageDraw, ImageFont

import base64
import random
import string

app.secret_key = 'traffic'
real_captcha = ''
# 生成验证码：
@app.route('/getCaptcha')
def get_captcha():
    # 生成一个 4 位随机验证码
    captcha = ''.join(random.choices(string.ascii_uppercase + string.ascii_lowercase + string.digits, k=4))
    global real_captcha
    real_captcha = captcha
    # 创建一个图像对象，大小为 175x32，背景为白色
    img = Image.new('RGB', (175, 32), color=(255, 255, 255))

    # 在图像上绘制验证码
    font = ImageFont.truetype('arial.ttf', 29)
    d = ImageDraw.Draw(img)
    text_w, text_h = d.textsize(captcha, font)
    x = (175 - text_w) // 2
    y = (32 - text_h) // 2
    d.text((x, y), captcha, font=font, fill=(0, 0, 0))

    # 添加干扰点
    for _ in range(30):
        x = randint(0, 174)
        y = randint(0, 31)
        d.point((x, y), fill=(0, 0, 0))

    # 添加干扰线
    for _ in range(5):
        x1 = randint(0, 174)
        y1 = randint(0, 31)
        x2 = randint(0, 174)
        y2 = randint(0, 31)
        d.line((x1, y1, x2, y2), fill=(0, 0, 0), width=2)

    # 将图像转换为 base64 格式
    buffered = BytesIO()
    img.save(buffered, format="JPEG")
    img_str = base64.b64encode(buffered.getvalue()).decode('ascii')
    return jsonify({'captchaImg': f"data:image/jpeg;base64,{img_str}", 'captcha': captcha})

# 生成token
@app.route('/login', methods=['POST'])
def login():
    global real_captcha
    # 获取 POST 请求中的用户名和密码
    username = request.json.get('username')
    password = request.json.get('password')
    current_captcha = request.json.get('vercode')
    # 判断验证码是否正确
    if current_captcha.lower() != real_captcha.lower():
        return jsonify({
            'error':'验证码输入错误'
        })
    # 根据用户名查找用户
    user = User.query.filter_by(username=username).first()
    # 判断用户是否存在，以及密码是否正确
    if user and user.password == password:
        # 用户名和密码正确，生成 token
        s = TimedJSONWebSignatureSerializer(app.secret_key, expires_in=3600)
        token = s.dumps({'user_id': user.id}).decode('ascii')
        # 返回 token和用户信息
        return jsonify({'token': token, 'userInfo':user.serialize()})
    else:
        # 用户名或密码错误，返回错误信息
        return jsonify({'error': 'Invalid username or password'})

# 判断token是否过期
def is_token_expired(token, secret_key='traffic', expiration_time=3600):
    try:
        s = TimedJSONWebSignatureSerializer(secret_key, expires_in=expiration_time)
        data = s.loads(token)
        return False  # Token未过期
    except SignatureExpired:
        return True  # Token已过期
