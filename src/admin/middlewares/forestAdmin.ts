import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import path from 'path';
import Liana from 'forest-express-mongoose';
import db from '../models/db';
import chalk from 'chalk';
import { AdminConfigHelper } from '../config/adminConfigHelper';

const forestAdmin: FastifyPluginAsync = fp(
   async (fastify: FastifyInstance, _opts) => {
      // ForestAdmin core plugin
      fastify.use(
         await Liana.init({
            configDir: path.join(process.cwd(), 'src/admin/forest'),
            envSecret: AdminConfigHelper.forestAdmin.envSecret,
            authSecret: AdminConfigHelper.forestAdmin.authSecret,
            schemaDir: AdminConfigHelper.forestAdmin.schemaDir,
            objectMapping: db.objectMapping,
            connections: db.connections,
         })
      );

      // eslint-disable-next-line no-console
      console.log(
         chalk.cyan(
            'Your admin panel is available here: https://app.forestadmin.com/projects'
         )
      );
   }
);

export default forestAdmin;
