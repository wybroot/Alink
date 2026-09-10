// 统计卡片组件
import {cn} from "@/lib/utils.ts";

interface Props {
    title: string;
    value: any;
    unit?: string
    icon: any;
    color: string;
    alert?: boolean,
    glow?: boolean,
}

const StatBlock = ({title, value, unit, icon: Icon, color, alert, glow}: Props) => {

    const colorMap = {
        cyan: 'dark:text-violet-400 dark:border-violet-500/30 dark:bg-violet-500/5',
        emerald: 'dark:text-lime-400 dark:border-lime-500/30 dark:bg-lime-500/5',
        rose: 'dark:text-rose-400 dark:border-rose-500/30 dark:bg-rose-500/5',
        purple: 'dark:text-fuchsia-400 dark:border-fuchsia-500/30 dark:bg-fuchsia-500/5'
    };
    const style = colorMap[color] || colorMap.cyan;

    const iconColor = {
        cyan: 'text-violet-400',
        emerald: 'text-lime-400',
        rose: 'text-rose-400',
        purple: 'text-fuchsia-400'
    }
    let iconStyle = iconColor[color] || colorMap.cyan;

    return (
        <div
            className={cn(
                `command-panel command-panel--scan relative overflow-hidden rounded-lg border p-5`,
                'bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm',
                style,
                alert && 'bg-rose-500/10 command-beacon',
                glow && 'shadow-[0_0_32px_rgba(16,185,129,0.14)]',
            )}>
            <div className="absolute -right-4 -bottom-4 opacity-10 rotate-[-15deg]"><Icon className="w-24 h-24"/></div>
            <div className="relative z-10 flex justify-between items-start">
                <div>
                    <div className="text-xs font-bold font-mono uppercase tracking-widest opacity-70 mb-2">{title}</div>
                    <div className="text-4xl font-black tracking-[0.03em] flex items-baseline gap-1">{value}{unit &&
                        <span className="text-sm font-normal opacity-60 ml-1">{unit}</span>}</div>
                </div>
                <div className={`p-3 border border-current/15 bg-current/5`}>
                    <Icon className={cn("w-6 h-6", iconStyle)}/>
                </div>
            </div>
        </div>
    );
};

export default StatBlock;
