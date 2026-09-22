import {type JSX, useEffect, useMemo, useRef, useState} from 'react';
import {Outlet, useLocation, useNavigate} from 'react-router-dom';
import type {MenuProps} from 'antd';
import {App as AntApp, Avatar, Button, ConfigProvider, Dropdown, Space, theme} from 'antd';
import {
    Activity,
    AlertTriangle,
    BookOpen,
    Eye,
    Globe,
    Key,
    LogOut,
    Moon,
    Server,
    Settings,
    Sun,
    User as UserIcon
} from 'lucide-react';
import {logout} from '@/api/auth.ts';
import type {User} from '@/types';
import {cn} from '@/lib/utils';
import {getServerVersion, type VersionInfo} from "@/api/version.ts";
import {flushSync} from "react-dom";
import {ScrollArea} from "@radix-ui/react-scroll-area";
import {useTheme} from '@/portal/contexts/ThemeContext';

interface NavItem {
    key: string;
    label: string;
    path: string;
    icon: JSX.Element;
}

const SIDEBAR_WIDTH = 240;
const HEADER_HEIGHT = 56;

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {message: messageApi, modal} = AntApp.useApp();
    const [userInfo, setUserInfo] = useState<User | null>(null);
    const [version, setVersion] = useState<VersionInfo>();
    const {appliedTheme, setTheme} = useTheme();
    const themeButtonRef = useRef<HTMLButtonElement>(null);

    const menuItems: NavItem[] = useMemo(
        () => [
            {
                key: 'agents',
                label: '探针管理',
                path: '/admin/agents',
                icon: <Server className="h-4 w-4" strokeWidth={2}/>,
            },
            {
                key: 'monitors',
                label: '服务监控',
                path: '/admin/monitors',
                icon: <Activity className="h-4 w-4" strokeWidth={2}/>,
            },
            {
                key: 'ddns',
                label: 'DDNS',
                path: '/admin/ddns',
                icon: <Globe className="h-4 w-4" strokeWidth={2}/>,
            },
            {
                key: 'comm-keys',
                label: '通信密钥',
                path: '/admin/api-keys',
                icon: <Key className="h-4 w-4" strokeWidth={2}/>,
            },
            {
                key: 'api-keys',
                label: 'API密钥',
                path: '/admin/manage-api-keys',
                icon: <Key className="h-4 w-4" strokeWidth={2}/>,
            },
            {
                key: 'alert-records',
                label: '告警记录',
                path: '/admin/alert-records',
                icon: <AlertTriangle className="h-4 w-4" strokeWidth={2}/>,
            },
            {
                key: 'settings',
                label: '系统设置',
                path: '/admin/settings',
                icon: <Settings className="h-4 w-4" strokeWidth={2}/>,
            },
        ],
        [],
    );

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userInfoStr = localStorage.getItem('userInfo');

        if (!token || !userInfoStr) {
            navigate('/login');
            return;
        }

        setUserInfo(JSON.parse(userInfoStr));

        // 获取服务端版本信息
        getServerVersion()
            .then((res) => {
                setVersion(res.data);
            })
            .catch((err) => {
                console.error('获取版本信息失败:', err);
            });
    }, [navigate, location]);

    const handleLogout = () => {
        modal.confirm({
            title: '确认退出',
            content: '确定要退出登录吗？',
            onOk: async () => {
                try {
                    await logout();
                } finally {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userInfo');
                    messageApi.success('已退出登录');
                    navigate('/');
                }
            },
        });
    };

    const userMenuItems: MenuProps['items'] = [
        {
            key: 'logout',
            icon: <LogOut size={16} strokeWidth={2}/>,
            label: '退出登录',
            onClick: handleLogout,
        },
    ];

    const handleNavigate = (item: NavItem) => {
        navigate(item.path);
    };

    // 切换主题的函数，带动画效果
    const toggleTheme = async () => {
        const newTheme = appliedTheme === 'dark' ? 'light' : 'dark';

        if (
            !themeButtonRef.current ||
            !document.startViewTransition ||
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ) {
            // 如果不支持 View Transition API 或用户偏好减少动画，直接切换
            setTheme(newTheme);
            return;
        }

        await document.startViewTransition(() => {
            flushSync(() => {
                setTheme(newTheme);
            });
        }).ready;

        const {top, left, width, height} = themeButtonRef.current.getBoundingClientRect();
        const x = left + width / 2;
        const y = top + height / 2;
        const right = window.innerWidth - left;
        const bottom = window.innerHeight - top;
        const maxRadius = Math.hypot(
            Math.max(left, right),
            Math.max(top, bottom),
        );

        document.documentElement.animate(
            {
                clipPath: [
                    `circle(0px at ${x}px ${y}px)`,
                    `circle(${maxRadius}px at ${x}px ${y}px)`,
                ],
            },
            {
                duration: 500,
                easing: 'ease-in-out',
                pseudoElement: '::view-transition-new(root)',
            }
        );
    };

    return (
        <ConfigProvider
            theme={{
                algorithm: appliedTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
            }}
        >
            <AntApp>
                <div className="command-shell min-h-screen dark:text-slate-100">
                    {/* 顶部导航栏 */}
                    <header
                        className="fixed inset-x-0 top-0 z-[300] h-14 border-b border-white/10 bg-[#1d2422]/98 backdrop-blur-xl">
                        <div className="flex h-full items-center justify-between px-4">
                            <div className="flex items-center gap-3 text-white">
                                <div className="flex items-center justify-center">
                                    <img
                                        src={"/api/logo?v=3"}
                                        alt="Logo"
                                        className="h-10 w-10 object-contain rounded-md"
                                        onError={(e) => {
                                            e.currentTarget.src = '/logo.svg';
                                        }}
                                    />
                                </div>
                                <div className="min-w-0">
                                    <p className="max-w-[120px] truncate text-sm font-semibold sm:max-w-[220px]">{window.SystemConfig?.SystemNameZh}</p>
                                    <p className="text-[11px] text-white/55">管理控制台</p>
                                </div>
                            </div>

                            <Space size={8} className="flex h-full items-center">
                                <Button
                                    type="text"
                                    icon={<Eye className="h-4 w-4" strokeWidth={2}/>}
                                    onClick={() => window.open('/', '_blank')}
                                    className="hidden !h-9 !items-center !rounded-md !px-3 !text-xs !text-white/80 hover:!bg-white/10 sm:!inline-flex"
                                >
                                    公共页面
                                </Button>
                                <Button
                                    type="text"
                                    icon={<BookOpen className="h-4 w-4" strokeWidth={2}/>}
                                    onClick={() => navigate('/admin/agents-install/one-click')}
                                    className="!h-9 !items-center !rounded-md !px-2 !text-xs !text-white hover:!bg-white/10 sm:!px-3"
                                >
                                    <span className="hidden sm:inline">部署指南</span>
                                </Button>

                                {/* 主题切换按钮 */}
                                <button
                                    ref={themeButtonRef}
                                    type="button"
                                    onClick={toggleTheme}
                                    className="inline-flex h-9 items-center rounded-md p-2 text-white/80 transition-colors hover:bg-white/10"
                                    title={appliedTheme === 'dark' ? "切换到浅色模式" : "切换到暗黑模式"}
                                >
                                    {appliedTheme === 'dark' ? (
                                        <Sun className="h-4 w-4" strokeWidth={2}/>
                                    ) : (
                                        <Moon className="h-4 w-4" strokeWidth={2}/>
                                    )}
                                </button>

                                <Dropdown menu={{items: userMenuItems}} placement="bottomRight" trigger={['click']}>
                                    <button
                                        type="button"
                                        className="flex cursor-pointer items-center gap-2 rounded-md border border-white/15 bg-white/5 px-2.5 py-1 text-left text-white transition-colors hover:bg-white/10"
                                    >
                                        <Avatar
                                            size={24}
                                            icon={<UserIcon className="h-3.5 w-3.5" strokeWidth={2}/>}
                                            className="!bg-white/20"
                                        />
                                        <span className="hidden text-xs font-medium sm:inline">
                                        {userInfo?.username || '访客'}
                                    </span>
                                    </button>
                                </Dropdown>
                            </Space>
                        </div>
                    </header>

                    {/* 侧边栏 */}
                    <aside
                        className="fixed left-0 z-[200] hidden h-screen overflow-hidden border-r border-slate-200 bg-white dark:border-[#303936] dark:bg-[#151a18] lg:block"
                        style={{
                            width: SIDEBAR_WIDTH,
                            paddingTop: HEADER_HEIGHT,
                        }}
                    >
                        <div className="flex h-full flex-col">
                            <div className="px-4 py-4">
                                <p className="text-xs font-medium text-slate-400 dark:text-slate-500">工作区</p>
                                <p className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100">管理面板</p>
                            </div>
                            {/* 菜单区域 */}
                            <ScrollArea className="px-3 pb-6 space-y-1 h-[calc(100vh-228px)]">
                                {menuItems.map((item) => {
                                    const isActive = location.pathname.startsWith(item.path);
                                    return (
                                        <button
                                            key={item.key}
                                            type="button"
                                            onClick={() => handleNavigate(item)}
                                            className={cn(
                                                'group relative flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                                                isActive
                                                    ? 'bg-teal-50 text-teal-800 dark:bg-teal-400/10 dark:text-teal-200'
                                                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5'
                                            )}
                                        >
                                            <span
                                                className={cn(
                                                    'flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-slate-500 dark:bg-[#222927] dark:text-slate-400',
                                                    isActive && 'bg-teal-700 text-white dark:bg-teal-400 dark:text-[#10201d]'
                                                )}
                                            >
                                                {item.icon}
                                            </span>
                                            <span className="truncate font-medium">{item.label}</span>
                                            {isActive &&
                                                    <span className="ml-auto text-[10px] text-teal-700 dark:text-teal-300">当前</span>}
                                        </button>
                                    );
                                })}
                            </ScrollArea>

                            {/* 版本信息 */}
                            {version && (
                                <div className="border-t border-gray-100 dark:border-slate-800 px-4 py-4">
                                    <div className="rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-[#303936] dark:bg-[#191e1c]">
                                        <p className="text-[11px] text-slate-400 dark:text-slate-500">版本信息</p>
                                        <div className="mt-2 flex items-end justify-between">
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">Server: {version.version}</p>
                                                <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">Agent: {version.agentVersion}</p>
                                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                                    {window.SystemConfig?.SystemNameEn}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>

                    {/* 主内容区 */}
                    <div className="flex flex-col"
                         style={{paddingTop: HEADER_HEIGHT, minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`}}>
                        {/* 内容区域 */}
                        <main className="flex-grow pb-20 pt-5 lg:ml-[240px] lg:pb-10">
                            <div className="mx-auto w-full max-w-[1600px] px-4 pb-4 lg:px-8">
                                <Outlet/>
                            </div>
                        </main>
                    </div>

                    {/* 移动端底部导航栏 */}
                    <nav
                        className="fixed inset-x-0 bottom-0 z-[300] border-t border-slate-200 bg-white/95 backdrop-blur-xl dark:border-[#303936] dark:bg-[#151a18]/95 lg:hidden">
                        <div className="grid h-16 grid-cols-7">
                            {menuItems.map((item) => {
                                const isActive = location.pathname.startsWith(item.path);
                                return (
                                    <button
                                        key={item.key}
                                        type="button"
                                        onClick={() => handleNavigate(item)}
                                        className={cn(
                                            'flex min-w-0 flex-col items-center justify-center gap-1 overflow-hidden text-[10px] font-medium',
                                            isActive ? 'text-teal-700 dark:text-teal-300' : 'text-slate-500 dark:text-slate-400'
                                        )}
                                    >
                                    <span
                                        className={cn('rounded-md p-1.5', isActive ? 'bg-teal-50 text-teal-700 dark:bg-teal-400/10 dark:text-teal-300' : 'text-current')}>
                                        {item.icon}
                                    </span>
                                        <span className="w-full truncate px-0.5 text-center">{item.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </nav>
                </div>
            </AntApp>
        </ConfigProvider>
    );
};

export default AdminLayout;
