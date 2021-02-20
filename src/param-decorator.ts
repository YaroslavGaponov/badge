export function param(name: string, defvalue: number | string | boolean) {
    return (target: any, key: string) => {
        var t = Reflect.getMetadata("design:type", target, key);
        switch (t.name) {
            case "number":
                target[key] = process.env[name] ? parseInt(process.env[name] as string) : defvalue;
                break;
            case "boolean":
                target[key] = process.env[name] ? process.env[name] === "true" : defvalue;
                break;
            default:
                target[key] = process.env[name] ? process.env[name] : defvalue;
        }
    }
}