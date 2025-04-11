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
    ivs: number;

    constructor(name: string, id: number, baseValue: number, evs: number, ivs: number, level: number)
    {
        this.stat =
        {
            name: name,
            url: `${config.baseUrl}/api${config.statPath}/${id}`,
        };
        this.evs = evs;
        this.ivs = ivs;
        this.value = this.calculateStat(baseValue, level);
    }

    private calculateStat(baseValue: number, level: number): number
    {
        return this.stat.name == "HP"
            ? Math.floor((((this.ivs + (2 * baseValue) + (this.evs / 4) + 100) * level) / 100) + 10)
            : Math.floor((((this.ivs + (2 * baseValue) + (this.evs / 4)) * level) / 100) + 5);
    }
}
