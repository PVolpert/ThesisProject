import express, { Express} from 'express';
import { getCreateTransportHandlerBuilder, getRouterCapabilitiesHandlerBuilder, postConnectHandlerBuilder, postConsumeHandlerBuilder, postProduceHandlerBuilder } from './RequestHandlers';
import { AppData, Router } from 'mediasoup/node/lib/types';
import { producerMap, transportMap } from '../MediaSoup/Worker';
import { auth } from 'express-openid-connect';


export  function createServer (router: Router<AppData>, transports: transportMap, producers: producerMap) {
    const app: Express = express();
// TODO Reenable this after initial testing
//     app.use(
//   auth({
//     issuerBaseURL: process.env.ISSUER_URL,
    
//     baseURL: process.env.CLIENT_URL,
//     clientID: process.env.CLIENT_ID,
//   })
// );

app.post('/connect', postConnectHandlerBuilder({ transports }));
app.post('/consume',postConsumeHandlerBuilder({transports}))
app.post('/produce', postProduceHandlerBuilder({ transports, producers }));
app.get('/createTransport', getCreateTransportHandlerBuilder({ router, transports }));
app.get('/routerCapabilities', getRouterCapabilitiesHandlerBuilder({ router }))

return app
}