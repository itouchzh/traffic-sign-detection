from connection import *
from flask import jsonify, request
from sqlalchemy import desc
from flask_cors import CORS

CORS(app, supports_credentials=True) 
@app.route('/test',methods=['GET'])
def test():
    return jsonify({'message': 'Hello, World!'}), 200

@app.route('/addReport', methods=['POST'])
def add_report():
    # 获取 POST 请求的 JSON 数据
    json_data = request.get_json()

    if json_data:
        # 处理请求的数据，这里只是简单打印
        real_data = json_data['data']
        for item in real_data:
            if item['subType'] == 'promise':
                page_url =item['pageURL']
                reason = item['reason']
                start_time = str(item['startTime'])
                sub_type = item['subType']
                error_type = item['type']
                occurrence_time=datetime.fromtimestamp(item['occurrenceTime'] / 1000)
                error = PromiseError(page_url=page_url, reason=reason, start_time=start_time,
                                sub_type=sub_type, error_type=error_type,occurrence_time = occurrence_time)
                db.session.add(error)
                db.session.commit()
            elif item['subType'] == 'resource':
                url=item['url']
                type = item['type']
                page_url = item['pageURL']
                reason = item['reason']
                start_time = str(item['startTime'])
                sub_type = item['subType']
                error_type = item['type']
                occurrence_time = datetime.fromtimestamp(item['occurrenceTime'] / 1000)
                html = item['html']
                resource_type = item['resourceType']
                paths = item['paths']
                error = ResourceError(url=url, type=type, page_url=page_url, reason=reason, start_time=start_time,html=html, sub_type=sub_type, error_type=error_type, occurrence_time=occurrence_time, resource_type=resource_type, paths=paths)
                db.session.add(error)
                db.session.commit()
            elif item['subType'] == 'js':
                msg = item['msg']
                line = item['line']
                column = item['column']
                error = item['error']
                sub_type = item['subType']
                page_url = item['pageURL']
                type = item['type']
                start_time = str(item['startTime'])
                occurrence_time = datetime.fromtimestamp(item['occurrenceTime'] / 1000)
                js_error = JsError(id=id, msg=msg, line=line, column=column, error=error, sub_type=sub_type, page_url=page_url, type=type, start_time=start_time, occurrence_time=occurrence_time)
                db.session.add(js_error)
                db.session.commit()
        # 在实际应用中，你可以进一步处理数据，例如存储到数据库或执行其他逻辑
        return jsonify({'message': '添加成功!'}), 200  # 返回 200 OK，表示接收成功
    else:
        return 'Invalid Request Data', 400  # 返回 400 Bad Request，表示
   
@app.route('/getError', methods=['GET'])
def get_error():
    promise_errors = PromiseError.query.order_by(desc(PromiseError.occurrence_time)).all()
    return jsonify([error.serialize() for error in promise_errors])
if __name__ == '__main__':
    app.run(debug=True,port=5001)