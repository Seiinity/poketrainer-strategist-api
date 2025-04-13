import config from "../config";
import { buildReferencePath, getSpriteUrl } from "../utils/helpers";

export class MoveCategory
{
    id: number;
    name: string;
    spriteUrl: string;

    constructor(data: {
        id: number;
        name: string;
    })
    {
        this.id = data.id;
        this.name = data.name;
        this.spriteUrl = getSpriteUrl(config.moveCategoryPath, this.id.toString());
    }
}

export class MoveCategoryReference
{
    name: string;
    url: string;

    constructor(name: string, id: number)
    {
        this.name = name;
        this.url = this.url = buildReferencePath(config.moveCategoryPath, id);
    }
}
