import { AppData, Router, WebRtcServer } from 'mediasoup/node/lib/types';
import { ConnectBody, ConsumeBody, ProduceBody, isConnectBody, isConsumeBody, isProduceBody } from './RequestBodys';
import { Request, Response } from 'express';
import { producerMap, transportMap } from '../MediaSoup/Worker';




export function postProduceHandlerBuilder ({ transports, producers }: { transports: transportMap; producers: producerMap; }) {

    return (req: Request, res: Response) => {
        const body = req.body;
    if (!body || !isProduceBody(body)) {
        return res.status(400).json({ error: 'Invalid request body' });
    }

    return produceBusinessLogic(res,{body, transports, producers})
}
} 
export function getCreateTransportHandlerBuilder ({ router, transports }: { router: Router<AppData>; transports: transportMap; }) {

    return (req: Request, res: Response) => {
        
    
    return createTransportBusinessLogic(res,{router, transports})
}
} 
export function postConnectHandlerBuilder ({ transports }: { transports: transportMap; }) {

    return (req: Request, res: Response) => {
        const body = req.body;
    if (!body || !isConnectBody(body)) {
        return res.status(400).json({ error: 'Invalid request body' });
    }

    return connectBusinessLogic(res,{body, transports})
}
} 
export function postConsumeHandlerBuilder ({ transports }: { transports: transportMap; }) {

    return (req: Request, res: Response) => {
        const body = req.body;
    if (!body || !isConsumeBody(body)) {
        return res.status(400).json({ error: 'Invalid request body' });
    }

    return consumeBusinessLogic(res,{body, transports})
}
} 
export function getRouterCapabilitiesHandlerBuilder ({ router }: { router: Router<AppData>; }) {

    return (req: Request, res: Response) => {
        
    return routerCapabilitiesBusinessLogic(res, {router})
}
} 




async function createTransportBusinessLogic(res: Response<any, Record<string, any>>, {router,transports}: { router: Router<AppData>; transports: transportMap; }) {
    console.log(router.appData)
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
async function produceBusinessLogic(res: Response<any, Record<string, any>>, {body,transports, producers}: { body: ProduceBody; transports: transportMap; producers: producerMap}) {
    const { transportId, kind, rtpParameters } = body;
    let { appData } = body;
    const transport = transports.get(transportId)
    
    if (!transport) {
        console.error(`Transport ${transportId} not found for connect`)
        return res.sendStatus(404)
    }
    
    const producer = await transport.produce({kind,rtpParameters, appData})
    
    producers.set(producer.id, producer)
    return res.json({id: producer.id})
}

async function consumeBusinessLogic (res: Response<any,Record<string,any>>, {body: {producerId, transportId, rtpCapabilities, appData}, transports}: { body: ConsumeBody; transports: transportMap; }) {
    const transport = transports.get(transportId)
    if (!transport) {
        console.error(`Transport ${transportId} not found for connect`)
        return res.sendStatus(404)
    }

    transport.consume({producerId, rtpCapabilities, appData})
}

