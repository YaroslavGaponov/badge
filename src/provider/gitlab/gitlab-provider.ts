import { GitLabRequest } from "./gitlab-request";
import { IVersionControlProvider } from "../../version-control-provider-interface";
import { get } from "https";
import { escape } from "querystring";
import { IncomingMessage } from "http";
import { param } from "../../param-decorator";

export class GitLabProvider implements IVersionControlProvider {

    @param("GIT_LAB_BASE_URL", "")
    private readonly baseurl!: string;

    @param("GIT_LAB_TOKEN", "")
    private readonly token!: string;

    async getPackageJsonFile(request: GitLabRequest): Promise<any> {

        if (!this.baseurl || this.baseurl.length === 0) {
            throw new Error(`GIT_LAB_BASE_URL is empty`);
        }

        if (!this.token || this.token.length === 0) {
            throw new Error(`GIT_LAB_TOKEN is empty`);
        }

        // {baseurl}/api/v4/projects?search={repo}&private_token={token}
        const projects = await this.request(`${this.baseurl}/api/v4/projects?search=${request.repo}`);
        if (!projects || projects.length !== 1) {
            throw new Error(`Repository ${request.repo} is not found`);
        }
        const { id } = projects[0];

        // {baseurl}/api/v4/projects/{projectId}/repository/files/package.json/raw?ref={branch}&private_token={token}
        return this.request(`${this.baseurl}/api/v4/projects/${id}/repository/files/package.json/raw?ref=${escape(request.branch)}`);
    }

    private request(url: string): Promise<any> {
        return new Promise((resolve, reject) => {
            get(url, { headers: { "PRIVATE-TOKEN": this.token } }, (res: IncomingMessage) => {
                const chunks: any[] = [];
                res
                    .on("data", (chunk: any) => chunks.push(chunk))
                    .once("end", () => resolve(JSON.parse(Buffer.concat(chunks).toString())))
                    .once("error", (err: Error) => reject(err));
            })
        })
    }

}