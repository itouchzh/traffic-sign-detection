# -*- coding: utf-8 -*-
# @Time    : 2023/5/5
# @Author  : rickHan
# @Software: PyCharm
# @File    : connection.py
from flask import Flask
from flask_cors import CORS

from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
CORS(app)
# 连接数据库
app.config[
    'SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://root:hyj@127.0.0.1:3306/user_db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# 查询时会显示原始SQL语句
# app.config['SQLALCHEMY_ECHO'] = True
db = SQLAlchemy(app)

# try:
#     db.session.execute("SELECT 1")
#     print("Database connection established")
# except Exception as e:
#     print("Unable to connect to the database:", e)
# # 反射所有表结构
# metadata = db.MetaData()
# metadata.reflect(bind=db.engine)

# # 获取所有表名
# table_names = metadata.tables.keys()

# # 打印所有表名
# for name in table_names:
#     print(name)


# 数据库模型类
class User(db.Model):
    # 定义表名字
    __tablename__ = 'user'
    # 定义字段名字，db.column表示字段，指明类型
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(32), unique=True)
    password = db.Column(db.String(32), unique=False)
    email = db.Column(db.String(32), unique=False)
    phone = db.Column(db.String(32), unique=False)
    created_at = db.Column(
        db.DateTime, default=datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S'))
    address = db.Column(db.String(32), unique=False)
    car_number = db.Column(db.String(32), unique=True)
    car_id = db.Column(db.String(32), unique=True)

    # 返回值 字符串
    def __repr__(self):
        return f"User(id={self.id}, username='{self.username}', password='{self.password}', email='{self.email}', phone='{self.phone}', created_at='{self.created_at}', address='{self.address}', car_number='{self.car_number}', car_id='{self.car_id}')"

    # 返回字典，可以转为json
    def serialize(self):
        return {
            'id': self.id,
            'username': self.username,
            # 'password': self.password,
            'email': self.email,
            'phone': self.phone,
            'createdAt': self.created_at,
            'address': self.address,
            'carNumber': self.car_number,
            'carId': self.car_id
        }


# 创建第二个表
class Car(db.Model):
    # 指定表名称
    __tablename__ = 'car_info'
    id = db.Column(db.Integer, primary_key=True)
    owner = db.Column(db.String(32))
    car_number = db.Column(db.String(32), unique=True)

    # User希望有role属性，但是在别的模型中定义，即上面的backref=role
    def __repr__(self):
        return '<Car: %s %s %s>' % (self.id, self.owner, self.car_number)


