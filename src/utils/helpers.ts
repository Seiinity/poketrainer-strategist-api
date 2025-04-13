import capitalize from "lodash.capitalize";
import pluralize from "pluralize";

export const sanitiseTableTableSingular = (tableName: string): string => pluralize.singular(tableName.replace(/_/g, " "));

export const capitaliseTableNameSingular = (tableName: string): string => capitalize(sanitiseTableTableSingular(tableName));
