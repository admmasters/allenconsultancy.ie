import { createServer } from 'node:http';
import { handler } from './dist/server/entry.mjs';

const server = createServer(handler);
server.listen(3000, () => {
  console.log('Astro app running on port 3000');
});