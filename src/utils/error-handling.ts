export function isErrorCode(error: any, code: string): boolean
{
    const errorWithCode = error as { code: string };
    return errorWithCode && errorWithCode.code === code;
}