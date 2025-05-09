﻿import { StatReference } from "./stat";
import config from "../config";
import { buildReferencePath } from "../utils/helpers";

export class Nature
{
    id: number;
    name: string;
    raisedStat: StatReference | null;
    loweredStat: StatReference | null;

    constructor(data: {
        id: number;
        name: string;
        raisedStat: StatReference | null;
        loweredStat: StatReference | null;
    })
    {
        this.id = data.id;
        this.name = data.name;
        this.raisedStat = data.raisedStat;
        this.loweredStat = data.loweredStat;
    }
}

export class NatureReference
{
    name: string;
    url: string;

    constructor(name: string, id: number)
    {
        this.name = name;
        this.url = this.url = buildReferencePath(config.naturePath, id);
    }
}
