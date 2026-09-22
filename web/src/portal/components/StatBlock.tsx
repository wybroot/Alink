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

    const iconColor = {
        cyan: 'bg-teal-50 text-teal-700 dark:bg-teal-400/10 dark:text-teal-300',
        blue: 'bg-blue-50 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300',
        emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300',
        rose: 'bg-rose-50 text-rose-700 dark:bg-rose-400/10 dark:text-rose-300',
        purple: 'bg-violet-50 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300'
    }
    const iconStyle = iconColor[color] || iconColor.cyan;

    return (
        <div
            className={cn(
                'command-panel relative rounded-lg p-4 sm:p-5',
                alert && 'border-rose-300 dark:border-rose-400/35',
                glow && 'border-emerald-300 dark:border-emerald-400/30',
            )}>
            <div className="relative z-10 flex items-start justify-between gap-3">
                <div>
                    <div className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400">{title}</div>
                    <div className="flex items-baseline gap-1 text-2xl font-semibold text-slate-900 dark:text-slate-100 sm:text-3xl">{value}{unit &&
                        <span className="ml-1 text-sm font-normal text-slate-500 dark:text-slate-400">{unit}</span>}</div>
                </div>
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-md', iconStyle)}>
                    <Icon className="h-5 w-5"/>
                </div>
            </div>
        </div>
    );
};

export default StatBlock;
