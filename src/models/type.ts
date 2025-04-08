import config from "../config";

export class Type
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

export class TypeReference
{
    name: string;
    url?: string;

    constructor(name: string, url?: string)
    {
        this.name = name;
        this.url = url;
    }

    static build(types: Type[]): TypeReference[]
    {
        return types
            .filter((type) => type.id && type.name)
            .map((type) => new TypeReference(type.name!, `${config.baseUrl}/api/types/${type.id}`));
    }
}

export class TypeBody
{
    name: string;

    constructor(requestBody: any)
    {
        this.name = requestBody.name;
    }
}