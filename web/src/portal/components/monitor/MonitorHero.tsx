import {ArrowLeft} from 'lucide-react';
import {TypeIcon} from './TypeIcon';
import {StatusBadge} from '@portal/components/StatusBadge';
import {CertBadge} from './CertBadge';
import LittleStatCard from '@portal/components/LittleStatCard';
import type {PublicMonitor} from '@/types';
import CyberCard from "@portal/components/CyberCard.tsx";
import {formatDateTime} from "@/lib/format.ts";

interface MonitorHeroProps {
    monitor: PublicMonitor;
    onBack: () => void;
}

/**
 * 监控详情头部组件
 * 显示监控基本信息、状态和关键指标
 */
export const MonitorHero = ({monitor, onBack}: MonitorHeroProps) => {
    return (
        <CyberCard className={'space-y-6 p-5 sm:p-6'}>
            {/* 返回按钮 */}
            <button
                type="button"
                onClick={onBack}
                className="group inline-flex items-center gap-2 text-xs font-medium text-slate-500 transition-colors hover:text-teal-700 dark:text-slate-400 dark:hover:text-teal-300"
            >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1"/>
                返回监控列表
            </button>

            {/* 监控信息 */}
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="flex-shrink-0 rounded-md border border-slate-200 bg-slate-100 p-3 dark:border-[#303936] dark:bg-[#222927]">
                        <TypeIcon type={monitor.type}/>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h1 className="truncate text-2xl font-semibold text-slate-900 dark:text-slate-100 sm:text-3xl">{monitor.name}</h1>
                            <StatusBadge status={monitor.status}/>
                        </div>
                        <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                            {monitor.showTargetPublic ? monitor.target : '******'}
                        </p>
                    </div>
                </div>

                {/* 统计卡片 */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full lg:w-auto lg:min-w-[480px]">
                    <LittleStatCard
                        label="监控类型"
                        value={monitor.type.toUpperCase()}
                    />
                    <LittleStatCard
                        label="探针数量"
                        value={monitor.agentCount}
                    />
                    <LittleStatCard
                        label="平均响应"
                        value={`${monitor.responseTime}ms`}
                    />
                    <LittleStatCard
                        label="最慢响应"
                        value={`${monitor.responseTimeMax}ms`}
                    />
                </div>
            </div>

            {/* 证书信息（如果存在证书数据）*/}
            {monitor.certExpiryTime > 0 && (
                <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 dark:border-[#303936]">
                    <span className="text-xs text-slate-500 dark:text-slate-400">SSL 证书</span>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                        <CertBadge
                            expiryTime={monitor.certExpiryTime}
                            daysLeft={monitor.certDaysLeft}
                        />
                        <span className="break-all text-xs text-slate-500 dark:text-slate-400 sm:break-normal">
                            到期时间: {formatDateTime(monitor.certExpiryTime)}
                        </span>
                    </div>
                </div>
            )}
        </CyberCard>
    );
};
