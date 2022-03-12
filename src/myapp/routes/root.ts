import { FastifyPluginAsync } from 'fastify';

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
   fastify.get('/', async (request, reply) => {
      return { message: 'Welcome to Fastify API!' };
   });
};

export default root;
