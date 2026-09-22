import {useEffect, useMemo, useState} from 'react';
import {Link} from 'react-router-dom';
import {useQuery} from '@tanstack/react-query';
import {AlertTriangle, BarChart3, CheckCircle2, Globe, Loader2, Maximize2, Search, Shield, Zap} from 'lucide-react';
import {getPublicMonitors} from '@/api/monitor.ts';
import type {PublicMonitor} from '@/types';
import {cn} from '@/lib/utils.ts';
import StatBlock from "@portal/components/StatBlock.tsx";
import MonitorCard, {type DisplayMode} from "@portal/components/monitor/MonitorCard.tsx";

const LoadingSpinner = () => (
    <div className="flex min-h-[400px] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-600 dark:text-violet-500">
            <Loader2 className="h-8 w-8 animate-spin text-gray-600 dark:text-violet-500"/>
            <span className="text-sm font-mono">加载监控数据中...</span>
        </div>
    </div>
);

const EmptyState = () => (
    <div className="flex min-h-[400px] flex-col items-center justify-center text-gray-600 dark:text-violet-500">
        <Shield className="mb-4 h-16 w-16 opacity-20"/>
        <p className="text-lg font-medium font-mono">暂无监控数据</p>
        <p className="mt-2 text-sm text-gray-600 dark:text-violet-500">请先在管理后台添加监控任务</p>
    </div>
);


interface Stats {
    total: number;
    online: number;
    issues: number;
    avgLatency: number;
}

const MonitorList = () => {
    const [searchKeyword, setSearchKeyword] = useState('');
    const [displayMode, setDisplayMode] = useState<DisplayMode>('max');

    const {data: monitors = [], isLoading} = useQuery<PublicMonitor[]>({
        queryKey: ['publicMonitors'],
        queryFn: async () => {
            const response = await getPublicMonitors();
            return response.data || [];
        },
        refetchInterval: 30000,
    });

    let [stats, setStats] = useState<Stats>();

    // 过滤和搜索
    const filteredMonitors = useMemo(() => {
        let result = [...monitors];

        // 搜索过滤
        if (searchKeyword.trim()) {
            const keyword = searchKeyword.toLowerCase();
            result = result.filter(m =>
                m.name.toLowerCase().includes(keyword) ||
                m.target.toLowerCase().includes(keyword)
            );
        }

        return result.sort((a, b) => Number(a.status !== 'up') - Number(b.status !== 'up'));
    }, [monitors, searchKeyword]);

    // 统计信息
    const calculateStats = (monitors: PublicMonitor[]) => {
        const total = monitors.length;
        const online = monitors.filter(m => m.status === 'up').length;
        const issues = total - online;
        const avgLatency = total > 0
            ? Math.round(monitors.reduce((acc, curr) => acc + curr.responseTime, 0) / total)
            : 0;
        return {total, online, issues, avgLatency};
    }

    useEffect(() => {
        let stats = calculateStats(monitors);
        setStats(stats);
    }, [monitors]);

    if (isLoading) {
        return (
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                <LoadingSpinner/>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-[1440px] space-y-4 px-3 py-4 sm:space-y-5 sm:px-6 sm:py-7 lg:px-8">
            {/* 统计卡片 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
                <StatBlock
                    title="监控服务总数"
                    value={stats?.total}
                    icon={Globe}
                    color="cyan"
                />
                <StatBlock
                    title="系统正常"
                    value={stats?.online}
                    icon={CheckCircle2}
                    color="emerald"
                    glow
                />
                <StatBlock
                    title="异常服务"
                    value={stats?.issues}
                    icon={AlertTriangle}
                    color="rose"
                    alert={stats?.issues > 0}
                />
                <StatBlock
                    title="全局平均延迟"
                    value={stats?.avgLatency}
                    unit={'ms'}
                    icon={Zap}
                    color="blue"
                />
            </div>

            {/* 过滤和搜索 */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
                    {/* 显示模式切换 */}
                    <div className="flex items-center gap-1 rounded-md border border-slate-200 bg-slate-100 p-1 dark:border-[#303936] dark:bg-[#191e1c]">
                        <span className="px-2 text-xs text-slate-500 dark:text-slate-400">卡片指标</span>
                        <button
                            onClick={() => setDisplayMode('avg')}
                            className={cn(
                                "flex cursor-pointer items-center gap-1 rounded px-3 py-1.5 text-xs font-medium transition-colors",
                                displayMode === 'avg'
                                    ? 'bg-white text-teal-800 shadow-sm dark:bg-[#2a3431] dark:text-teal-200'
                                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                            )}
                        >
                            <BarChart3 className="w-3 h-3"/> 平均
                        </button>
                        <button
                            onClick={() => setDisplayMode('max')}
                            className={cn(
                                "flex cursor-pointer items-center gap-1 rounded px-3 py-1.5 text-xs font-medium transition-colors",
                                displayMode === 'max'
                                    ? 'bg-white text-teal-800 shadow-sm dark:bg-[#2a3431] dark:text-teal-200'
                                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                            )}
                        >
                            <Maximize2 className="w-3 h-3"/> 最差(Max)
                        </button>
                    </div>
                </div>

                {/* 搜索框 */}
                <div className="group relative w-full md:w-72">
                    <div className="relative flex items-center rounded-md border border-slate-200 bg-white focus-within:border-teal-600 dark:border-[#303936] dark:bg-[#191e1c] dark:focus-within:border-teal-400">
                        <Search className="ml-3 h-4 w-4 text-slate-400"/>
                        <input
                            type="text"
                            placeholder="搜索服务名称或地址..."
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            className="w-full border-none bg-transparent p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-0 dark:text-slate-100 dark:placeholder-slate-500"
                        />
                    </div>
                </div>
            </div>

            {/* 监控卡片列表 */}
            {filteredMonitors.length === 0 ? (
                <EmptyState/>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-4 gap-2">
                    {filteredMonitors.map(monitor => (
                        <Link key={monitor.id} to={`/monitors/${monitor.id}`}>
                            <MonitorCard
                                monitor={monitor}
                                displayMode={displayMode}
                            />
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MonitorList;
