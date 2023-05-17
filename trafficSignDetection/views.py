from database.connection import *
from flask import jsonify, request
from sqlalchemy import desc


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


@app.route('/addOneUser', methods=['POST'])
def add_one_user():
    data = request.get_json()
    username = data.get('username', None)
    if not username:
        return {"error": '添加失败，用户名不能为空'}

    username, password, email, phone, car_number, address = data.get(
        'username'), data.get('password'), data.get('email'), data.get(
            'phone'), data.get('carNumber'), data.get('address')
    created_at = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
    user = User(username=username,
                password=password,
                email=email,
                phone=phone,
                car_number=car_number,
                address=address,
                created_at=created_at)

    db.session.add(user)
    db.session.commit()
    last_user = User.query.order_by(desc(User.id)).first()
    return jsonify({'message': 'success', 'userInfo': last_user.serialize()})


@app.route('/changeUser/<int:id>', methods=['POST'])
def change_user(id):
    user = User.query.get(id)
    if not user:
        return {'error': 'User not found'}
    data = request.get_json()
    user.username = data.get('username', user.username)
    user.password = data.get('password', user.password)
    user.email = data.get('email', user.email)
    user.phone = data.get('phone', user.phone)
    user.car_number = data.get('carNumber', user.car_number)
    user.address = data.get('address', user.address)

    db.session.commit()

    print(user)
    return jsonify({
        'message': f'修改用户-{user.username}成功',
        'userInfo': user.serialize()
    })


@app.route('/deteteUser/<int:id>', methods=['DELETE'])
def detele_user(id):
    user = User.query.get(id)
    if not user:
        return {'error': 'User not found'}
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': '用户成功删除'})


@app.route('/getOneUser', methods=['POST'])
def find_user_by_id():
    id = request.get_json('id')
    user = User.query.get(id)
    if not user:
        return {'error': 'User not found'}
    return jsonify({'message': '查找成功', 'userInfo': user.serialize()})


@app.route('/getCar')
def get_all_car():
    # cars = Car.query.all()
    # print(cars)
    return jsonify('lll')


@app.route('/test', methods=['GET'])
def test():
    count = User.query.count()
    return jsonify({'count': count})




