import config from "../config";

export type Type =
{
    id?: number;
    name: string;
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