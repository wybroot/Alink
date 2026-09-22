import {Outlet} from 'react-router-dom';
import PublicHeader from '@portal/components/PublicHeader';
import PublicFooter from '@portal/components/PublicFooter';

const PublicLayout = () => {
    return (
        <div className="command-shell flex min-h-screen flex-col overflow-x-hidden text-slate-800 transition-colors duration-300 dark:text-slate-200">
            <PublicHeader/>
            <div className="relative z-10 flex min-h-screen flex-col pt-16 sm:pt-[72px]">
                <main className="flex-1">
                    <Outlet/>
                </main>
                <PublicFooter/>
            </div>
        </div>
    );
};

export default PublicLayout;
