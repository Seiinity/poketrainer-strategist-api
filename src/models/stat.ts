import config from "../config";

export class Stat
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

export class StatReference
{
    name: string;
    url?: string;

    constructor(name: string, id: number)
    {
        this.name = name;
        this.url = `${config.baseUrl}/api/${config.statPath}/${id}`;
    }
}