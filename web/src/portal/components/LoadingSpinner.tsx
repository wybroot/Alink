import {Loader2} from 'lucide-react';
import {cn} from '@/lib/utils';

interface LoadingSpinnerProps {
    message?: string;
}

export const LoadingSpinner = ({message}: LoadingSpinnerProps) => {

    return (
        <div className={cn(
            "flex h-[75vh] items-center justify-center bg-slate-50 dark:bg-[#08040f]",
        )}>
            <div className="flex flex-col items-center gap-3">
                <Loader2 className={"h-8 w-8 animate-spin text-indigo-500 dark:text-violet-500"}/>
                <p className={cn(
                    "text-sm font-mono text-slate-500 dark:text-violet-400",
                )}>
                    {message || '数据加载中，请稍候...'}
                </p>
            </div>
        </div>
    );
};
