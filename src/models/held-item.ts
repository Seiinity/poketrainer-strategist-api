import { Request } from "express";
import config from "../config";

export class HeldItem
{
    id: number;
    name: string;
    description: string;

    constructor(data: {
        id: number;
        name: string;
        description: string;
    })
    {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
    }
}

export class HeldItemBody
{
    name?: string;
    description?: string;

    constructor(requestBody: Request["body"])
    {
        this.name = requestBody.name;
        this.description = requestBody.description;
    }
}

export class HeldItemReference
{
    name: string;
    url?: string;

    constructor(name: string, id: number)
    {
        this.name = name;
        this.url = `${config.baseUrl}/api${config.heldItemPath}/${id}`;
    }
}