import os, cv2, random

os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"
random.seed(0)
import torch
import base64
import numpy as np
from io import BytesIO
from PIL import Image
# from utils.yolo_utils import non_max_suppression, letterbox, scale_coords, plot_one_box
from yolo.utils.yolo_utils import non_max_suppression, letterbox,scale_coords,plot_one_box

def jpg_to_base64():
    image_path = './00637.jpg'
    image = Image.open(image_path)
    with BytesIO() as buffer:
        image.save(buffer, format('JPEG'))
        image_bytes = buffer.getvalue()
    base64_string = base64.b64encode(image_bytes).decode('utf-8')
    print(base64_string)
    return base64_string

def base64_to_jpg(base64_string):
    # 将Base64字符串解码为字节流
    image_data = base64.b64decode(base64_string)

    # 创建BytesIO对象，并将字节流写入其中
    image_stream = BytesIO(image_data)

    # 使用PIL库打开图像
    image = Image.open(image_stream)

    # 可选：如果需要转换为JPEG格式，可以执行以下操作
    if image.format != 'JPEG':
        image = image.convert('RGB')
        image_stream = BytesIO()
        image.save(image_stream, format='JPEG')

    # 返回JPEG图像
    return image

def process_image(image):
    img = image
    image, ratio, dwdh = letterbox(img, new_shape=(640, 640), auto=False)
    image = image.transpose((2, 0, 1))[::-1]
    image = np.expand_dims(image, 0)
    image = np.ascontiguousarray(image)

    im = torch.from_numpy(image).float().cuda()
    im /= 255
    return im


def detect(im, img, names=None, colors=[255, 255, 255]):
    model = torch.jit.load(r'G://code//pycharm//dectection//project//trafficSignDetection//yolo//weights//best.pt')
    result = model(im)[0]
    result = non_max_suppression(result, 0.5, 0.65)[0]
    result[:, :4] = scale_coords(im.shape[2:], result[:, :4], img.shape)
    print(result)
    for *xyxy, conf, cls in result:
        label = f'{names[int(cls)]} {conf:.2f}'
        plot_one_box(xyxy, img, label=label, color=colors[int(cls)], line_thickness=3)

    return img


def get_result(base64_string=None):
    # base64_string = jpg_to_base64()
    names = ['danger', 'mandatory', 'prohibitory']
    colors = [[random.randint(0, 255) for _ in range(3)] for _ in names]
    # image = base64_to_jpg(base64_string)
    # 解码Base64数据
    image_data = base64.b64decode(base64_string)

    # 将解码后的数据转换为NumPy数组
    image_array = np.frombuffer(image_data, np.uint8)

    # 使用OpenCV将数组解码为图像
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
    im = process_image(image)
    res = detect(im, image, names=names, colors=colors)
    success, encoded_image = cv2.imencode('.jpg', res)

    if success:
        # 将编码后的图像数据转换为Base64字符串
        base64_image = base64.b64encode(encoded_image).decode('utf-8')
        # print(base64_image)
        return base64_image
    else:
        print("无法编码图像")
        return 'error'
    # cv2.imshow('image', res)
    # cv2.waitKey(0)
    # cv2.destroyAllWindows()
# get_result()

