import { createWorker } from "mediasoup";
import { Transport } from "mediasoup/node/lib/Transport";
import { AppData, Producer } from "mediasoup/node/lib/types";

type transportID = string
type producerID = string
export type transportMap = Map<transportID,Transport<AppData>>


export async function createNewWorker(){

    const worker = await createWorker({
      rtcMinPort: 10000,
      rtcMaxPort: 10500
    })
    worker.on('died', () =>
		{
			console.error(
				'mediasoup Worker died, exiting  in 2 seconds... [pid:%d]', worker.pid);

			setTimeout(() => process.exit(1), 2000);
		});
        const webRTCServer = await worker.createWebRtcServer({
            listenInfos :
            [
              {
                protocol : 'udp',
                ip       : '0.0.0.0',
                announcedIp: '127.0.0.1'
              },
              {
                protocol : 'tcp',
                ip       : '0.0.0.0',
                announcedIp: '127.0.0.1'
              }
            ]
          })

          worker.appData.webRTCServer = webRTCServer
          
    return worker
}