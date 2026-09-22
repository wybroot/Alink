import type {ReactNode} from 'react';
import type {LucideIcon} from 'lucide-react';

interface ChartContainerProps {
    title: string;
    icon: LucideIcon;
    children: ReactNode;
    action?: ReactNode;
}

/**
 * 图表容器组件
 * 为所有图表提供统一的标题、图标和可选的操作区域
 */
export const ChartContainer = ({title, icon: Icon, children, action}: ChartContainerProps) => {
    return (
        <section>
            <div className="mb-3 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-slate-600 dark:bg-[#222927] dark:text-teal-300">
            <Icon className="h-4 w-4"/>
          </span>
                    {title}
                </h3>
                {action}
            </div>
            {children}
        </section>
    );
};
