export class MutexMap<K, V> {
    private map: Map<K, V>;
    private mutex: Promise<void> = Promise.resolve();

    constructor(newMap?: Map<K, V>) {
        if (newMap) {
            this.map = new Map<K, V>(newMap); // Create a new Map from newMap
        } else {
            this.map = new Map<K, V>();
        }
    }

    private async executeLocked<T>(callback: () => Promise<T>): Promise<T> {
        return this.mutex.then(async () => {
            try {
                return await callback();
            } catch (error) {
                console.error('Error in mutex callback:', error);
                throw error; // Rethrow the error to maintain type safety
            }
        });
    }

    async get(key: K): Promise<V | undefined> {
        return this.executeLocked(async () => {
            return this.map.get(key);
        });
    }

    async set(key: K, value: V): Promise<void> {
        return this.executeLocked(async () => {
            this.map.set(key, value);
        });
    }

    async delete(key: K): Promise<boolean> {
        return this.executeLocked(async () => {
            return this.map.delete(key);
        });
    }

    async clear(): Promise<void> {
        return this.executeLocked(async () => {
            this.map.clear();
        });
    }

    async exportToMap(): Promise<Map<K, V>> {
        return this.executeLocked(async () => {
            const exportedMap = new Map<K, V>(this.map);
            return exportedMap;
        });
    }

    size(): Promise<number> {
        return this.executeLocked(async () => {
            return this.map.size;
        });
    }

    forEach(
        callback: (value: V, key: K, map: Map<K, V>) => void
    ): Promise<void> {
        return this.executeLocked(async () => {
            this.map.forEach(callback);
        });
    }

    keys(): Promise<IterableIterator<K>> {
        return this.executeLocked(async () => {
            return this.map.keys();
        });
    }
}
