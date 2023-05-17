from flask import Flask
from views import *
from detection.images import *
from database.connection import app
from utils.token import login, get_captcha

app.route('/login')(login)
app.route('/getCaptcha')(get_captcha)

app.route('/user/<int:user_id>')(get_user)
app.route('/getAllUsers')(get_all_users)
app.route('/addOneUser')(add_one_user)
app.route('/getOneUser')(find_user_by_id)
app.route('/deteteUser/<int:id>')(detele_user)


# 文件模块
app.route('/uploadFile')(upload_file)
app.route('/getImages')(detect_image)

app.route('/test')(test)
app.route('/getCar')(get_all_car)
if __name__ == '__main__':
    app.run(use_reloader=True)