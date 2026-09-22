import type {FC} from 'react';
import {ArrowDown, ArrowUp, Network} from 'lucide-react';
import {formatBytes, formatSpeed} from '@/lib/format.ts';

interface NetworkStatCardProps {
    uploadRate: number;
    downloadRate: number;
    uploadTotal: number;
    downloadTotal: number;
}

const NetworkStatCard: FC<NetworkStatCardProps> = ({
    uploadRate,
    downloadRate,
    uploadTotal,
    downloadTotal
}) => {
    return (
        <div className="command-panel relative rounded-lg p-4 sm:p-5">
            <div className="relative z-10 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <div className="mb-3 text-xs font-medium text-slate-500 dark:text-slate-400">实时网络</div>
                    <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <ArrowUp className="h-3 w-3 flex-shrink-0 text-blue-600 dark:text-blue-300"/>
                            <span className="truncate font-medium text-slate-800 dark:text-slate-200">{formatSpeed(uploadRate)}</span>
                            <span className="hidden text-slate-400 sm:inline dark:text-slate-500">
                                ({formatBytes(uploadTotal)})
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <ArrowDown className="h-3 w-3 flex-shrink-0 text-teal-700 dark:text-teal-300"/>
                            <span className="truncate font-medium text-slate-800 dark:text-slate-200">{formatSpeed(downloadRate)}</span>
                            <span className="hidden text-slate-400 sm:inline dark:text-slate-500">
                                ({formatBytes(downloadTotal)})
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-50 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300">
                    <Network className="h-5 w-5"/>
                </div>
            </div>
        </div>
    );
};

export default NetworkStatCard;
