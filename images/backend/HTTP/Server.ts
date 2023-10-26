import express, { Express} from 'express';
import { getCreateTransportHandlerBuilder, getRouterCapabilitiesHandlerBuilder, postConnectHandlerBuilder, postConsumeHandlerBuilder, postProduceHandlerBuilder } from './RequestHandlers';
import { AppData, Router } from 'mediasoup/node/lib/types';
import {  transportMap } from '../MediaSoup/Worker';
import { auth } from 'express-openid-connect';
import cors from 'cors'


export  function createServer ({ router, transports }: { router: Router<AppData>; transports: transportMap; }) {
    const app: Express = express();
// TODO Reenable this after initial testing
//     app.use(
//   auth({
//     issuerBaseURL: process.env.ISSUER_URL,
    
//     baseURL: process.env.CLIENT_URL,
//     clientID: process.env.CLIENT_ID,
//   })
// );

app.use(cors())
app.use(express.json())

app.post('/connect', postConnectHandlerBuilder({ transports }));
app.post('/consume',postConsumeHandlerBuilder({router,transports}))
app.post('/produce', postProduceHandlerBuilder({ transports }));
app.get('/createTransport', getCreateTransportHandlerBuilder({ router, transports }));
app.get('/routerCapabilities', getRouterCapabilitiesHandlerBuilder({ router }))

return app
}