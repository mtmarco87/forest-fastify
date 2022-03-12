export const ConfigHelper = {
   db: {
      connection: process.env.DATABASE_CONNECTION || 'mongodb://',
      table: {
         users: process.env.DATABASE_TABLE_USERS || '',
      },
   },
   server: {
      listenAddress: process.env.FASTIFY_ADDRESS || 'localhost',
      listenPort: process.env.FASTIFY_PORT || '3000',
      applicationUrl: process.env.APPLICATION_URL || 'http://localhost:3000',
   },
};
