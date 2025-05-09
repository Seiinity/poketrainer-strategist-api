﻿import config from "../config";
import { TeamReference } from "./team";
import { Request } from "express";
import { buildReferencePath } from "../utils/helpers";

export class Trainer
{
    id?: number;
    name: string;
    passwordHash?: string;
    teams?: TeamReference[];

    constructor(data: {
        id?: number;
        name: string;
        passwordHash?: string;
        teams?: TeamReference[];
    })
    {
        this.id = data.id;
        this.name = data.name;
        this.passwordHash = data.passwordHash;
        this.teams = data.teams;
    }
}

export class TrainerBody
{
    name?: string;
    password?: string;
    passwordHash?: string;

    constructor(requestBody: Request["body"], passwordHash?: string)
    {
        this.name = requestBody.name;
        this.password = requestBody.password;
        this.passwordHash = passwordHash;
    }
}

export class TrainerReference
{
    name: string;
    url?: string;

    constructor(name: string, id: number)
    {
        this.name = name;
        this.url = this.url = buildReferencePath(config.trainerPath, id);
    }
}

export class TrainerVerification
{
    sub: string;

    constructor(sub: string)
    {
        this.sub = sub;
    }

    get()
    {
        const {...object} = this;
        return {...object};
    }
}
