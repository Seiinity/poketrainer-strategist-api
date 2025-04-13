import capitalize from "lodash.capitalize";
import pluralize from "pluralize";
import config from "../config";
import path from "node:path";
import fs from "node:fs";

export const sanitiseTableTableSingular = (tableName: string): string => pluralize.singular(tableName.replace(/_/g, " "));

export const capitaliseTableNameSingular = (tableName: string): string => capitalize(sanitiseTableTableSingular(tableName));

export function buildPathForJSON(...parts: string[])
{
    return parts
        .map((part, index) =>
        {
            if (index === 0) return part.replace(/\/+$/, ""); // Trims trailing slash for first part.
            if (index === parts.length - 1) return part.replace(/^\/+/, ""); // Trims leading slash for last part.
            return part.replace(/^\/+|\/+$/g, ""); // Trims both slashes for middle parts.
        })
        .join("/");
}

export function buildReferencePath(path: string, id: number): string
{
    return buildPathForJSON(config.baseUrl, "api", path, id.toString());
}

export function getSpriteUrl(basePath: string, name: string): string
{
    const imagePath = path.join("./public/sprites", basePath, `${name}.png`);

    if (fs.existsSync(imagePath)) return buildPathForJSON(config.baseUrl, "sprites", basePath, `${name}.png`);
    return buildPathForJSON(config.baseUrl, "sprites", basePath, "0.png");
}
