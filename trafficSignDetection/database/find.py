from connection import Role, db

# 查询Role表中所有记录
roles = Role.query.all()

# 查询Role表中name为'admin'的记录
role = Role.query.filter_by(name='admin').first()
