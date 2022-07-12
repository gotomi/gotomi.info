import express from 'express';
import { handler as ssrHandler } from './dist/server/entry.mjs';
const PORT = 8081;
const app = express();
app.use(ssrHandler);
app.use('/', express.static('./dist/client'));






app.listen(PORT, () => console.log(`http://127.0.0.1:${PORT}`));
