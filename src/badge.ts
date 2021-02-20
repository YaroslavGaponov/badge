import { GitHubProvider } from "./provider/github/github-provider";
import { NpmRegistry } from "./npm-registry";
import { IRegistry } from "./registry-interface";
import { IVersionControlProvider } from "./version-control-provider-interface";
import { satisfies } from "semver";
import { BudgeRequest } from "./badge-request";
import { Status } from "./status";

export class Budge {

    private readonly providers: Map<string, IVersionControlProvider> = new Map(
        [
            ["github", new GitHubProvider()]
        ]
    );

    constructor(private readonly registry: IRegistry = new NpmRegistry()) { }

    async getResultAsJson(request: BudgeRequest): Promise<any> {

        const provider = this.providers.get(request.type);
        const packageJson = await provider?.getPackageJsonFile(request);

        const deps = { ...packageJson?.dependencies, ...packageJson?.devDependencies };

        const packages = Object.keys(deps);
        const latests = await Promise.all(packages.map(name => this.registry.getLastVersion(name)));

        const result = [];
        for (let i = 0; i < packages.length; i++) {
            const name = packages[i];
            const version = deps[name];
            const latest = latests[i];
            const uptodate = version === "latest" || satisfies(latest, version);
            result.push({ name, version, latest, uptodate });
        }
        return result;
    }

    async getResultAsStatus(request: BudgeRequest): Promise<Status> {
        const result = await this.getResultAsJson(request);

        const total = result.length;
        const uptodate = result.filter((e: any) => e.uptodate);

        if (Math.floor(uptodate / total) > .8) {
            return Status.good;
        } else if (Math.floor(uptodate / total) > .5) {
            return Status.normal;
        }
        return Status.bad;
    }


}