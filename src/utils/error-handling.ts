export function isErrorCode(error: unknown, code: string): boolean
{
    const errorWithCode = error as { code: string };
    return errorWithCode && errorWithCode.code === code;
}

export function getMySQLForeignKeyErrorConstraint(error: unknown): string
{
    if (!isErrorCode(error, "ER_NO_REFERENCED_ROW_2")) return "";

    const mySQLError = error as { sqlMessage: string };
    const regex = /CONSTRAINT `([^`]+)`/;
    const match = mySQLError.sqlMessage.match(regex);

    return (match && match[1]) ? match[1] : "";
}
