import React from 'react';
import {Button} from 'antd';
import type {LucideIcon} from 'lucide-react';

export interface Action {
    key: string;
    label: string;
    icon?: React.ReactElement<LucideIcon>;
    type?: 'default' | 'primary';
    onClick: () => void;
    danger?: boolean;
    disabled?: boolean;
    loading?: boolean;
}

interface PageHeaderProps {
    title: string;
    description?: string;
    actions?: Action[];
}

/**
 * 统一的页面头部组件
 */
export const PageHeader: React.FC<PageHeaderProps> = ({title, description, actions}) => {
    return (
        <div className="relative flex flex-col gap-4 border-b border-slate-200 pb-5 dark:border-violet-300/15 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative pl-4 before:absolute before:bottom-0 before:left-0 before:top-1 before:w-px before:bg-violet-400 before:shadow-[0_0_12px_#8b5cf6]">
                <h1 className="text-2xl font-semibold tracking-[0.06em] text-gray-900 dark:text-white">{title}</h1>
                {description && <p className="mt-1 text-sm text-gray-500 dark:text-violet-100/55">{description}</p>}
            </div>
            {actions && actions.length > 0 && (
                <div className="flex flex-wrap items-center gap-3">
                    {actions.map((action) => (
                        <Button
                            key={action.key}
                            type={action.type || 'default'}
                            icon={action.icon}
                            onClick={action.onClick}
                            danger={action.danger}
                            disabled={action.disabled}
                            loading={action.loading}
                        >
                            {action.label}
                        </Button>
                    ))}
                </div>
            )}
        </div>
    );
};
