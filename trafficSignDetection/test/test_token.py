from itsdangerous import TimedJSONWebSignatureSerializer,SignatureExpired
token = "eyJhbGciOiJIUzUxMiIsImlhdCI6MTY4NTQ1MjQwOSwiZXhwIjoxNjg1NDU2MDA5fQ.eyJ1c2VyX2lkIjoxMDAwNH0.2xQR-TcOhw_985SGnbIX5xwpONx2xww6CmFjW5rg3Mz7D7kkQit8bHZlog45QJJ9DWcAXPmM7LWJuyqyuWOhuQ"
# 判断token是否过期
def is_token_expired(token, secret_key='traffic', expiration_time=3600):
    try:
        s = TimedJSONWebSignatureSerializer(secret_key, expires_in=expiration_time)
        data = s.loads(token)
        return False  # Token未过期
    except SignatureExpired:
        return True  # Token已过期
