import fs from 'fs';
import path from 'path';
import databases from '../config/databases';
import Mongoose from 'mongoose';
import { IIndexableOf } from '../../myapp/types/interfaces/iindexableOfT';

const connections: IIndexableOf<Mongoose.Connection> = {};
interface DbType {
   objectMapping: typeof Mongoose;
   connections: IIndexableOf<Mongoose.Connection>;
   [key: string]: object | undefined;
}
const db: DbType = {} as unknown as DbType;

databases.forEach(async (databaseInfo) => {
   const connection = Mongoose.createConnection(
      databaseInfo.connection.url,
      databaseInfo.connection.options as unknown as Mongoose.ConnectOptions
   );
   connections[databaseInfo.name] = connection;

   const modelsDir =
      databaseInfo.modelsDir || path.join(__dirname, databaseInfo.name);
   fs.readdirSync(modelsDir)
      .filter(
         (file) =>
            file.indexOf('.') !== 0 &&
            file.indexOf('.ts') === -1 &&
            file.indexOf('.map') === -1 &&
            file !== 'db.js' &&
            file !== 'index.js'
      )
      .forEach(async (file) => {
         try {
            const module = (await import(path.join(modelsDir, file))).default;
            const model = module(connection, Mongoose);
            db[model.modelName] = model;
         } catch (error) {
            // eslint-disable-next-line no-console
            console.error(`Model creation error: ${error}`);
         }
      });
});

db.objectMapping = Mongoose;
db.connections = connections;

export default db;
