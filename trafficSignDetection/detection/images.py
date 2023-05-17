from database.connection import *
from flask import jsonify, request
from sqlalchemy import desc
from yolo.detect import *
import base64


@app.route('/uploadFile', methods=['POST'])
def upload_file():
    file = request.files['file']
    print(file)
    if file:
        # 处理文件
        return '文件上传成功'
    else:
        return '文件上传失败'


@app.route('/getImages', methods=['POST'])
def detect_image():
    images = list(request.get_json())
    image_data = []
    res = []
    for item in images:
        filename = item['name']
        curImage = base64.b64decode(item['image'])
        image_data.append({'filename': filename, 'data': curImage})
        # 检测
        res.append('data:image/jpeg;base64,' + get_result(base64_string=item['image'][23:]))
    # 存储到数据库
    # db.session.bulk_insert_mappings(Image, image_data)
    # db.session.commit()
    # print(images)
    # image_data = base64.b64decode(images)
    return jsonify({'status': 200, 'message': 'success', 'images': res})


@app.route('/detectionResultes', methods=['GET'])
def getDetectionImages():
    pass
