export const AdminConfigHelper = {
   forestAdmin: {
      enabled: Boolean(process.env.FOREST_ENABLED === 'true'),
      envSecret: process.env.FOREST_ENV_SECRET ?? '',
      authSecret: process.env.FOREST_AUTH_SECRET ?? '',
      schemaDir: process.env.FOREST_SCHEMA_DIR ?? '',
      cors: {
         origins: process.env.CORS_ORIGINS ?? '',
      },
   },
};
