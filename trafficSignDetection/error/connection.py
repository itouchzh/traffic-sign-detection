
from flask import Flask


from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import pytz

app = Flask(__name__)

# 连接数据库
app.config[
    'SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://root:hyj@127.0.0.1:3306/user_db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# 查询时会显示原始SQL语句
# app.config['SQLALCHEMY_ECHO'] = True
db = SQLAlchemy(app)


class PromiseError(db.Model):
    __tablename__ = 'promise_error'
    id = db.Column(db.Integer, primary_key=True)
    page_url = db.Column(db.String(255))
    reason = db.Column(db.String(255))
    start_time = db.Column(db.String(255), nullable=False)
    sub_type = db.Column(db.String(50))
    error_type = db.Column(db.String(50))
    occurrence_time = db.Column(db.TIMESTAMP, default=datetime.utcnow)

    def serialize(self):
        return {
            'id': self.id,
            'page_url': self.page_url,
            'reason': self.reason,
            'start_time': self.start_time,  
            'sub_type': self.sub_type,
            'error_type': self.error_type,
            'occurrence_time': str(self.occurrence_time)
        }
class JsError(db.Model):
    __tablename__ = 'js_error'
    id = db.Column(db.Integer, primary_key=True)
    msg = db.Column(db.Text)
    line = db.Column(db.Integer)
    column = db.Column(db.Integer)
    error = db.Column(db.Text)
    sub_type = db.Column(db.String(50), default='js')
    page_url = db.Column(db.String(255))
    type = db.Column(db.String(50), default='error')
    start_time = db.Column(db.String(255), nullable=False)
    occurrence_time = db.Column(db.TIMESTAMP, default=datetime.utcnow)

    def serialize(self):
        return {
            'id': self.id,
            'msg': self.msg,
            'line': self.line,
            'column': self.column,
            'error': self.error,
            'sub_type': self.sub_type,
            'page_url': self.page_url,
            'type': self.type,
            'start_time': self.start_time,
            'occurrence_time': self.occurrence_time
        }
class ResourceError(db.Model):
    __tablename__ = 'resource_error'
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(255))
    type = db.Column(db.String(50), default='error')
    sub_type = db.Column(db.String(50), default='resource')
    start_time = db.Column(db.String(255), nullable=False)
    occurrence_time = db.Column(db.TIMESTAMP, default=datetime.utcnow)
    html = db.Column(db.Text)
    resource_type = db.Column(db.String(50))
    paths = db.Column(db.Text)
    page_url = db.Column(db.String(255))

    def serialize(self):
        return {
            'id': self.id,
            'url': self.url,
            'type': self.type,
            'sub_type': self.sub_type,
            'start_time': self.start_time,
            'occurrence_time': self.occurrence_time,
            'html': self.html,
            'resource_type': self.resource_type,
            'paths': self.paths,
            'page_url': self.page_url
        }