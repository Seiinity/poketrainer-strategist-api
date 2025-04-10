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
    stat:
    {
        name: string;
        url?: string;
    }

    value: number;

    constructor(name: string, id: number, value: number)
    {
        this.stat =
        {
            name: name,
            url: `${config.baseUrl}/api${config.statPath}/${id}`,
        }
        this.value = value;
    }
}