import * as Tooltip from '@radix-ui/react-tooltip';
import {cn} from "@/lib/utils.ts";

// 紧凑型资源条组件
const CompactResourceBar = ({value, label, subtext, icon: Icon, color = "bg-violet-500"}) => {
    const isCritical = value > 90;
    const isWarning = value > 75;

    let barColor = "";
    let iconClass = "";
    let textClass = "text-slate-700 dark:text-slate-200";

    if (isCritical) {
        barColor = "bg-rose-500";
        iconClass = "text-rose-600 dark:text-rose-500";
        textClass = "text-rose-400";
    } else if (isWarning) {
        barColor = "bg-amber-500";
        iconClass = "text-amber-600 dark:text-amber-400";
        textClass = "text-amber-400";
    } else if (color.includes("fuchsia") || color.includes("purple")) {
        barColor = "bg-blue-500";
        iconClass = "text-blue-600 dark:text-blue-300";
    } else if (color.includes("blue") || color.includes("indigo")) {
        barColor = "bg-teal-600";
        iconClass = "text-teal-700 dark:text-teal-300";
    } else if (color.includes("lime")) {
        barColor = "bg-amber-500";
        iconClass = "text-amber-600 dark:text-amber-300";
    } else {
        barColor = "bg-teal-600";
        iconClass = "text-teal-700 dark:text-teal-300";
    }

    return (
        <div>
            <Tooltip.Provider delayDuration={200}>
                <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                        <div className="flex h-6 w-full items-center gap-2 text-xs">
                            <div className={`flex w-12 flex-shrink-0 items-center gap-1.5 ${iconClass}`}>
                                <Icon className="w-3.5 h-3.5" strokeWidth={2}/>
                                <span className="text-xs font-semibold">{label}</span>
                            </div>

                            <div className="relative h-1.5 min-w-16 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-[#303936]">
                                <div
                                    className={`relative z-10 h-full rounded-full transition-all duration-500 ease-out ${barColor}`}
                                    style={{width: `${Math.min(value, 100)}%`}}
                                />
                            </div>
                            <div
                                className={cn('w-11 cursor-pointer text-right text-xs font-medium', textClass)}>
                                {value.toFixed(1)}%
                            </div>
                        </div>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                        <Tooltip.Content
                            className="px-2 py-1 bg-slate-800/95 text-slate-200 text-xs rounded border border-white/10 whitespace-nowrap shadow-lg z-50 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
                            sideOffset={8}
                            side="top"
                        >
                            {subtext}
                            <Tooltip.Arrow className="fill-slate-800/95"/>
                        </Tooltip.Content>
                    </Tooltip.Portal>
                </Tooltip.Root>
            </Tooltip.Provider>
        </div>
    );
};

export default CompactResourceBar;
