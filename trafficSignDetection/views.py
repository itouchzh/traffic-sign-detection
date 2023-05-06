from database.connection import *
from flask import jsonify


# 在路由函数中查询用户，并返回 JSON 格式数据
@app.route('/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'})
    return jsonify(user.to_dict())


@app.route('/getAllUsers')
def get_all_users():
    users = User.query.all()
    return jsonify([user.serialize() for user in users])


@app.route('/getCar')
def get_all_car():
    # cars = Car.query.all()
    # print(cars)
    return jsonify('lll')


@app.route('/test', methods=['GET'])
def test():
    count = User.query.count()
    return jsonify({'count': count})
