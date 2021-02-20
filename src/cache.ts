interface NodeValue<T> {
    value: T;
    end: number;
}
export class Cache<T> {

    private readonly cache: Map<string, NodeValue<T>> = new Map();

    constructor(private readonly ttl: number) { }

    set(key: string, value: T): this {
        this.cache.set(key, { value, end: this.ttl + Date.now() });
        return this;
    }

    get(key: string): T | undefined {
        const nodeValue = this.cache.get(key);
        if (nodeValue) {
            if (nodeValue.end > Date.now()) {
                return nodeValue.value;
            }
            this.cache.delete(key);
        }
        return undefined;
    }

    has(key: string): boolean {
        const nodeValue = this.cache.get(key);
        if (nodeValue) {
            if (nodeValue.end > Date.now()) {
                return true;
            }
            this.cache.delete(key);
        }
        return false;
    }
}