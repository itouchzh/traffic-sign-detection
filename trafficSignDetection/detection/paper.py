import io
from database.connection import *
from flask import jsonify, request
from sqlalchemy import desc
from utils.token import is_token_expired
from yolo.detect import *
from flask import send_file
import base64

@app.route('/get_pdf', methods=['POST'])
def get_pdf():
    if is_token_expired(request):
        return jsonify({'error': 'token错误'})
    # pdf_path ='G:\code\pycharm\dectection\project//trafficSignDetection\detection\pdfs\paper1.pdf'.replace('\\', '//')
    # # 生成或获取你的 PDF 文件，例如：pdf_path = 'path_to_your_pdf.pdf'
    # with open(pdf_path, 'rb') as pdf_file:
    #     pdf_content = pdf_file.read()
    # papers_data = [{
    #     "content":pdf_content,
    #     "title":'YOLO'
    # }]
    # db.session.bulk_insert_mappings(Papers, papers_data)
    # db.session.commit()
    # return "s"
    # return send_file(pdf_path, as_attachment=False)
    id = request.get_json('id')
    print(id)
    paper = Papers.query.get(id)
    
    # 使用 io.BytesIO 创建一个内存中的文件对象
    file_stream = io.BytesIO(paper.content)

    # 设置适当的 MIME 类型和文件名
    response = send_file(file_stream, mimetype='application/octet-stream', as_attachment=True,download_name=paper.title)
    return response