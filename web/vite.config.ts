import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path";

const devSystemConfig = {
    SystemNameZh: 'Alink 监控',
    SystemNameEn: 'Alink Monitor',
    ICPCode: '',
    DefaultView: 'grid',
    Version: 'dev',
};

const devSystemConfigPlugin = () => ({
    name: 'pikaw-dev-system-config',
    apply: 'serve' as const,
    transformIndexHtml(html: string) {
        return html
            .replaceAll('[[if and .SystemNameZh .SystemNameEn]]', '')
            .replaceAll('[[end]]', '')
            .replaceAll('[[.SystemNameZh]]', devSystemConfig.SystemNameZh)
            .replaceAll('[[.SystemNameEn]]', devSystemConfig.SystemNameEn)
            .replaceAll('[[.ICPCode]]', devSystemConfig.ICPCode)
            .replaceAll('[[.DefaultView]]', devSystemConfig.DefaultView)
            .replaceAll('[[.Version]]', devSystemConfig.Version);
    },
});

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        devSystemConfigPlugin(),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "@portal": path.resolve(__dirname, "./src/portal"),
            "@admin": path.resolve(__dirname, "./src/admin"),
        },
    },
    server: {
        proxy: {
            '/api/': {
                target: 'http://localhost:8080/',
                changeOrigin: true,
            },
        },
    },
})
