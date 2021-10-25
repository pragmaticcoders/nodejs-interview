import { createEnvReader } from "app/utils";
import { join } from "path";
import { Knex } from "knex";
import { AsyncReturnType } from "app/utils/types";

export enum Environment {
  local = "local",
  dev = "dev",
  prod = "prod",
  test = "test",
}

export type AppConfig = AsyncReturnType<typeof getAppConfig>;

export async function getAppConfig() {
  const envReader = createEnvReader(process.env);
  const { readRequiredString } = envReader;

  const environment = readRequiredString("ENVIRONMENT") as Environment;

  return {
    environment,
    dbConfig: await getDbConfig(),
  };
}

export function getDbConfig(): Knex.Config {
  return {
    client: "pg",
    connection: `postgres://${process.env.PGUSER}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE_TEST}`,
    migrations: {
      directory: join(__dirname, "./migrations"),
      loadExtensions: [".ts"],
      schemaName: "app",
    },
  };
}
