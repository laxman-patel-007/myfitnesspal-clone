/**
 * A wrapper class for browser storage (localStorage) to simplify
 * getting and setting data, especially for objects that need to be
 * stringified and parsed.
 */
class Storage {
    constructor(storageType = 'localStorage') {
        this.storage = window[storageType];
    }

    /**
     * Retrieves an item from storage.
     * @param {string} key - The key of the item to retrieve.
     * @returns {any} The retrieved item, parsed from JSON if it's a stringified object.
     */
    get(key) {
        const value = this.storage.getItem(key);
        try {
            // Attempt to parse the value as JSON. If it fails, return the raw value.
            return JSON.parse(value);
        } catch (e) {
            return value;
        }
    }

    /**
     * Sets an item in storage.
     * @param {string} key - The key to set the item under.
     * @param {any} value - The value to store. Objects will be stringified.
     */
    set(key, value) {
        if (typeof value === 'object') {
            this.storage.setItem(key, JSON.stringify(value));
        } else {
            this.storage.setItem(key, value);
        }
    }

    /**
     * Removes an item from storage.
     * @param {string} key - The key of the item to remove.
     */
    remove(key) {
        this.storage.removeItem(key);
    }

    /**
     * Clears all items from storage.
     */
    clear() {
        this.storage.clear();
    }
}

// Instantiate storage for local (persistent) and session (temporary) storage.
const localStore = new Storage('localStorage');
const sessionStore = new Storage('sessionStorage');