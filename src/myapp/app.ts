import { join } from 'path';
import AutoLoad, { AutoloadPluginOptions } from 'fastify-autoload';
import { FastifyPluginAsync } from 'fastify';

export type MyAppOptions = {
   logger: boolean;
} & Partial<AutoloadPluginOptions>;

const myApp: FastifyPluginAsync<MyAppOptions> = async (
   fastify,
   opts
): Promise<void> => {
   // Place here your custom code!

   // Do not touch the following lines

   // This loads all plugins defined in plugins
   // those should be support plugins that are reused
   // through your application
   void fastify.register(AutoLoad, {
      dir: join(__dirname, 'plugins'),
      options: opts,
   });

   // This loads all plugins defined in routes
   // define your routes in one of these
   void fastify.register(AutoLoad, {
      dir: join(__dirname, 'routes'),
      options: opts,
   });

   fastify.ready(async (err) => {
      if (err) throw err;
   });
};

export default myApp;
export { myApp };
