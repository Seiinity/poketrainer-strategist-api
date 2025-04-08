export function isErrorCode(error: unknown, code: string): boolean
{
    const errorWithCode = error as { code: string };
    return errorWithCode && errorWithCode.code === code;
}
