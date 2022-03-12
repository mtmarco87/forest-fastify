import path from 'path';
import { ConfigHelper } from '../../myapp/config/configHelper';

export const databases = [
   {
      name: 'default',
      modelsDir: path.resolve(__dirname, '../models'),
      connection: {
         url: ConfigHelper.db.connection,
         options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
         },
      },
   },
];

export default databases;
