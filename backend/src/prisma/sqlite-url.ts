export function getSqliteFilePath(databaseUrl = process.env.DATABASE_URL) {
  if (!databaseUrl) {
    return './dev.db';
  }

  return databaseUrl.startsWith('file:')
    ? databaseUrl.replace('file:', '')
    : databaseUrl;
}
