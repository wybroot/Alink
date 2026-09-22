import React from 'react';
import {cn} from "@/lib/utils.ts";

interface Props {
    className?: string
    children: React.ReactNode;
    animation?: boolean
    hover?: boolean
}

const CyberCard = ({className, children, hover}: Props) => {
    return (
        <div
            className={cn(
                "command-panel group relative overflow-hidden rounded-lg transition-[border-color,box-shadow,transform] duration-200",
                hover && "hover:-translate-y-0.5 hover:border-teal-600/40 hover:shadow-[0_10px_28px_rgba(16,24,22,0.09)] dark:hover:border-teal-400/40"
            )}>
            <div className={cn("relative z-10 p-4", className)}>
                {children}
            </div>
        </div>
    );
};

export default CyberCard;
