
import type {LatestMetrics} from '@/types';

export const isExpired = (expireTime?: number) => {
    return expireTime && expireTime > 0 && expireTime - Date.now() < 30 * 24 * 60 * 60 * 1000;
};

export const getServerIpAddress = (metrics?: LatestMetrics) => {
    const addresses = (metrics?.networkInterfaces || [])
        .flatMap((netInterface) => netInterface.addrs || [])
        .map((address) => address.trim())
        .filter(Boolean);

    return addresses.find((address) => address.split('/')[0].includes('.')) || addresses[0];
};
