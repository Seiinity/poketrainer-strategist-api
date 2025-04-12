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
    url: string;

    constructor(name: string, id: number)
    {
        this.name = name;
        this.url = `${config.baseUrl}/api${config.statPath}/${id}`;
    }
}

export class StatReferenceForSpecies
{
    stat: StatReference;
    value: number;

    constructor(name: string, id: number, value: number)
    {
        this.stat = new StatReference(name, id);
        this.value = value;
    }
}

export class StatReferenceForPokemon
{
    stat: StatReference;
    value: number;
    evs: number;
    ivs: number;

    constructor(name: string, id: number, baseValue: number, evs: number, ivs: number, level: number, raisedStatId: number, loweredStatId: number)
    {
        this.stat = new StatReference(name, id);
        this.evs = evs;
        this.ivs = ivs;
        this.value = this.calculateStat(baseValue, level, id, raisedStatId, loweredStatId);
    }

    private calculateStat(baseValue: number, level: number, id: number, raisedStatId: number, loweredStatId: number): number
    {
        const natureModifier = id == raisedStatId ? 1.1 : id == loweredStatId ? 0.9 : 1;
        return this.stat.name == "HP"
            ? Math.floor((((this.ivs + (2 * baseValue) + (this.evs / 4) + 100) * level) / 100) + 10)
            : Math.floor(Math.floor((((this.ivs + (2 * baseValue) + (this.evs / 4)) * level) / 100) + 5) * natureModifier);
    }
}
