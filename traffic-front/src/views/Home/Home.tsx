import React, { useEffect, useState } from 'react'
import {
    DesktopOutlined,
    TeamOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    DownOutlined,
    UserOutlined,
    BarChartOutlined,
    FilePdfOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Breadcrumb, Layout, Menu, theme, Button, Dropdown, Space } from 'antd'
import { SelectInfo } from 'rc-menu/lib/interface'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { clearLocalStorage } from '@/utils/storage'
import { RootState } from '@/state/store'
import { useSelector } from 'react-redux'
import IconFont from '@/components/SvgIcon'
const { Header, Content, Footer, Sider } = Layout

// type MenuItem = Required<MenuProps>['items'][number]
interface MenuItem {
    label: string
    key: string
    icon?: any
    children?: MenuItem[]
}
function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem
}

const siderMenuItems: MenuItem[] = [
    { label: '用户管理', key: '/home/user', icon: <UserOutlined /> },
    {
        label: '常用组件',
        key: '/home/commonComponents',
        icon: <UserOutlined />,
        children: [
            {
                label: '按钮',
                key: '/home/commonComponents/button',
                icon: <UserOutlined />,
            },
        ],
    },
]
const createMenuTree = (flatMenu: any[]): MenuItem[] => {
    const menuTree: MenuItem[] = []

    flatMenu.forEach((item: any) => {
        const pathSegments = item.path.split('/')
        pathSegments.reduce((acc: MenuItem[], segment: any, index: number) => {
            const existingNode = acc.find((node) => node.label === segment)
            if (!existingNode) {
                const newNode: MenuItem = {
                    label: index === pathSegments.length - 1 ? item.title : segment,
                    key: segment,
                    icon: index === pathSegments.length - 1 ? <IconFont type={item.icon} /> : '',
                    children: [],
                }

                acc.push(newNode)

                return newNode.children
            } else {
                if (index === pathSegments.length - 1) {
                    existingNode.icon = item.icon
                }
                return existingNode.children || []
            }
        }, menuTree)
    })

    // Remove empty children
    const removeEmptyChildren = (node: MenuItem) => {
        if (node.children && node.children.length === 0) {
            delete node.children
        } else if (node.children) {
            node.children.forEach(removeEmptyChildren)
        }
    }
    menuTree.forEach(removeEmptyChildren)
    let res = menuTree[0].children || []

    for (let j = 0; j < res.length; j++) {
        for (let i = 0; i < res.length; i++) {
            if (res[j].label === res[i].key && res[j].children!.length > 0) {
                res[j].children = res[j].children?.map((item: any) => ({
                    ...item,
                    key: res[i].key + '/' + item?.key,
                }))
                res[i].children = res[j].children
                res.splice(j, 1)
            }
        }
    }
    return res
}
// [
//     {
//         label: '用户管理',
//         key: 'user',
//         icon: 'asdf',
//         children: [],
//         path: 'home/user',
//     },
//     {
//         label: '交通标志检测',
//         key: 'detection',
//         icon: 'aaa',
//         children: [],
//         path: 'home/detection',
//     }
// ]

const Home: React.FC = () => {
    // 获取路由位置
    const location = useLocation()
    const [collapsed, setCollapsed] = useState(false)
    const [currentPage, setCurrentPage] = useState()
    const [siderMenuItems, setSiderMenuItems] = useState<MenuItem[]>([])
    const userInfo = useSelector((state: RootState) => state.user.userReducer.user)
    // 初始展开
    let firstOpenKey: string = ''
    // 当前菜单展开项
    const [openKeys, setOpenKeys] = useState<string[]>([firstOpenKey])
    const navigate = useNavigate()
    const {
        token: { colorBgContainer },
    } = theme.useToken()

    useEffect(() => {
        // const menuTree = createMenuTree(userInfo.menus)
        const menuTree = [
            {
                label: '用户管理',
                key: '/home/user',
                icon: <TeamOutlined />,
            },
            {
                label: '图片检测',
                key: '/home/detection',
                icon: <IconFont type="icon-tupian" style={{ color: 'white' }} />,
            },
            {
                label: '视频检测',
                key: '/home/detectionVideo',
                icon: <IconFont type="icon-shipin" style={{ color: 'white' }} />,
            },
            {
                label: '实时检测',
                key: '/home/realTime',
                icon: <IconFont type="icon-shishijiancexitong" />,
            },
            {
                label: '错误监控',
                key: '/home/totalError',
                icon: <IconFont type="icon-shishijiancexitong" />,
            },
            {
                label: '个人中心',
                key: '/home/personalCenter',
                icon: <UserOutlined />,
            },
        ]
        setSiderMenuItems(menuTree)
    }, [userInfo])
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
                <div
                    className="flex justify-center items-center text-[#a6adb4]"
                    style={{
                        height: 32,
                        margin: 16,
                        background: 'rgba(255, 255, 255, 0.2)',
                    }}
                >
                    <IconFont type="icon--jiaotongbiaozhipai"></IconFont>
                    {!collapsed && <span>交通标志检测系统</span>}
                </div>
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
                    <div
                        style={{
                            padding: 10,
                            height: '94%',
                            background: colorBgContainer,
                        }}
                    >
                        <Outlet />
                    </div>
                </Content>
                <Footer className="text-center h-12">traffic Detection ©2023 Created by rick_Han</Footer>
            </Layout>
        </Layout>
    )
}

export default React.memo(Home)
