
import dotenv from 'dotenv';
import { createServer } from './HTTP/Server';
import { createNewWorker, transportMap } from './MediaSoup/Worker';

dotenv.config();
const port = process.env.PORT;
const transports: transportMap = new Map()



async function run() {
  const worker = await createNewWorker()
  const router = await worker.createRouter({mediaCodecs: [
    {
      kind: 'audio',
      mimeType: 'audio/opus',
      clockRate: 48000,
      channels: 2,
    },
    {
      kind: 'video',
      mimeType: 'video/VP8',
      clockRate: 90000,
      parameters: {
        'x-google-start-bitrate': 1000,
      },
    },
  ] ,appData: worker.appData, })

  const app = createServer({ router, transports })
  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
}
run()

process.on('SIGTERM', () => {
  // Handle the SIGTERM signal here.
  console.log('Received SIGTERM signal. Cleaning up and exiting gracefully.');
  
  // Perform any necessary cleanup operations before exiting.
  // For example, close database connections or release resources.

  // Exit the process when you're done with cleanup.
  process.exit(0);
});
