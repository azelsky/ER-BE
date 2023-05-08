import { createServer } from 'http';

import * as dotenv from 'dotenv';

import app from './app';

dotenv.config();

const PORT: string = process.env.PORT || '3000';

const server = createServer(app);

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
