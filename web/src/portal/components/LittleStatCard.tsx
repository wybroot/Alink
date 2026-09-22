// 统计卡片组件
const LittleStatCard = ({
                      label,
                      value,
                  }: {
    label: string;
    value: string | number;
    sublabel?: string;
}) => (
    <div
        key={label}
        className="rounded-md border border-slate-200 bg-slate-50 p-3 text-left transition-colors hover:border-slate-300 dark:border-[#303936] dark:bg-[#222927] dark:hover:border-[#46534f] sm:p-4"
    >
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
        <p className="mt-2 break-words text-sm font-semibold text-slate-800 dark:text-slate-100 sm:text-base">{value}</p>
    </div>
);

export default LittleStatCard;
