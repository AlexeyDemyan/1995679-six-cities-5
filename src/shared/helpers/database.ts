export function getMongoURI(
  username: string,
  password: string,
  host: string,
  port: string,
  databaseName: string
) {
  return `mongodb://${username}:${password}@${host}:${port}/${databaseName}?authSource=admin`;
}
