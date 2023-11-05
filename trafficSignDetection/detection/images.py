import time
from database.connection import *
from flask import jsonify, request
from sqlalchemy import desc
from yolo.detect import *
import base64


@app.route('/uploadFile', methods=['POST'])
def upload_file():
    file = request.files['file']
    # print(file)
    if file:
        # 处理文件
        return '文件上传成功'
    else:
        return '文件上传失败'


@app.route('/getImages', methods=['POST'])
def detect_image():
    images = list(request.get_json())
    #  添加到图片
    image_data = []
    # 添加到种类
    category_data = []
    # 添加到detection数据库
    detection_data = []
    res = []
    is_save = False
    for item in images:
        is_save = item['isSave']
        # print(item['conf'], item['iou'])
        model = item['model_name']
        # 检测
        detection_result = get_result(model=model,
                                      base64_string=item['image'][23:])
        if detection_result['detection_info'] != []:
            # print(detection_result['detection_info'])
            res.append({
                'img':
                'data:image/jpeg;base64,' + detection_result['base64_image'],
                'detectionInfo':
                detection_result['detection_info'],
                'objectNum':
                len(detection_result['detection_info'])
            })
        else:
            res.append({
                'img':
                'data:image/jpeg;base64,' + detection_result['base64_image'],
                'objectNum':
                0
            })
        #  对检测完的图像进行编码
        encoded_data = 'data:image/jpeg;base64,' + detection_result[
            'base64_image']
        current_timestamp_milliseconds = str(time.time())[-10:].replace(
            '.', '')
        image_data.append({
            'image_name':
            item['name'],
            'current_image':
            base64.b64decode(item['image']),
            'result_image':
            base64.b64decode(encoded_data.encode('utf-8')),
            'confidence':
            item['conf'],
            'iou':
            item['iou'],
            'category_id':
            (item['name'] + current_timestamp_milliseconds)[20:],
            'model_name':
            item['model_name']
        })
        for i in detection_result['detection_info']:
            category_data.append({
                'image_name': item['name'],
                'label': i['label']
            })
            detection_data.append({
                'label': i['label'],
                'image_name':item['name'],
                'confidence': i['confidence'],
                'location_x1': i['location'][0],
                'location_y1': i['location'][1],
                'location_x2': i['location'][2],
                'location_y2': i['location'][3]
            })

    # 存储到数据库
    if is_save:
        db.session.bulk_insert_mappings(Category, category_data)
        db.session.commit()
        db.session.bulk_insert_mappings(Detection_image, image_data)
        db.session.commit()
        db.session.bulk_insert_mappings(Detection, detection_data)
        db.session.commit()

    # print(images)
    # image_data = base64.b64decode(images)
    # print(detection_result)
    return jsonify({'status': 200, 'message': 'success', 'results': res})


@app.route('/detectionResultes', methods=['GET'])
def getDetectionImages():
    pass
