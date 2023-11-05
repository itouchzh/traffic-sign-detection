import React, { useEffect, useState } from 'react'
import {
    DesktopOutlined,
    TeamOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    DownOutlined,
    UserOutlined,
    BarChartOutlined,
    FilePdfOutlined
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Breadcrumb, Layout, Menu, theme, Button, Dropdown, Space } from 'antd'
import { SelectInfo } from 'rc-menu/lib/interface'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { clearLocalStorage } from '@/utils/storage'
import { AllIcon } from '@/icons'
const { Header, Content, Footer, Sider } = Layout

type MenuItem = Required<MenuProps>['items'][number]
function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[]
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem
}

const siderMenuItems: MenuItem[] = [
    getItem('用户管理', '/home/user', <TeamOutlined />),
    getItem('交通标志检测', '/home/detection', <DesktopOutlined />),
    getItem('检测结果', '/home/results', <BarChartOutlined />),
    getItem('错误页面', '/home/error', <AllIcon />),
    getItem('论文信息', '/home/paper', <FilePdfOutlined />),
    // getItem('用户信息', '/home/user', <UserOutlined />),
    getItem('常用组件', '/home/commonComponents', <UserOutlined />, [
        getItem('按钮', '/home/commonComponents/button', <UserOutlined />),
        getItem('水印', '/home/commonComponents/watermark', <UserOutlined />),
    ]),
]

const Home: React.FC = () => {
    // 获取路由位置
    const location = useLocation()
    const [collapsed, setCollapsed] = useState(false)
    const [currentPage, setCurrentPage] = useState()
    // 初始展开
    let firstOpenKey: string = ''
    // 当前菜单展开项
    const [openKeys, setOpenKeys] = useState<string[]>([firstOpenKey])
    const navigate = useNavigate()
    const {
        token: { colorBgContainer },
    } = theme.useToken()
    // 设置面包屑
    const setBreadItem = () => {
        const { pathname } = location
        siderMenuItems.forEach((item: any) => {
            if (item.children) {
                item.children.map((value: any) => {
                    if (value?.key === pathname) {
                        setCurrentPage(value.label)
                    }
                })
            } else {
                if (item?.key === pathname) {
                    setCurrentPage(item.label)
                }
            }
        })
    }
    // 点击侧边栏获取路由
    const onSelect = (e: SelectInfo) => {
        navigate(`${e.key}`)
    }

    // SubMenu 展开/关闭的回调
    const handleOpenChange = (keys: string[]) => {
        setOpenKeys([keys.at(-1) as string])
    }

    // 下拉菜单
    // 退出系统，清空token，到登陆页面
    const handleLogout = () => {
        navigate('/login')
        clearLocalStorage()
    }
    const handlePersonalCenter = () => {}
    const items: MenuProps['items'] = [
        {
            key: '1',
            label: '退出',
            onClick: handleLogout,
            danger: true,
        },
        {
            key: '2',
            label: '个人中心',
            onClick: handlePersonalCenter,
        },
    ]

    const handleGoHome = (e: any) => {
        e.preventDefault()
        navigate('/home')
    }
    useEffect(() => {
        setBreadItem()
    }, [location])

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
                <Menu
                    theme="dark"
                    defaultSelectedKeys={[location.pathname]}
                    mode="inline"
                    items={siderMenuItems}
                    onSelect={(e) => onSelect(e)}
                    onOpenChange={handleOpenChange}
                    openKeys={openKeys}
                />
            </Sider>
            <Layout className="site-layout">
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        className="h-16 w-16 text-base"
                    />
                    <Dropdown menu={{ items }} className="float-right">
                        <a
                            onClick={(e) => {
                                e.preventDefault()
                            }}
                        >
                            <Space>
                                Admin
                                <DownOutlined />
                            </Space>
                        </a>
                    </Dropdown>
                </Header>
                <Content style={{ margin: '0 16px' }}>
                    <Breadcrumb
                        style={{ margin: '16px 0' }}
                        items={[
                            {
                                title: <a href="">主页</a>,
                                onClick: handleGoHome,
                            },
                            {
                                title: <a href="">{currentPage}</a>,
                            },
                        ]}
                    ></Breadcrumb>
                    <div style={{ padding: 24, minHeight: '90%', background: colorBgContainer }}>
                        <Outlet />
                    </div>
                </Content>
                <Footer className="text-center h-12">
                    traffic Detection ©2023 Created by rick_Han
                </Footer>
            </Layout>
        </Layout>
    )
}

export default React.memo(Home)
