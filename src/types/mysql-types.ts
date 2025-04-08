export type MySQLCompatibleValue = string | number | boolean | null | Date | undefined;
export type MySQLData = Record<string, MySQLCompatibleValue>;

export type MySQLQuery =
{
    sql: string;
    params: MySQLCompatibleValue[];
};
