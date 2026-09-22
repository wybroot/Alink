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
        <div className="relative flex flex-col gap-4 border-b border-slate-200 pb-5 dark:border-[#303936] sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{title}</h1>
                {description && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>}
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
