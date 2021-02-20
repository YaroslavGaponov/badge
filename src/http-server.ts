import { param } from "./param-decorator";
import express from "express";
import { Server } from "http";
import { Budge } from "./badge";
import { resolve } from "path";

export class HttpServer {

    @param("PORT", 8080)
    private readonly port!: number;

    private readonly app = express();
    private server?: Server;

    private readonly badge: Budge = new Budge();

    constructor() {
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