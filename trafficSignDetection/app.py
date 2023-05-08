from flask import Flask
from views import *
from database.connection import app
from utils.token import login,get_captcha

app.route('/login')(login)
app.route('/getCaptcha')(get_captcha)


app.route('/user/<int:user_id>')(get_user)
app.route('/getAllUsers')(get_all_users)
app.route('/test')(test)
app.route('/getCar')(get_all_car)
if __name__ == '__main__':
    app.run(use_reloader=True)
