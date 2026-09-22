import {RouterProvider} from 'react-router-dom';
import {App as AntdApp, ConfigProvider, theme as antdTheme} from 'antd';
import zhCN from 'antd/locale/zh_CN';
import router from './router';
import {ThemeProvider, useTheme} from '@/portal/contexts/ThemeContext';
import 'dayjs/locale/zh-cn';
import dayjs from 'dayjs';
import './App.css';

// 设置 dayjs 为中文
dayjs.locale('zh-cn');

function AppContent() {
    const {appliedTheme} = useTheme();

    return (
        <ConfigProvider
            locale={zhCN}
            theme={{
                algorithm: appliedTheme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
                token: {
                    colorPrimary: '#0f766e',
                    colorInfo: '#0f766e',
                    colorSuccess: '#15803d',
                    colorWarning: '#b45309',
                    colorError: '#b91c1c',
                    borderRadius: 6,
                    fontFamily: 'Inter, Segoe UI, PingFang SC, Microsoft YaHei, sans-serif',
                },
                components: {
                    Button: {controlHeight: 36, fontWeight: 600},
                    Card: {borderRadiusLG: 8},
                    Table: {headerBg: appliedTheme === 'dark' ? '#171a1f' : '#f6f7f8'},
                },
            }}
        >
            <AntdApp>
                <RouterProvider router={router}/>
            </AntdApp>
        </ConfigProvider>
    );
}

function App() {
    return (
        <ThemeProvider>
            <AppContent/>
        </ThemeProvider>
    );
}

export default App;
