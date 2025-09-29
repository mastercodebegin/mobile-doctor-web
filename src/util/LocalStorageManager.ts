export const LocalStorageManager = {
    // Save data for any module
    saveData: (key: string, data: any) => {
        try {
            const serializedData = JSON.stringify(data);
            console.log(`Saving ${key} data:`, serializedData);
            localStorage.setItem(key, serializedData);
            console.log(`✅ ${key} data saved to localStorage`);
        } catch (error) {
            console.error(`❌ Failed to save ${key} data to localStorage:`, error);
        }
    },
    
    // Get data for any module
  getData: (key: string) => {
        try {
            const data = localStorage.getItem(key);
            console.log(`Retrieved ${key} data:`, data);
            if (data) {
                try {
                    return JSON.parse(data);
                } catch (error) {
                    console.error(`❌ Failed to parse ${key} data from localStorage:`, error);
                    return null;
                }
            }
            return null;
        } catch (error) {
            console.error(`❌ Failed to get ${key} data from localStorage:`, error);
            return null;
        }
    },
    
    // Clear data for specific module
    clearData: (key: string) => {
        try {
            localStorage.removeItem(key);
            console.log(`🗑️ ${key} data cleared from localStorage`);
        } catch (error) {
            console.error(`❌ Failed to clear ${key} data from localStorage:`, error);
        }
    },
    
    // Clear all app data
    clearAllData: () => {
        try {
            const keys = [
                'branch', 'country', 'state', 'city', 'user', 'vendor', 'role',
                'dashboard', 'category', 'sub-category', 'brand', 'modal-number',
                'color-name', 'variant', 'variant-color', 'modal-issue', 'repair-cost',
                'product-part', 'order', 'support-ticket', 'coupon','authToken', 'token'
            ];
            keys.forEach(key => localStorage.removeItem(key));
            console.log('🗑️ All app data cleared from localStorage');
        } catch (error) {
            console.error('❌ Failed to clear all data from localStorage:', error);
        }
    },
    
    // Check if data exists
    hasData: (key: string) => {
        const data = localStorage.getItem(key);
        return data !== null && JSON.parse(data).length > 0;
    }
};

// Define localStorage keys constants
export const STORAGE_KEYS = {
    DASHBOARD: 'dashboard',
    USER: 'user',
    CATEGORY: 'category',
    SUB_CATEGORY: 'sub-category',
    BRAND: 'brand',
    MODAL_NUMBER: 'modal-number',
    COLOR_NAME: 'color-name',
    VARIANT: 'variant',
    VARIANT_COLOR: 'variant-color',
    MODAL_ISSUE: 'modal-issue',
    REPAIR_COST: 'repair-cost',
    PRODUCT_PART: 'product-part',
    ORDERS: 'order',
    SUPPORT_TICKET: 'support-ticket',
    ROLE: 'role',
    COUNTRY: 'country', 
    STATE: 'state',
    CITY: 'city',
    BRANCH: 'branch',
    COUPON: 'coupon',
    VENDOR: 'vendor',
};