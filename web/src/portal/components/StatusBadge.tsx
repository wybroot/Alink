import {cn} from '@/lib/utils.ts';

interface StatusBadgeProps {
    status: string;
}

export const StatusBadge = ({status}: StatusBadgeProps) => {
    const styles = {
        up: "bg-lime-500/10 dark:bg-lime-500/10 text-lime-400 dark:text-lime-400 border-lime-500/80",
        down: "bg-rose-500/10 dark:bg-rose-500/10 text-rose-400 dark:text-rose-400 border-rose-500/80",
        unknown: "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-300 border-slate-200 dark:border-slate-700",
    };

    const labels = {
        up: "正常",
        down: "异常",
        unknown: "未知",
    };

    const style = styles[status as keyof typeof styles] || styles.unknown;
    const label = labels[status as keyof typeof labels] || labels.unknown;


    return (
        <span
            className={cn("px-2.5 py-0.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 w-fit", style)}>
            <span className={cn(
                "w-1.5 h-1.5 rounded-full animate-pulse",
                status === 'up' ? 'bg-lime-500 dark:bg-lime-400' :
                    status === 'down' ? 'bg-rose-500 dark:bg-rose-400' :
                        'bg-slate-400 dark:bg-slate-400'
            )}/>
            {label}
        </span>


    );
};
