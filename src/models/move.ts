import config from "../config";
import { TypeReference } from "./type";
import { Request } from "express";
import { MoveCategoryReference } from "./move-category";

export class Move
{
    id: number;
    name: string;
    description: string;
    type: TypeReference;
    category: MoveCategoryReference;
    power: number | null;
    accuracy: number | null;
    pp: number;
    generation: string;

    constructor(data: {
        id: number;
        name: string;
        description: string;
        type: TypeReference;
        category: MoveCategoryReference;
        power: number | null;
        accuracy: number | null;
        pp: number;
        generation: string;
    })
    {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.type = data.type;
        this.category = data.category;
        this.power = data.power;
        this.accuracy = data.accuracy;
        this.pp = data.pp;
        this.generation = data.generation;
    }
}

export class MoveBody
{
    id?: number;
    name?: string;
    description?: string;
    type?: string;
    typeId?: number;
    category?: string;
    categoryId?: number;
    power?: number;
    accuracy?: number;
    pp?: number;
    generation?: number;

    constructor(requestBody: Request["body"])
    {
        this.name = requestBody.name;
        this.description = requestBody.description;
        this.type = requestBody.type;
        this.category = requestBody.category;
        this.power = requestBody.power;
        this.accuracy = requestBody.accuracy;
        this.pp = requestBody.pp;
        this.generation = requestBody.generation;
    }
}

export class MoveReference
{
    name: string;
    url: string;

    constructor(name: string, id: string)
    {
        this.name = name;
        this.url = `${config.baseUrl}/api${config.movePath}/${id}`;
    }
}