import { Request } from "express";
import config from "../config";
import { buildReferencePath, getSpriteUrl } from "../utils/helpers";
import slugify from "slugify";

export class HeldItem
{
    id: number;
    name: string;
    description: string;
    spriteUrl: string;

    constructor(data: {
        id: number;
        name: string;
        description: string;
    })
    {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;

        const imageName = slugify(this.name, { lower: true, trim: true, strict: true });
        this.spriteUrl = getSpriteUrl(config.heldItemPath, imageName);
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
        this.url = this.url = buildReferencePath(config.heldItemPath, id);
    }
}
