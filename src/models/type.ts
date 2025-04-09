import config from "../config";
import { Request } from "express";

export class Type
{
    id: number;
    name: string;

    constructor(data: {
        id: number;
        name: string;
    })
    {
        this.id = data.id;
        this.name = data.name;
    }
}

export class TypeReference
{
    name: string;
    url?: string;

    constructor(name: string, url?: string)
    {
        this.name = name;
        this.url = url;
    }

    static build(types: Type[]): TypeReference[]
    {
        return types
            .filter(type => type.id && type.name)
            .map(type => new TypeReference(type.name, `${config.baseUrl}/api/${config.typePath}/${type.id}`));
    }
}

export class TypeBody
{
    name: string;

    constructor(requestBody: Request["body"])
    {
        this.name = requestBody.name;
    }
}
