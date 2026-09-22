import {useEffect, useState} from 'react';
import {Activity, LogIn, Menu, Moon, ServerIcon, Settings, Sun, X} from 'lucide-react';
import {Link, useLocation} from "react-router-dom";
import {useTheme} from '../contexts/ThemeContext';
import {getCurrentUser} from "@/api/auth.ts";

const PublicHeader = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const {appliedTheme, setTheme} = useTheme();
    let location = useLocation();


    useEffect(() => {
        // 检查本地是否有 token
        const token = localStorage.getItem('token');
        const userInfo = localStorage.getItem('userInfo');

        if (!token || !userInfo) {
            setIsLoggedIn(false);
            return;
        }

        // 调用后端接口验证 token 是否有效
        getCurrentUser()
            .then(() => {
                setIsLoggedIn(true);
            })
            .catch(() => {
                // token 无效,清除本地存储
                localStorage.removeItem('token');
                localStorage.removeItem('userInfo');
                setIsLoggedIn(false);
            });
    }, []);

    // 时钟特效
    useEffect(() => {
        const t = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    // 判断导航是否激活
    const currentPath = location.pathname;

    let activeTab = 'servers';

    if (currentPath.startsWith('/monitors')) {
        activeTab = 'monitors';
    }

    let systemName = window.SystemConfig?.SystemNameEn;

    let leftName = '';
    let rightName = '';

    if (systemName) {
        // 优先在空格处分割
        const spaceIndex = systemName.indexOf(' ');
        if (spaceIndex > 0) {
            leftName = systemName.substring(0, spaceIndex);
            rightName = systemName.substring(spaceIndex); // 保留空格
        } else {
            // 如果没有空格，从中间分割
            const mid = Math.floor(systemName.length / 2);
            leftName = systemName.substring(0, mid);
            rightName = systemName.substring(mid);
        }
    }

    return (
        <>
            <header
                className="fixed inset-x-0 top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xl transition-colors duration-300 dark:border-[#303936] dark:bg-[#151a18]/95">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-[72px] sm:px-6 lg:px-8">
                    <div className="flex items-center gap-6 lg:gap-10">
                        <Link to={'/'}>
                            <div className="group flex cursor-pointer items-center gap-3">
                                <div className="relative flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-slate-50 dark:border-[#35413e] dark:bg-[#202825]">
                                    <img
                                        src={"/api/logo?v=3"}
                                        className="h-8 w-8 rounded object-contain"
                                        alt={'logo'}
                                        onError={(e) => {
                                            e.currentTarget.src = '/logo.svg';
                                        }}
                                    />
                                </div>
                                <div>
                                    <h1 className="text-base font-semibold text-slate-900 dark:text-slate-100 sm:text-lg">
                                        {leftName}<span>{rightName}</span>
                                    </h1>
                                    <p className="mt-0.5 hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
                                        {window.SystemConfig?.SystemNameZh}
                                    </p>
                                </div>
                            </div>
                        </Link>

                        <div className="hidden items-center gap-1 md:flex">
                            {[
                                {id: 'servers', icon: ServerIcon, label: '设备监控', to: '/'},
                                {id: 'monitors', icon: Activity, label: '服务监控', to: '/monitors'}
                            ].map(tab => (
                                <Link to={tab.to} key={tab.id}>
                                    <button
                                        className={`
                          group flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors cursor-pointer
                          ${activeTab === tab.id ? 'bg-teal-50 text-teal-800 dark:bg-teal-400/10 dark:text-teal-200' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/5 dark:hover:text-slate-100'}
                        `}
                                    >
                                        <tab.icon
                                            className={`h-4 w-4 ${activeTab === tab.id ? 'text-teal-700 dark:text-teal-300' : 'text-slate-400'}`}/>
                                        {tab.label}
                                    </button>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Desktop Right Section */}
                    <div className="hidden md:flex items-center gap-2">
                        <div className="hidden flex-col items-end lg:flex">
                            <span
                                className="text-xs font-semibold text-slate-700 dark:text-slate-200">{currentTime.toLocaleTimeString()}</span>
                            <span
                                className="text-[11px] text-slate-400 dark:text-slate-500">{currentTime.toLocaleDateString()}</span>
                        </div>
                        <div className="hidden h-6 w-px bg-slate-200 dark:bg-[#35413e] lg:block"></div>

                        {/* 主题切换按钮 - Desktop */}
                        <button
                            onClick={() => setTheme(appliedTheme === 'dark' ? 'light' : 'dark')}
                            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
                            title={appliedTheme === 'dark' ? '切换到浅色模式' : '切换到暗黑模式'}
                        >
                            {appliedTheme === 'dark' ? (
                                <Sun className="w-4 h-4"/>
                            ) : (
                                <Moon className="w-4 h-4"/>
                            )}
                        </button>

                        {/* 登录/管理后台按钮 - Desktop */}
                        {isLoggedIn ? (
                            <a
                                href="/admin"
                                className="group flex items-center gap-2 rounded-md bg-teal-700 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-teal-800 dark:bg-teal-400 dark:text-[#10201d] dark:hover:bg-teal-300"
                                target="_blank"
                            >
                                <Settings className="w-3 h-3 group-hover:rotate-90 transition-transform"/>
                                <span>管理后台</span>
                            </a>
                        ) : (
                            <a
                                href="/login"
                                className="group flex items-center gap-2 rounded-md bg-teal-700 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-teal-800 dark:bg-teal-400 dark:text-[#10201d] dark:hover:bg-teal-300"
                                target="_blank"
                            >
                                <LogIn className="w-3 h-3"/>
                                <span>登录</span>
                            </a>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="rounded-md p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5 md:hidden"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? (
                            <X className="w-6 h-6"/>
                        ) : (
                            <Menu className="w-6 h-6"/>
                        )}
                    </button>
                </div>
            </header>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 top-16 z-30 bg-white/98 backdrop-blur-xl dark:bg-[#151a18]/98 sm:top-[72px] md:hidden">
                    <div className="flex flex-col gap-3 p-4">
                        {/* Mobile Navigation */}
                        {[
                            {id: 'servers', icon: ServerIcon, label: '设备监控', to: '/'},
                            {id: 'monitors', icon: Activity, label: '服务监控', to: '/monitors'}
                        ].map(tab => (
                            <Link
                                to={tab.to}
                                key={tab.id}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`
                                    flex items-center gap-3 rounded-md border p-4 transition-colors
                                    ${activeTab === tab.id
                                    ? 'border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-400/30 dark:bg-teal-400/10 dark:text-teal-200'
                                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-[#303936] dark:bg-[#191e1c] dark:text-slate-300 dark:hover:bg-[#222927]'
                                }
                                `}
                            >
                                <tab.icon className="w-5 h-5"/>
                                <span className="font-semibold">{tab.label}</span>
                            </Link>
                        ))}

                        {/* Divider */}
                        <div className="my-2 h-px bg-slate-200 dark:bg-[#303936]"></div>

                        {/* Mobile Theme Toggle Button */}
                        <button
                            onClick={() => setTheme(appliedTheme === 'dark' ? 'light' : 'dark')}
                            className="flex w-full items-center justify-center gap-3 rounded-md border border-slate-200 bg-white p-4 font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-[#303936] dark:bg-[#191e1c] dark:text-slate-200 dark:hover:bg-[#222927]"
                        >
                            {appliedTheme === 'dark' ? (
                                <>
                                    <Sun className="w-5 h-5"/>
                                    <span>切换到浅色模式</span>
                                </>
                            ) : (
                                <>
                                    <Moon className="w-5 h-5"/>
                                    <span>切换到暗黑模式</span>
                                </>
                            )}
                        </button>

                        {/* Mobile Login/Admin Button */}
                        {isLoggedIn ? (
                            <a
                                href="/admin"
                                target="_blank"
                                className="flex items-center justify-center gap-3 rounded-md bg-teal-700 p-4 font-semibold text-white transition-colors hover:bg-teal-800 dark:bg-teal-400 dark:text-[#10201d]"
                            >
                                <Settings className="w-5 h-5"/>
                                <span>管理后台</span>
                            </a>
                        ) : (
                            <a
                                href="/login"
                                target="_blank"
                                className="flex items-center justify-center gap-3 rounded-md bg-teal-700 p-4 font-semibold text-white transition-colors hover:bg-teal-800 dark:bg-teal-400 dark:text-[#10201d]"
                            >
                                <LogIn className="w-5 h-5"/>
                                <span>登录</span>
                            </a>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default PublicHeader;
