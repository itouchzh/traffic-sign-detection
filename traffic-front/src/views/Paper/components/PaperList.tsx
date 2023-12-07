import {
    LikeOutlined,
    DownloadOutlined,
    GithubOutlined,
} from '@ant-design/icons'
import React from 'react'
import { Card, List, Space } from 'antd'
const data = [
    {
        href: 'https://kns.cnki.net/kcms2/article/abstract?v=AnKLoVmldNSfBDywsovaoWqYQzMVihterYsq-Lc7dj5X9e4ms082Wg916N87QKDwxvKcx8SwvqC1Nbj89joCpXdEEjJzwbpRTTedABF-ykhBsdU-ne6FSybqq8uGRxmWlndMsLYza20U1Sq1Rauicg==&uniplatform=NZKPT&language=CHS',
        title: '融合坐标注意力和BiFPN的YOLOv5s交通标志检测方法',
        description: 'Improving YOLOv5 for traffic sign detection',
        content:
            '针对不同光照条件下的小目标交通标志检测存在的不易检测、错检等问题，提出了一种融合坐标注意力机制和双向加权特征金字塔(BiFPN)的YOLOv5s交通标志检测方法。首先，在特征提取网络中融入坐标注意力机制，提升网络对重要特征的关注程度，增加模型在不同光照条件下的检测能力；其次，在特征融合网络中使用BiFPN,提升模型的特征融合能力，改善对小目标交通标志的检测能力；最后，考虑到真实框与预测框之间的方向匹配问题，将CIoU损失函数改为SIoU损失函数，进一步提升模型的检测性能。在GTSDB数据集上进行验证，与原始模型相比，平均精度均值(mAP)提升了3.9%,推理时间为2.5 ms,能够达到实时检测的标准。',
        image: require('../../../assets/images/yolo1.png'),
    },
    {
        href: 'https://link.springer.com/article/10.1007/s11227-023-05547-y',
        title: 'YOLO-SG: Small traffic signs detection method in complex scene',
        description: 'Improving YOLOv5 for traffic sign detection',
        content:
            'Fast and accurate detection of traffic signs is crucial for the development of intelligent transportation systems. To address the issue of false detection and missing detection of small traffic signs in complex scenes, this paper proposes a YOLO-SG model based on YOLOv5. The YOLO-SG approach employs SPD-Conv as a down-sampling structure to mitigate the loss of feature information during the down-sampling process. This enhances the detection performance of small objects in complex scenes and improves the generalization and robustness of the model. The feature extraction architecture uses GhostNet, which effectively reduces the number of model parameters and weight, enhancing the feasibility of practical model deployment. Furthermore, this study optimizes the output feature structure by introducing a small object detection layer and removing the large object detection layer, enabling the detection of small objects. Extensive experiments conducted on the GTSDB and TT100K datasets demonstrate that YOLO-SG exhibits excellent detection performance. On the GTSDB dataset, YOLO-SG achieved a 2.3% increase in mAP compared to the baseline network, while reducing the number of parameters by 42%. Similarly, on the TT100K dataset, YOLO-SG increased mAP by 6.3% and reduced the number of parameters by 43%. These experimental results showcase the effectiveness and accuracy of YOLO-SG, particularly in detecting small traffic signs.',
        image: require('../../../assets/images/std.jpg'),
    },
]

const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
    <Space className="cursor-pointer">
        {React.createElement(icon)}
        <div>{text}</div>
    </Space>
)

interface PaperListProps {}
const PaperList: React.FC = () => (
    <List
        itemLayout="vertical"
        size="large"
        dataSource={data}
        footer={<div></div>}
        renderItem={(item) => (
            <Card className=" mb-3" hoverable>
                <List.Item
                    style={{ height: '250px', overflow: 'auto' }}
                    key={item.title}
                    actions={[
                        <IconText icon={DownloadOutlined} text="下载" key="list-vertical-star-o" />,
                        <IconText icon={LikeOutlined} text="查看" key="list-vertical-like-o" />,
                        <IconText
                            icon={GithubOutlined}
                            text="github"
                            key="list-vertical-message"
                        />,
                    ]}
                    extra={<img width={272} alt="logo" src={item.image} />}
                >
                    <List.Item.Meta
                        // avatar={<Avatar src={item.avatar} />}
                        title={<a href={item.href}>{item.title}</a>}
                        description={item.description}
                    />
                    {item.content}
                </List.Item>
            </Card>
        )}
    />
)

export default PaperList
