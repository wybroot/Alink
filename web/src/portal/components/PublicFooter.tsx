import {Github} from 'lucide-react';

const PublicFooter = () => {
    const currentYear = new Date().getFullYear();
    const icpCode = window.SystemConfig?.ICPCode || '';

    return (
        <footer className="border-t border-slate-200 bg-[#eef1f0] transition-colors duration-300 dark:border-[#303936] dark:bg-[#111513]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="py-6">
                    <div className="flex flex-col items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400 sm:flex-row">
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            <span className="text-slate-600 dark:text-slate-300">© {currentYear}</span>
                            <span className="text-slate-300 dark:text-slate-700">|</span>
                            {/* GitHub 链接 */}
                            <a
                                href="https://github.com/wybroot/alink"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-1.5 text-slate-600 transition-colors hover:text-teal-700 dark:text-slate-300 dark:hover:text-teal-300"
                                title="查看 GitHub 仓库"
                            >
                                <Github className="h-3 w-3 group-hover:scale-110 transition-transform"/>
                                <span>{window.SystemConfig?.SystemNameEn || 'Alink Monitor'}</span>
                            </a>
                            <span>{window.SystemConfig.Version}</span>
                            {/* ICP 备案号 */}
                            {icpCode && (
                                <>
                                    <span className="text-slate-300 dark:text-slate-700">|</span>
                                    <a
                                        href="https://beian.miit.gov.cn"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-slate-500 transition-colors hover:text-teal-700 dark:text-slate-400 dark:hover:text-teal-300"
                                    >
                                        {icpCode}
                                    </a>
                                </>
                            )}
                        </div>
                        <span className="text-slate-500 dark:text-slate-500">服务状态实时更新</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default PublicFooter;
