export interface GitHubRequest extends Request {
    user: string;
    repo: string;
    branch: string;
}