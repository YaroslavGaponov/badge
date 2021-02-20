import { GitHubRequest } from "./github-request";
import { IVersionControlProvider } from "../../version-control-provider-interface";
import { get } from "https";
import { IncomingMessage } from "http";

export class GitHubProvider implements IVersionControlProvider {

    getPackageJsonFile(request: GitHubRequest): Promise<any> {
        return new Promise((resolve, reject) => {
            const url = `https://raw.githubusercontent.com/${request.user}/${request.repo}/${request.branch}/package.json`;
            get(url, (res: IncomingMessage) => {
                const chunks: any[] = [];
                res
                    .on("data", (chunk: any) => chunks.push(chunk))
                    .once("end", () => resolve(JSON.parse(Buffer.concat(chunks).toString())))
                    .once("error", (err: Error) => reject(err));
            })
        });
    }

}