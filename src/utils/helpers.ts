import capitalize from "lodash.capitalize";
import pluralize from "pluralize";

export const capitaliseTableName = (tableName: string): string =>
    capitalize(pluralize.singular(tableName.replace(/_/g, ' ')));