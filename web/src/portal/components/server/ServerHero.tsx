import {ArrowLeft} from 'lucide-react';
import {formatBytes, formatDateTime, formatUptime} from '@/lib/format.ts';
import type {Agent, LatestMetrics} from '@/types';
import LittleStatCard from '@portal/components/LittleStatCard';
import CyberCard from "@portal/components/CyberCard.tsx";
import {StatusBadge} from "@portal/components/StatusBadge";

interface ServerHeroProps {
    agent: Agent;
    latestMetrics: LatestMetrics | null;
    onBack: () => void;
}

/**
 * 服务器头部信息组件
 * 显示服务器基本信息、状态和关键指标
 */
export const ServerHero = ({agent, latestMetrics, onBack}: ServerHeroProps) => {
    const displayName = agent?.name?.trim() ? agent.name : '未命名探针';
    const isOnline = agent?.status === 1;
    const statusDotStyles = isOnline ? 'bg-lime-500' : 'bg-rose-500';
    const statusText = isOnline ? '在线' : '离线';

    const platformDisplay = latestMetrics?.host?.platform
        ? `${latestMetrics.host.platform} ${latestMetrics.host.platformVersion || ''}`.trim()
        : agent?.os || '-';
    const architectureDisplay = latestMetrics?.host?.kernelArch || agent?.arch || '-';
    const uptimeDisplay = formatUptime(latestMetrics?.host?.uptime);
    const lastSeenDisplay = agent ? formatDateTime(agent.lastSeenAt) : '-';

    const networkSummary = latestMetrics?.network
        ? `${formatBytes(latestMetrics.network.totalBytesSentTotal)} ↑ / ${formatBytes(
            latestMetrics.network.totalBytesRecvTotal,
        )} ↓`
        : '—';

    const heroStats = [
        {label: '运行系统', value: platformDisplay || '-'},
        {label: '硬件架构', value: architectureDisplay || '-'},
        {label: '系统进程', value: latestMetrics?.host?.procs || '-'},
        {label: '运行时长', value: uptimeDisplay},
    ];

    return (
        <CyberCard className={'p-5 sm:p-6'}>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-4">
                        <button
                            type="button"
                            onClick={onBack}
                            className="group inline-flex items-center gap-2 text-xs font-medium text-slate-500 transition-colors hover:text-teal-700 dark:text-slate-400 dark:hover:text-teal-300"
                        >
                            <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-0.5"/>
                            返回概览
                        </button>
                        <div className="flex items-start gap-4">
                            <div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 sm:text-3xl">{displayName}</h1>
                                    <StatusBadge status={agent.status === 1 ? 'up' : 'down'}/>
                                </div>
                                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                    {[agent.hostname].filter(Boolean).join(' · ') || '-'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full lg:w-auto lg:min-w-[480px]">
                        {heroStats.map((stat) => (
                            <LittleStatCard key={stat.label} label={stat.label} value={stat.value}/>
                        ))}
                    </div>
                </div>
                <div
                    className="flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-[#303936] dark:text-slate-400">
                    <span>探针 ID：{agent.id}</span>
                    <span className="hidden h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700 sm:inline-block"/>
                    <span>版本：{agent.version || '-'}</span>
                    <span className="hidden h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700 sm:inline-block"/>
                    <span>网络累计：{networkSummary}</span>
                </div>
            </div>
        </CyberCard>
    );
};
