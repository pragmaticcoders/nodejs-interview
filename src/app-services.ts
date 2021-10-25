import { knex as buildKnex } from "knex";
import { AppConfig, getAppConfig } from "app/config";
import logger from "app/utils/logger";
import { SkillsStorage } from "app/storages/SkillsStorage";

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
  const skillsStorage = new SkillsStorage(knex);

  return {
    knex,
    skillsStorage
  };
};

export type Storages = ReturnType<typeof createStorages>;
