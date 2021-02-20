import "reflect-metadata";
import { HttpServer } from "./http-server";

const server = new HttpServer();
server.start();
process.once("SIGINT", async () => await server.stop());