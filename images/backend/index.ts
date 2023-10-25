
import dotenv from 'dotenv';
import { createServer } from './HTTP/Server';
import { createNewWorker, producerMap, transportMap } from './MediaSoup/Worker';

dotenv.config();
const port = process.env.PORT;
const transports: transportMap = new Map()
const producers: producerMap = new Map()


async function run() {
  const worker = await createNewWorker()
  const router = await worker.createRouter()
  router.appData.webRTCServer = worker.appData.webRTCServer

  const app = createServer(router, transports, producers)
  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
}



run()