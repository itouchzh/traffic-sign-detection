// 设置 localStorage
export const setLocalStorage = <T>(key: string, value: T): void => {
    localStorage.setItem(key, JSON.stringify(value));
};

// 获取 localStorage
export const getLocalStorage = <T>(key: string): T | null => {
    const value = localStorage.getItem(key);
    if (value) {
        return JSON.parse(value) as T;
    }
    return null;
};

// 删除 localStorage
export const removeLocalStorage = (key: string): void => {
    localStorage.removeItem(key);
};

// 清空 localStorage
export const clearLocalStorage = (): void => {
    localStorage.clear();
};
