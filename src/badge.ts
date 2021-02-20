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

        const result = [];
        for (let name in deps) {
            const version = deps[name];
            try {
                const latest = await this.registry.getLastVersion2(name);
                const ok = version === "latest" || satisfies(latest, version);
                result.push({ name, version, latest, ok });
            } catch (err) {
                console.error(err);
            }
        }
        return result;
    }

    async getResultAsStatus(request: BudgeRequest): Promise<Status> {
        const result = await this.getResultAsJson(request);

        const total = result.length;
        const uptodate = result.filter((e: any) => e.ok);

        if (Math.floor(uptodate / total) > .8) {
            return Status.good;
        } else if (Math.floor(uptodate / total) > .5) {
            return Status.normal;
        }
        return Status.bad;
    }


}