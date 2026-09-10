import React from 'react';
import {cn} from "@/lib/utils.ts";

interface Props {
    className?: string
    children: React.ReactNode;
    animation?: boolean
    hover?: boolean
}

const CyberCard = ({className, children, animation, hover}: Props) => {
    return (
        <div
            className={cn(
                "command-panel command-panel--scan group bg-white/90 dark:bg-[#140b2b]/88 backdrop-blur-md border border-slate-200 dark:border-sky-400/20 shadow-sm transition-all duration-300 cursor-pointer overflow-hidden relative rounded-lg",
                hover && "hover:-translate-y-0.5 hover:border-slate-300 dark:hover:border-violet-300/55 hover:bg-white dark:hover:bg-[#0d1a2d]/95 dark:hover:shadow-[0_18px_46px_rgba(6,182,212,0.12)]"
            )}>
            {/* 装饰性边框 - 仅在暗色模式下显示 */}
            <div
                className="hidden dark:block absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-violet-300/50 group-hover:border-violet-200 transition-colors duration-300"></div>
            <div
                className="hidden dark:block absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-violet-300/50 group-hover:border-violet-200 transition-colors duration-300"></div>
            <div
                className="hidden dark:block absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-violet-300/50 group-hover:border-violet-200 transition-colors duration-300"></div>
            <div
                className="hidden dark:block absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-violet-300/50 group-hover:border-violet-200 transition-colors duration-300"></div>
            {animation &&
                <div
                    className="hidden dark:block absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 -translate-y-full group-hover:translate-y-full transition-[transform,opacity] duration-1000 ease-in-out pointer-events-none will-change-transform"/>
            }

            <div className={cn("relative z-10 p-4", className)}>
                {children}
            </div>
        </div>
    );
};

export default CyberCard;
