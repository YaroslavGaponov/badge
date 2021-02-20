import { IncomingMessage } from "http";
import { get } from "https";
import { escape } from "querystring";
import { IRegistry } from "./registry-interface";
import { Cache } from "./cache";

const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

export class NpmRegistry implements IRegistry {

    private readonly cache = new Cache<string>(ONE_WEEK);

    getLastVersion(name: string): Promise<string> {
        return new Promise((resolve, reject) => {
            if (this.cache.has(name)) {
                return resolve(this.cache.get(name) as string);
            }
            const url = `https://skimdb.npmjs.com/registry/${escape(name)}`;
            get(url, (res: IncomingMessage) => {
                const chunks: any[] = [];
                res
                    .on("data", (chunk: any) => chunks.push(chunk))
                    .once("end", () => {
                        try {
                            const info = JSON.parse(Buffer.concat(chunks).toString());
                            if (info && "dist-tags" in info) {
                                const { latest } = info["dist-tags"];
                                this.cache.set(name, latest);
                                resolve(latest);
                            } else {
                                reject(new Error(info));
                            }
                        } catch (err) {
                            reject(err);
                        }
                    })
                    .once("error", (err: Error) => reject(err));
            })
        });
    }


    getLastVersion2(name: string): Promise<string> {
        return new Promise((resolve, reject) => {
            if (this.cache.has(name)) {
                return resolve(this.cache.get(name) as string);
            }
            const url = `https://api.npms.io/v2/package/${escape(name)}`;
            get(url, (res: IncomingMessage) => {
                const chunks: any[] = [];
                res
                    .on("data", (chunk: any) => chunks.push(chunk))
                    .once("end", () => {
                        try {
                            const info = JSON.parse(Buffer.concat(chunks).toString());
                            if (info) {
                                const latest  = info.collected.metadata.version;
                                this.cache.set(name, latest);
                                resolve(latest);
                            } else {
                                reject(new Error(info));
                            }
                        } catch (err) {
                            reject(err);
                        }
                    })
                    .once("error", (err: Error) => reject(err));
            })
        });
    }
}