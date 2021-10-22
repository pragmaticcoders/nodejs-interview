import { knex as buildKnex } from "knex";
import { AppConfig, getAppConfig } from "app/config";
import logger from "app/utils/logger";

export type AppServices = {
  appConfig: AppConfig;
  storages: Storages;
};

export const buildAppServices = async (): Promise<AppServices> => {
  logger.info("Building app services");
  const appConfig = await getAppConfig();
  const storages = createStorages(appConfig);
  await startStorages(storages);
  return {
    appConfig,
    storages,
  };
};

export const startStorages = async (storages: Storages) => {
  await storages.knex.raw("CREATE SCHEMA IF NOT EXISTS app;");
  await storages.knex.migrate.latest();
};

export const stopStorages = async (storages: Storages) => {
  await storages.knex.destroy();
};

export const createStorages = (appConfig: AppConfig) => {
  const knex = buildKnex(appConfig.dbConfig);

  return {
    knex,
  };
};

export type Storages = ReturnType<typeof createStorages>;
