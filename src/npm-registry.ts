import { IncomingMessage } from "http";
import { get } from "https";
import { IRegistry } from "./registry-interface";

const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

export class NpmRegistry implements IRegistry {

    private readonly cache: Map<string, string> = new Map();
    private readonly timer: NodeJS.Timeout;

    constructor() {
        this.timer = setInterval(() => this.cache.clear(), ONE_WEEK).unref();
    }

    getLastVersion(name: string): Promise<string> {
        return new Promise((resolve, reject) => {
            if (this.cache.has(name)) {
                return resolve(this.cache.get(name) as string);
            }
            const url = `https://skimdb.npmjs.com/registry/${name}`;
            get(url, (res: IncomingMessage) => {
                const chunks: any[] = [];
                res
                    .on("data", (chunk: any) => chunks.push(chunk))
                    .once("end", () => {
                        try {
                            const info = JSON.parse(Buffer.concat(chunks).toString());
                            if ("dist-tags" in info) {
                                const { latest } = info["dist-tags"];
                                this.cache.set(name, latest);
                                resolve(latest);
                            } else {
                                this.cache.set(name, "notfound");
                                reject(new Error(info));
                            }
                        } catch (err) {
                            this.cache.set(name, "notfound");
                            reject(err);
                        }
                    })
                    .once("error", (err: Error) => {
                        this.cache.set(name, "notfound");
                        reject(err);
                    });
            })
        });
    }
}