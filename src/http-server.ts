import { param } from "./param-decorator";
import express from "express";
import { Server } from "http";
import { Budge } from "./badge";
import { resolve } from "path";
import ejs from "ejs";
import { join } from "path";

export class HttpServer {

    @param("PORT", 8080)
    private readonly port!: number;
    private readonly app = express();
    private server?: Server;
    private readonly badge = new Budge();

    constructor() {
        this.app.set("views", join(__dirname, "../view"));
        this.app.set("view engine", "ejs");

        this.app.get('/:type/:user/:repo/:branch/:format', async (req, res) => {
            const { type, user, repo, branch, format } = req.params;
            switch (format) {
                case "json": {
                    const json = await this.badge.getResultAsJson({ type, user, repo, branch } as any);
                    res.json(json);
                    break;
                }
                case "status": {
                    const status = await this.badge.getResultAsStatus({ type, user, repo, branch } as any);
                    res.send(status);
                    break;
                }
                case "html": {
                    const json = await this.badge.getResultAsJson({ type, user, repo, branch } as any);
                    res.render('deps', {deps: json});
                    break;
                }
                default:
                case "badge": {
                    const status = await this.badge.getResultAsStatus({ type, user, repo, branch } as any);
                    res.sendFile(resolve(__dirname, "../badge-images", `${status}.svg`));
                    break;
                }
            }
        });
    }

    start(): Promise<void> {
        return new Promise<void>(resolve => this.server = this.app.listen(this.port, () => resolve()));
    }

    stop(): Promise<void> {
        return new Promise<void>(resolve => this.server?.close(() => resolve()));
    }
}