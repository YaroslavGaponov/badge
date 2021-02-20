export interface IVersionControlProvider {
    getPackageJsonFile(options: any): Promise<any>;
}