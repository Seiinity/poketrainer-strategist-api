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

export class BaseStatReference
{
    stat:
    {
        name: string;
        url?: string;
    };

    value: number;

    constructor(name: string, id: number, value: number)
    {
        this.stat =
        {
            name: name,
            url: `${config.baseUrl}/api${config.statPath}/${id}`,
        };
        this.value = value;
    }
}

export class StatReference
{
    stat:
    {
        name: string;
        url?: string;
    };

    value: number;
    evs: number;

    constructor(name: string, id: number, baseValue: number, evs: number, level: number)
    {
        this.stat =
        {
            name: name,
            url: `${config.baseUrl}/api${config.statPath}/${id}`,
        };
        this.evs = evs;
        this.value = this.calculateStat(baseValue, level);
    }

    private calculateStat(baseValue: number, level: number): number
    {
        return this.stat.name == "HP"
            ? Math.floor(0.01 * (2 * baseValue + Math.floor(0.25 * this.evs)) * level) + level + 10
            : Math.floor(0.01 * (2 * baseValue + Math.floor(0.25 * this.evs)) * level) + 5;
    }
}
