# -*- coding: utf-8 -*-
# @Time    : 2023/5/5
# @Author  : rickHan
# @Software: PyCharm
# @File    : connection.py
from flask import Flask
from flask_cors import CORS

from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import pytz

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


# 图片表
class Image(db.Model):
    __tablename__ = 'images'

    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    data = db.Column(db.LargeBinary, nullable=False)
    created_at = db.Column(db.TIMESTAMP, default=datetime.utcnow)

    def serialize(self):
        return {'id': self.id, 'filename': self.filename, 'data': self.data}


class Detection_image(db.Model):
    __tablename__ = 'detection_image'
    id = db.Column(db.Integer, primary_key=True)
    image_name = db.Column(
        db.String(32),
        db.ForeignKey('categorys.image_name'),
        nullable=False,
    )
    current_image = db.Column(db.LargeBinary, nullable=False)
    result_image = db.Column(db.LargeBinary, nullable=False)
    confidence = db.Column(db.Float, nullable=False)
    iou = db.Column(db.Float, nullable=False)
    model_name = db.Column(db.String, nullable=False)
    detection_time = db.Column(db.TIMESTAMP,
                               default=datetime.now(
                                   pytz.timezone('Asia/Shanghai')))
    category_id = db.Column(db.Integer)
    category = db.relationship('Category', backref='detection_images')

    def serialize(self):
        return {
            'id': self.id,
            'image_name': self.image_name,
            'confidence': self.confidence,
            'iou': self.iou,
            'model_name': self.model_name,
            'detection_time': self.detection_time,
            'category_id': self.category_id,
            # 'category': self.category
        }


class Category(db.Model):
    __tablename__ = 'categorys'
    category_id = db.Column(db.Integer, nullable=False, primary_key=True)
    label = db.Column(db.String(32), nullable=False)
    image_name = db.Column(db.String(32), nullable=False)

    def serialize(self):
        return {
            'category_id': self.category_id,
            'label': self.label,
            'image_name': self.image_name,
        }


class Detection(db.Model):
    __tablename__ = 'detection'

    id = db.Column(db.Integer, primary_key=True)
    label = db.Column(db.String(255), nullable=False)
    confidence = db.Column(db.Float, nullable=False)
    location_x1 = db.Column(db.Float, nullable=False)
    location_y1 = db.Column(db.Float, nullable=False)
    location_x2 = db.Column(db.Float, nullable=False)
    location_y2 = db.Column(db.Float, nullable=False)
    image_name = db.Column(db.String(255), nullable=False)


    def serialize(self):
        return {
            'id':
            self.id,
            'label':
            self.label,
            'confidence':
            self.confidence,
            'location': [
                self.location_x1, self.location_y1, self.location_x2,
                self.location_y2
            ]
        }
