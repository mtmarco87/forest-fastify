import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import {
   errorHandler,
   ensureAuthenticated,
   PUBLIC_ROUTES,
} from 'forest-express-mongoose';
import requireAll from 'require-all';
import path from 'path';
import cors from 'cors';
import { Application } from 'express';
import { AdminConfigHelper } from './config/adminConfigHelper';

export type AdminAppOptions = {
   logger: boolean;
};

const adminApp = fp<AdminAppOptions>(
   async (fastify: FastifyInstance, _opts: AdminAppOptions) => {
      let allowedOrigins = [/\.forestadmin\.com$/, /localhost:\d{4}$/];

      if (AdminConfigHelper.forestAdmin.cors.origins) {
         allowedOrigins = allowedOrigins.concat(
            AdminConfigHelper.forestAdmin.cors.origins.split(
               ','
            ) as unknown as RegExp[]
         );
      }

      const corsConfig = {
         origin: allowedOrigins,
         maxAge: 86400, // NOTICE: 1 day
         credentials: true,
      };

      fastify.use(
         '/forest/authentication',
         cors({
            ...corsConfig,
            // The null origin is sent by browsers for redirected AJAX calls
            // we need to support this in authentication routes because OIDC
            // redirects to the callback route
            origin: corsConfig.origin.concat('null' as unknown as RegExp),
         }) as unknown as Application
      );
      fastify.use(cors(corsConfig));

      // Main Forest Admin be endpoint
      fastify.use('/forest', (request, response, next) => {
         if (PUBLIC_ROUTES.includes(request.url)) {
            return next();
         }
         // Authentication requires CORS
         return ensureAuthenticated(request, response, next);
      });

      requireAll({
         dirname: path.join(__dirname, 'routes'),
         recursive: true,
         resolve: async (route: FastifyPluginAsync) =>
            await fastify.register(route, { prefix: '/forest' }),
      });

      requireAll({
         dirname: path.join(__dirname, 'middlewares'),
         recursive: true,
         resolve: async (middleware: FastifyPluginAsync) => {
            await fastify.register(middleware);
         },
      });

      fastify.use(errorHandler());
   }
);

export default adminApp;
export { adminApp };

// // HTTP request logger middleware for node.js
// fastify.use(morgan('tiny'));
// // DON'T USE!! BodyParser middleware breaks the Fastify main api
// fastify.use(bodyParser.json());
// fastify.use(bodyParser.urlencoded({ extended: false }));
// // CookieParser middleware
// fastify.use(cookieParser());
// // Express static: useless, we already use Fastify Static
// fastify.use(express.static(path.join(__dirname, 'public')));
// Express-JWT Middleware (apparently not needed, fastify already has its own JWT)
// fastify.use(
//    jwt({
//       secret: process.env.FOREST_AUTH_SECRET,
//       credentialsRequired: false,
//       algorithms: ['HS256'],
//    })
// );
