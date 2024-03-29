from flask import Flask
from views import *
from detection.images import *
from detection.results import *
from detection.paper import *
from detection.video import *
from database.connection import app
from utils.token import login, get_captcha

app.route('/login')(login)
app.route('/getCaptcha')(get_captcha)


# 处理用户相关信息
app.route('/user/<int:user_id>')(get_user)
app.route('/getAllUsers')(get_all_users)
# 注册用户
app.route('/register')(register)
app.route('/addOneUser')(add_one_user)
app.route('/getOneUser')(find_user_by_id)
app.route('/deteteUser/<int:id>')(detele_user)

# 文件模块
app.route('/uploadFile')(upload_file)
app.route('/getImages')(detect_image)
app.route('/uploadVideos')(upload_video)

# 结果
app.route('/getDetections')(get_detections_results)
app.route('/getDetectionConf')(get_detection_conf)

app.route('/test')(test)
app.route('/getCar')(get_all_car)






# pdf
app.route('/get_pdf')(get_pdf)
if __name__ == '__main__':
    # socketio.run(app, host='0.0.0.0', port=5000, debug=True)
    app.run(debug=True)