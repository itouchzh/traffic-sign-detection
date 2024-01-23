# import time
# from database.connection import *
# from flask import jsonify, request
# from sqlalchemy import desc
# from utils.token import is_token_expired
# from yolo.detect import *
# import base64
# from flask_socketio import SocketIO, emit
# name_space = '/dcenter'
# socketio = SocketIO()
# socketio.init_app(app, cors_allowed_origins='*')
# @socketio.on('message')
# def handle_video_frame(frame):
#     # 在这里进行检测操作
#     print('frame',frame)
#     # detection_result = detect_frame(frame)
    
#     # 将检测结果通过WebSocket发送给前端
#     # emit('detection_result', detection_result)


# @app.route('/uploadVideo', methods=['POST'])
# def upload_video():
#     file = request.files['file']  # <FileStorage: '0.mp4' ('video/mp4')>
#     video_content = file.read()
    
#     return "success"

# @app.route('/getVideos', methods=['GET'])
# def get_videos():
#     if is_token_expired(request):
#         return jsonify({'error': 'token错误'})
    
#     return "success"