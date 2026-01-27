import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AppData {
    sleep: { hours: number; minutes: number };
    focus: { hours: number; minutes: number };
    habits: { done: number; total: number };
    journal: { written: boolean; content: string };
    lastUpdated: string;
}

const STORAGE_KEY = 'lifelog_app_data';

const DEFAULT_DATA: AppData = {
    sleep: { hours: 7, minutes: 20 },
    focus: { hours: 4, minutes: 10 },
    habits: { done: 3, total: 4 },
    journal: { written: true, content: 'Today was productive...' },
    lastUpdated: new Date().toISOString(),
};

export const getAppData = async (): Promise<AppData> => {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        if (jsonValue !== null) {
            return JSON.parse(jsonValue);
        }
        // Return default data if first time
        return DEFAULT_DATA;
    } catch (e) {
        console.error('Error loading app data:', e);
        return DEFAULT_DATA;
    }
};

export const updateAppData = async (updates: Partial<AppData>): Promise<AppData> => {
    try {
        const currentData = await getAppData();
        const newData = { ...currentData, ...updates, lastUpdated: new Date().toISOString() };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
        return newData;
    } catch (e) {
        console.error('Error updating app data:', e);
        throw e;
    }
};

export const resetData = async (): Promise<AppData> => {
    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DATA));
        return DEFAULT_DATA;
    } catch (e) {
        console.error('Error resetting data:', e);
        return DEFAULT_DATA;
    }
};
