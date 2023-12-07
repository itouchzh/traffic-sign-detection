from database.connection import *
from flask import jsonify, request
from sqlalchemy import desc
from utils.token import is_token_expired
from yolo.detect import *
import base64


@app.route('/getDetections', methods=['GET'])
def get_detections_results():
    if is_token_expired(request):
        return jsonify({'error': 'token错误'})
    all_categorys = Category.query.all()
    all_detection_images = Detection_image.query.all()
    # for i in all_categorys:
    #     print(i.serialize())
    result = [[all_category.serialize() for all_category in all_categorys],
              [
                  all_detection_image.serialize()
                  for all_detection_image in all_detection_images
              ]]
    return jsonify(result)


@app.route('/getDetectionConf', methods=['GTE'])
def get_detection_conf():
    if is_token_expired(request):
        return jsonify({'error': 'token错误'})
    all_detections = Detection.query.all()
    return jsonify([detection.serialize() for detection in all_detections])
