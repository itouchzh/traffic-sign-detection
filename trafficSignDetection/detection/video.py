import time
from database.connection import *
from flask import jsonify, request
from sqlalchemy import desc
from utils.token import is_token_expired
from yolo.detect import *
import base64


@app.route('/uploadVideo', methods=['POST'])
def upload_video():
    file = request.files['file']  # <FileStorage: '0.mp4' ('video/mp4')>
    video_content = file.read()
    
    return "success"

@app.route('/getVideos', methods=['GET'])
def get_videos():
    if is_token_expired(request):
        return jsonify({'error': 'token错误'})
    
    return "success"