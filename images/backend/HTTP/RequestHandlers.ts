import { AppData, Router, WebRtcServer } from 'mediasoup/node/lib/types';
import { ConnectBody, ConsumeBody, ProduceBody, isConnectBody, isConsumeBody, isProduceBody } from './RequestBodys';
import { Request, Response } from 'express';
import { transportMap } from '../MediaSoup/Worker';




export function postProduceHandlerBuilder ({ transports }: { transports: transportMap}) {

    return (req: Request, res: Response) => {
        const body = req.body;
    if (!body || !isProduceBody(body)) {
        return res.status(400).json({ error: 'Invalid request body produce' });
    }

    return produceBusinessLogic(res,{body, transports})
}
} 
export function getCreateTransportHandlerBuilder ({ router, transports }: { router: Router<AppData>; transports: transportMap; }) {

    return (_: Request, res: Response) => {
        
    
    return createTransportBusinessLogic(res,{router, transports})
}
} 
export function postConnectHandlerBuilder ({ transports }: { transports: transportMap; }) {

    return (req: Request, res: Response) => {
        const body = req.body;
    if (!body || !isConnectBody(body)) {
        return res.status(400).json({ error: 'Invalid request body connect' });
    }

    return connectBusinessLogic(res,{body, transports})
}
} 
export function postConsumeHandlerBuilder ({ transports, router }: { transports: transportMap; router: Router}) {

    return (req: Request, res: Response) => {
        const body = req.body;
    if (!body || !isConsumeBody(body)) {
        return res.status(400).json({ error: 'Invalid request body' });
    }

    return consumeBusinessLogic(res,{body, transports, router})
}
} 
export function getRouterCapabilitiesHandlerBuilder ({ router }: { router: Router<AppData>; }) {

    return (_: Request, res: Response) => {
        
    return routerCapabilitiesBusinessLogic(res, {router})
}
} 




async function createTransportBusinessLogic(res: Response<any, Record<string, any>>, {router,transports}: { router: Router<AppData>; transports: transportMap; }) {
    const newTransport = await  router.createWebRtcTransport({
        // Use webRtcServer or listenIps
        webRtcServer : router.appData.webRTCServer as WebRtcServer<AppData>,
        enableUdp    : true,
        enableTcp    : true,
        preferUdp    : true
      })
    transports.set(newTransport.id,newTransport)

    const { id, iceParameters, iceCandidates, dtlsParameters, sctpParameters } = newTransport

    return res.json({ id, iceParameters, iceCandidates, dtlsParameters, sctpParameters })
}



function routerCapabilitiesBusinessLogic(res: Response<any, Record<string, any>>, {router}: { router: Router<AppData>}) {
    return res.json({routerCapabilities: router.rtpCapabilities})
}

async function connectBusinessLogic(res: Response<any, Record<string, any>>, {body: {dtlsParameters, transportId}, transports}: { body: ConnectBody; transports: transportMap; }) {
    const transport = transports.get(transportId)
    if (!transport) {
        console.error(`Transport ${transportId} not found for connect`)
        return res.sendStatus(404)
    }
    await transport.connect({dtlsParameters})
    
    return res.sendStatus(200)
}
async function produceBusinessLogic(res: Response<any, Record<string, any>>, {body,transports}: { body: ProduceBody; transports: transportMap}) {
    const { transportId, kind, rtpParameters } = body;
    const transport = transports.get(transportId)
    
    if (!transport) {
        console.error(`Transport ${transportId} not found for connect`)
        return res.sendStatus(404)
    }
    
    const producer = await transport.produce({kind,rtpParameters})
    
    return res.json({id: producer.id})
}



async function consumeBusinessLogic (res: Response<any,Record<string,any>>, {body: {producerId, transportId, rtpCapabilities}, transports, router}: { body: ConsumeBody; transports: transportMap;  router: Router}) {
    const transport = transports.get(transportId)
    if (!transport) {
        console.error(`Transport ${transportId} not found for connect`)
        return res.sendStatus(404)
    }

   if (! router.canConsume({producerId,rtpCapabilities})){
    console.error("Router can not consume producer")
    return res.sendStatus(404)
   }
    const consumer = await transport.consume({producerId, rtpCapabilities})
    return res.json({rtpParameters: consumer.rtpParameters, id: consumer.id, kind: consumer.kind})
}

