export interface GitLabRequest extends Request {
    user: string;
    repo: string;
    branch: string;
}