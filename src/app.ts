import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import fastifyExpress from 'fastify-express';
import adminApp from './admin/app';
import myApp from './myapp/app';
import { AdminConfigHelper } from './admin/config/adminConfigHelper';

export type AppOptions = {
   logger: boolean;
};

// Additional options for Fastify library, used only if .env -> FASTIFY_OPTIONS is set to true
const options: AppOptions = {
   logger: true,
};

const app: FastifyPluginAsync<AppOptions> = fp(
   async (fastify, opts): Promise<void> => {
      if (AdminConfigHelper.forestAdmin.enabled) {
         // Boot Forest Admin with Express wrapper, on the root scope
         await fastify.register(fastifyExpress).register(adminApp);
      }

      // Boot your App in its custom scope
      await fastify.register(myApp);
   }
);

export default app;
export { app, options };
