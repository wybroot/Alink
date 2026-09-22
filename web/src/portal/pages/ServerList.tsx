import {type ReactNode, useMemo, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useQuery} from '@tanstack/react-query';
import {
    Activity,
    AlertTriangle,
    ArrowDown,
    ArrowUp,
    Clock,
    Cpu,
    Filter,
    Globe,
    HardDrive,
    LinkIcon,
    MemoryStick,
    Network,
    Thermometer,
    UnlinkIcon
} from 'lucide-react';
import {getPublicTags, listAgents} from '@/api/agent.ts';
import type {Agent, LatestMetrics} from '@/types';
import {cn} from '@/lib/utils.ts';
import CompactResourceBar from "@portal/components/CompactResourceBar.tsx";
import StatBlock from "@portal/components/StatBlock.tsx";
import ServerCard from "@portal/components/ServerCard.tsx";
import NetworkStatCard from "@portal/components/NetworkStatCard.tsx";
import {formatBytes, formatSpeed, formatTime, formatUptime} from "@/lib/format.ts";
import {isExpired} from "@portal/utils/server.ts";
import {LoadingSpinner} from "@portal/components/LoadingSpinner.tsx";

interface AgentWithMetrics extends Agent {
    metrics?: LatestMetrics;
}

interface EmptyStateProps {
    title: string;
    description: string;
    extra?: ReactNode;
}

