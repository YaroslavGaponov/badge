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

        const result = [];
        const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

        for (let name in deps) {
            const version = deps[name];
            if (version === "latest") continue;
            try {
                const latest = await this.registry.getLastVersion(name);
                if (latest === "notfound") continue;
                const ok = satisfies(latest, version);
                result.push({ name, version, latest, ok });
            } catch (err) { }
        }
        return result;
    }

    async getResultAsStatus(request: BudgeRequest): Promise<Status> {
        const result = await this.getResultAsJson(request);

        const total = result.length;
        const uptodate = result.filter((e: any) => e.ok);

        if (total === uptodate) {
            return Status.good;
        } else if (Math.floor(uptodate / total) > .5) {
            return Status.normal;
        }
        return Status.bad;
    }


}