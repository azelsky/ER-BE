import { createServer } from 'http';
import app from './app';

const PORT: string = process.env.PORT || '3000';

const server = createServer(app);

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});
