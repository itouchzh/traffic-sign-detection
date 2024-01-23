from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('camera_data')
def handle_camera_data(data):
    # 在这里处理从前端接收到的摄像头数据
    print('Received camera data:', len(data))  # 打印数据的长度示例
    # 进行其他处理，比如保存到文件或进行实时处理

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
