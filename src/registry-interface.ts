export interface IRegistry {
    getLastVersion(name: string): Promise<string>;
}