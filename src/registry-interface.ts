export interface IRegistry {
    getLastVersion(name: string): Promise<string>;
    getLastVersion2(name: string): Promise<string>;
}