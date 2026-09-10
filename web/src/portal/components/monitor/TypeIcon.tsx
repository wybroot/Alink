import { Globe, Server, ShieldCheck, Wifi } from 'lucide-react';

interface TypeIconProps {
    type: string;
}

export const TypeIcon = ({ type }: TypeIconProps) => {
    switch (type.toLowerCase()) {
        case 'https':
            return <ShieldCheck className="w-4 h-4 text-fuchsia-500 dark:text-fuchsia-400" />;
        case 'http':
            return <Globe className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />;
        case 'tcp':
            return <Server className="w-4 h-4 text-orange-500 dark:text-orange-400" />;
        case 'icmp':
        case 'ping':
            return <Wifi className="w-4 h-4 text-violet-500 dark:text-violet-500" />;
        default:
            return <Server className="w-4 h-4 text-slate-500 dark:text-slate-400" />;
    }
};