const EmptyState = ({title, description, extra}: EmptyStateProps) => (
    <div
        className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center dark:border-[#3b4541] dark:bg-[#191e1c]">
        <div className="flex h-14 w-14 items-center justify-center rounded-md bg-slate-100 text-slate-500 dark:bg-[#222927] dark:text-slate-400">
            <HardDrive className="h-7 w-7"/>
        </div>
        <h3 className="mt-4 text-base font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
        <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>
        {extra ? <div className="mt-4">{extra}</div> : null}
    </div>
);

const calculateNetworkSpeed = (metrics?: LatestMetrics) => {
    if (!metrics?.network) {
        return {upload: 0, download: 0};
    }
    return {
        upload: metrics.network.totalBytesSentRate,
        download: metrics.network.totalBytesRecvRate
    };
};

const calculateDiskUsage = (metrics?: LatestMetrics) => {
    if (!metrics?.disk) {
        return 0;
    }
    return metrics.disk.usagePercent;
};

const getTemperatures = (metrics?: LatestMetrics) => {
    if (!metrics?.temperature || metrics.temperature.length === 0) {
        return [];
    }
    // 返回所有温度数据
    return metrics.temperature.sort((a, b) => a.type.localeCompare(b.type));
};

const getTrafficProgressColor = (percent: number) => {
    if (percent >= 100) return 'bg-red-500';
    if (percent >= 90) return 'bg-orange-500';
    if (percent >= 80) return 'bg-yellow-500';
    return 'bg-lime-500';
};

const ServerList = () => {
    const navigate = useNavigate();
    const [selectedTag, setSelectedTag] = useState<string>('');

    const {data: agents = [], isLoading} = useQuery<AgentWithMetrics[]>({
        queryKey: ['agents', 'online'],
        queryFn: async () => {
            const response = await listAgents();
            return (response.data || []) as AgentWithMetrics[];
        },
        refetchInterval: 10000,
    });

    // 获取标签列表
    const {data: tagsData} = useQuery({
        queryKey: ['tags', 'public'],
        queryFn: async () => {
            const response = await getPublicTags();
            return response.data.tags || [];
        },
        refetchInterval: 30000,
    });

    // 计算所有标签（包括ALL和ONLINE/OFFLINE）
    const allTags = useMemo(() => {
        const tags = ['ALL', 'ONLINE', 'OFFLINE'];
        if (tagsData && tagsData.length > 0) {
            tagsData.forEach((tag: string) => {
                if (!tags.includes(tag.toUpperCase())) {
                    tags.push(tag.toUpperCase());
                }
            });
        }
        return tags;
    }, [tagsData]);

    // 过滤逻辑
    const displayAgents = useMemo(() => {
        if (selectedTag === 'ONLINE') {
            return agents.filter(a => a.status === 1);
        } else if (selectedTag === 'OFFLINE') {
            return agents.filter(a => a.status !== 1);
        } else if (selectedTag && selectedTag !== 'ALL') {
            return agents.filter(a => a.tags?.map(t => t.toUpperCase()).includes(selectedTag));
        }
        return agents;
    }, [agents, selectedTag]);

    // 计算统计数据（基于过滤后的 displayAgents）
    const stats = useMemo(() => {
        const total = displayAgents.length;
        const online = displayAgents.filter(a => a.status === 1).length;
        const offline = total - online;

        // 计算网络统计
        let totalUploadRate = 0;
        let totalDownloadRate = 0;
        let totalUploadTotal = 0;
        let totalDownloadTotal = 0;

        displayAgents.forEach(agent => {
            if (agent.status === 1 && agent.metrics?.network) {
                totalUploadRate += agent.metrics.network.totalBytesSentRate || 0;
                totalDownloadRate += agent.metrics.network.totalBytesRecvRate || 0;
                totalUploadTotal += agent.metrics.network.totalBytesSentTotal || 0;
                totalDownloadTotal += agent.metrics.network.totalBytesRecvTotal || 0;
            }
        });

        return {
            total,
            online,
            offline,
            uploadRate: totalUploadRate,
            downloadRate: totalDownloadRate,
            uploadTotal: totalUploadTotal,
            downloadTotal: totalDownloadTotal
        };
    }, [displayAgents]);

    const handleNavigate = (agentId: string) => {
        navigate(`/servers/${agentId.substring(0, 8)}`);
    };

    if (isLoading) {
        return <LoadingSpinner/>;
    }

    // debug
    // displayAgents = Array.from({length:10}, ()=>displayAgents).flat();

    return (
        <div className="mx-auto max-w-[1440px] space-y-4 px-3 py-4 sm:space-y-5 sm:px-6 sm:py-7 lg:px-8">
            <section className="command-overview rounded-lg px-5 py-5 sm:px-6 sm:py-6">
                <div className="relative z-10 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-medium text-teal-800 dark:text-teal-300">
                            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500"/>
                            实时数据已连接
                        </div>
                        <h2 className="mt-2 max-w-2xl text-2xl font-semibold text-slate-900 dark:text-slate-100 sm:text-3xl">
                            {window.SystemConfig?.SystemNameEn || 'ALINK MONITOR'}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {window.SystemConfig?.SystemNameZh || '实时探针监控系统'}
                        </p>
                    </div>

                    <div className="grid grid-cols-3 overflow-hidden rounded-md border border-slate-200 bg-white/70 dark:border-[#3b4945] dark:bg-black/10">
                        <div className="border-r border-slate-200 px-4 py-3 dark:border-[#3b4945]">
                            <p className="text-xs text-slate-500 dark:text-slate-400">全部</p>
                            <p className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">{stats.total}</p>
                        </div>
                        <div className="border-r border-slate-200 px-4 py-3 dark:border-[#3b4945]">
                            <p className="text-xs text-slate-500 dark:text-slate-400">在线</p>
                            <p className="mt-1 text-xl font-semibold text-emerald-700 dark:text-emerald-300">{stats.online}</p>
                        </div>
                        <div className="px-4 py-3">
                            <p className="text-xs text-slate-500 dark:text-slate-400">离线</p>
                            <p className="mt-1 text-xl font-semibold text-rose-700 dark:text-rose-300">{stats.offline}</p>
                        </div>
                    </div>
                </div>
            </section>
            {/* 统计卡片 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
                <StatBlock
                    title="设备总数"
                    value={stats?.total}
                    icon={Globe}
                    color="cyan"
                />
                <StatBlock
                    title="在线设备"
                    value={stats?.online}
                    icon={LinkIcon}
                    color="emerald"
                    glow
                />
                <StatBlock
                    title="离线设备"
                    value={stats.offline}
                    icon={UnlinkIcon}
                    color="rose"
                    alert={stats?.offline > 0}
                />
                <NetworkStatCard
                    uploadRate={stats?.uploadRate}
                    downloadRate={stats?.downloadRate}
                    uploadTotal={stats?.uploadTotal}
                    downloadTotal={stats?.downloadTotal}
                />
            </div>

            {/* 标签过滤器 */}
            {allTags.length > 1 && (
                <div className="flex flex-wrap items-center gap-1.5 border-y border-slate-200 py-3 dark:border-[#303936] sm:gap-2">
                    <div
                        className="mr-1 flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 sm:mr-2 sm:gap-2">
                        <Filter className="w-4 h-4"/>
                        <span className="hidden sm:inline">筛选</span>
                    </div>
                    {allTags.map(tag => {
                        const tagKey = tag === 'ALL' ? '' : tag;
                        let count = 0;
                        if (tag === 'ALL') count = agents.length;
                        else if (tag === 'ONLINE') count = agents?.filter(a => a.status === 1).length;
                        else if (tag === 'OFFLINE') count = agents?.filter(a => a.status !== 1).length;
                        else count = agents?.filter(a => a.tags?.map(t => t.toUpperCase()).includes(tag)).length;

                        if (count === 0 && tag !== 'ALL') return null;

                        return (
                            <button
                                key={tag}
                                onClick={() => setSelectedTag(tagKey)}
                                className={cn(
                                    "cursor-pointer rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
                                    selectedTag === tagKey
                                        ? 'border-teal-700 bg-teal-700 text-white dark:border-teal-400 dark:bg-teal-400 dark:text-[#10201d]'
                                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-[#303936] dark:bg-[#191e1c] dark:text-slate-300 dark:hover:border-[#46534f] dark:hover:bg-[#222927]'
                                )}
                            >
                                {tag} ({count})
                            </button>
                        );
                    })}
                </div>
            )}

            {/* 服务器列表 */}
            {displayAgents.length === 0 ? (
                <EmptyState
                    title={selectedTag ? '没有匹配的服务器' : '暂无在线服务器'}
                    description={selectedTag ? `标签 "${selectedTag}" 下暂无服务器` : '当前没有任何探针在线，请稍后再试。'}
                />
            ) : (
                <>
                    {/* 桌面端表格布局 */}
                    <div
                        className="command-panel hidden overflow-hidden rounded-lg md:block">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="border-b border-slate-200 bg-slate-50 text-xs font-medium text-slate-500 dark:border-[#303936] dark:bg-[#171c1a] dark:text-slate-400">
                                <th className="w-[250px] p-5 font-medium">设备</th>
                                <th className="p-5 font-medium">资源</th>
                                <th className="w-[180px] p-5 font-medium">实时速率</th>
                                <th className="w-[220px] p-5 font-medium">流量</th>
                                <th className="w-[150px] p-5 font-medium">连接</th>
                                <th className="w-[200px] p-5 font-medium">标签与到期时间</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-[#303936]">
                            {displayAgents.map(server => {
                                const isOnline = server.status === 1;
                                const cpuUsage = server.metrics?.cpu?.usagePercent ?? 0;
                                const memoryUsage = server.metrics?.memory?.usagePercent ?? 0;
                                const memoryTotal = server.metrics?.memory?.total ?? 0;
                                const memoryUsed = server.metrics?.memory?.used ?? 0;
                                const diskUsage = calculateDiskUsage(server.metrics);
                                const diskTotal = server.metrics?.disk?.total ?? 0;
                                const diskUsed = server.metrics?.disk?.used ?? 0;
                                const {upload, download} = calculateNetworkSpeed(server.metrics);
                                const temperatures = getTemperatures(server.metrics);
                                const netConn = server.metrics?.networkConnection;
                                const traffic = server.trafficStats;
                                const trafficUsagePercent = traffic?.enabled && traffic.limit > 0
                                    ? Math.min(100, (traffic.used / traffic.limit) * 100)
                                    : 0;

                                return (
                                    <tr
                                        key={server.id}
                                        tabIndex={0}
                                        onClick={() => handleNavigate(server.id)}
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter' || event.key === ' ') {
                                                event.preventDefault();
                                                handleNavigate(server.id);
                                            }
                                        }}
                                        className="group cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-[#222927]"
                                    >
                                        {/* Identity */}
                                        <td className="p-4 align-top">
                                            <div className="flex items-center gap-4">
                                                <div className="space-y-1">
                                                    <div
                                                        className={cn(
                                                            'text-sm font-semibold text-slate-800 transition-colors dark:text-slate-100',
                                                            isExpired(server.expireTime) ? 'text-red-600 dark:text-red-400' : ''
                                                        )}>
                                                        {server.name}
                                                    </div>
                                                    <div
                                                        className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                                        <span>{server.os}</span>
                                                        <span className="h-2 w-px bg-slate-300 dark:bg-slate-700"></span>
                                                        <span>{server.arch}</span>
                                                    </div>
                                                    {isOnline && server.metrics?.host && (
                                                        <div className="flex items-center gap-3 text-xs font-mono mt-1">
                                                            <div
                                                                className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                                                                <Clock className="w-3 h-3"/>
                                                                <span>{formatUptime(server.metrics.host.uptime)}</span>
                                                            </div>
                                                            <div
                                                                className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                                                                <Activity className="w-3 h-3"/>
                                                                <span>{server.metrics.host.procs} 进程</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Resources */}
                                        <td className="p-4 align-top">
                                            {isOnline ? (
                                                <div className="flex flex-col justify-center h-full gap-0.5">
                                                    <CompactResourceBar
                                                        value={cpuUsage}
                                                        label="CPU"
                                                        icon={Cpu}
                                                        subtext={server.metrics?.cpu ? `${server.metrics.cpu.modelName} (${server.metrics.cpu.physicalCores}核)` : undefined}
                                                        color="bg-indigo-500"
                                                    />
                                                    <CompactResourceBar
                                                        value={memoryUsage}
                                                        label="RAM"
                                                        icon={MemoryStick}
                                                        subtext={`${formatBytes(memoryUsed, 1)}/${formatBytes(memoryTotal, 1)}`}
                                                        color="bg-fuchsia-500"
                                                    />
                                                    <CompactResourceBar
                                                        value={diskUsage}
                                                        label="DSK"
                                                        icon={HardDrive}
                                                        subtext={`${formatBytes(diskUsed, 1)}/${formatBytes(diskTotal, 1)}`}
                                                        color="bg-lime-500"
                                                    />
                                                    {temperatures.length > 0 && (
                                                        <div
                                                            className="flex items-center gap-2 mt-1 text-xs font-mono flex-wrap">
                                                            <Thermometer className="w-3 h-3 text-orange-400"/>
                                                            {temperatures.map((temp, index) => (
                                                                <span key={index} className="flex items-center gap-1">
                                                                    <span
                                                                        className="text-orange-400">{temp.temperature?.toFixed(1)}°C</span>
                                                                    <span
                                                                        className="text-slate-500 dark:text-slate-400">{temp.type}</span>
                                                                    {index < temperatures.length - 1 &&
                                                                        <span className="text-slate-300 dark:text-slate-700">|</span>}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div
                                                    className="text-xs text-rose-500 font-mono flex items-center gap-2 py-4">
                                                    <AlertTriangle className="w-4 h-4"/>
                                                    <span>设备离线，等待重新连接</span>
                                                </div>
                                            )}
                                        </td>

                                        {/* Network */}
                                        <td className="p-4 font-mono text-xs align-top">
                                            <div className="flex flex-col gap-1.5 mb-1.5">
                                                <span
                                                            className="flex items-center gap-2 text-teal-700 dark:text-teal-300">
                                                    <ArrowDown className="w-3 h-3"/>
                                                    <span>{formatSpeed(download)}</span>
                                                </span>
                                                <span
                                                            className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                                                    <ArrowUp className="w-3 h-3"/>
                                                    <span>{formatSpeed(upload)}</span>
                                                </span>
                                            </div>
                                        </td>

                                        {/* Traffic */}
                                        <td className="p-4 font-mono text-xs align-top">
                                            {traffic?.enabled ? (
                                                <div className="flex flex-col gap-1.5">
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">
                                                        {traffic.type === 'recv' ? '进站' : traffic.type === 'send' ? '出站' : '全部'}流量
                                                    </div>
                                                    {traffic.limit > 0 ? (
                                                        <>
                                                            <div className="flex items-baseline justify-between">
                                                                <span className="text-xs text-slate-600 dark:text-slate-300">
                                                                    {formatBytes(traffic.used, 1)} / {formatBytes(traffic.limit, 1)}
                                                                </span>
                                                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                                                                    {trafficUsagePercent.toFixed(1)}%
                                                                </span>
                                                            </div>
                                                            <div className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-[#303936]">
                                                                <div
                                                                    className={`h-full transition-all ${getTrafficProgressColor(trafficUsagePercent)}`}
                                                                    style={{width: `${trafficUsagePercent}%`}}
                                                                />
                                                            </div>
                                                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                                                重置日期: 每月 {traffic.resetDay} 号
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="text-xs text-slate-500 dark:text-slate-400">
                                                            已使用: {formatBytes(traffic.used, 1)}
                                                            <div className="mt-1 text-xs text-slate-400 dark:text-slate-500">仅统计模式</div>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-slate-400">-</div>
                                            )}
                                        </td>

                                        {/* Connections */}
                                        <td className="p-4 font-mono text-xs align-top">
                                            {isOnline && netConn ? (
                                                <div className="flex flex-col gap-1.5">
                                                    <div className="flex items-center gap-2">
                                                        <Network
                                                            className="w-3 h-3 text-lime-600 dark:text-lime-400"/>
                                                        <span
                                                            className="text-lime-600 dark:text-lime-400">{netConn.established || 0}</span>
                                                        <span
                                                            className="text-slate-500 dark:text-slate-400">已建立</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Network className="w-3 h-3 text-indigo-600 dark:text-indigo-400"/>
                                                        <span
                                                            className="text-indigo-600 dark:text-indigo-400">{netConn.listen || 0}</span>
                                                        <span className="text-slate-500 dark:text-slate-400">监听</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Network className="w-3 h-3 text-rose-600 dark:text-rose-400"/>
                                                        <span
                                                            className="text-rose-600 dark:text-rose-400">{netConn.closeWait || 0}</span>
                                                        <span
                                                            className="text-slate-500 dark:text-slate-400">等待关闭</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-slate-400">-</div>
                                            )}
                                        </td>

                                        {/* Meta */}
                                        <td className="p-4 align-top">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex gap-1 flex-wrap">
                                                    {server.tags && server.tags.length > 0 && server.tags.map(tag => (
                                                        <span key={tag}
                                                              className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-xs text-slate-600 dark:border-[#3b4541] dark:bg-[#222927] dark:text-slate-300">
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div
                                                    className={cn(
                                                        `flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400`,
                                                        // 剩余时间小于 30 天时显示为红色
                                                        isExpired(server.expireTime) ? 'text-red-600 dark:text-red-400' : ''
                                                    )}>

                                                    {server.expireTime > 0 &&
                                                        <div className={'flex items-center gap-1'}>
                                                            <div>到期：{new Date(server.expireTime).toLocaleDateString('zh-CN')}</div>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>

                    {/* 移动端卡片布局 */}
                    <div className="md:hidden flex flex-col gap-2">
                        {displayAgents.map(server => (
                            <ServerCard
                                key={server.id}
                                server={server}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default ServerList;
