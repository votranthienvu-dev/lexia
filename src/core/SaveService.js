// LexiQuest Versioned SaveService (LocalStorage JSON)
export class SaveService {
    constructor() {
        this.SAVE_KEY = 'LEXIQUEST_SAVE_DATA_V1';
        this.VERSION = '1.0.0';
    }

    save(data) {
        try {
            const saveData = {
                version: this.VERSION,
                timestamp: Date.now(),
                data: data
            };
            localStorage.setItem(this.SAVE_KEY, JSON.stringify(saveData));
            return true;
        } catch (e) {
            console.error('Save failed:', e);
            return false;
        }
    }

    load() {
        try {
            const raw = localStorage.getItem(this.SAVE_KEY);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            return parsed.data || null;
        } catch (e) {
            console.error('Load failed:', e);
            return null;
        }
    }

    clear() {
        localStorage.removeItem(this.SAVE_KEY);
    }
}

export const saveService = new SaveService();
