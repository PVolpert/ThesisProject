import { DtlsParameters, MediaKind, RtpCapabilities, RtpParameters } from "mediasoup/node/lib/types";


export interface CreateTransportBody {
}

export interface TransportIDBody {
    transportId: string
}

export interface ConnectBody extends TransportIDBody {
    dtlsParameters: DtlsParameters
}

export interface ProduceBody extends TransportIDBody {
    kind: MediaKind
    rtpParameters: RtpParameters
}

export interface ConsumeBody extends TransportIDBody {
    producerId: string,
    kind: MediaKind,
    rtpCapabilities: RtpCapabilities,
}

export function isTransportIDBody(body: any): body is TransportIDBody {
    return (
      'transportId' in body
    );
  }
// Type guard for ConnectBody
export function isConnectBody(body: any): body is ConnectBody {
    return (
        isTransportIDBody(body) &&
      'dtlsParameters' in body
    );
  }
  
  // Type guard for ProduceBody
  export function isProduceBody(body: any): body is ProduceBody {
    return (
      isTransportIDBody(body) &&
      'kind' in body &&
      'rtpParameters' in body 
    );
  }
  export function isConsumeBody(body: any): body is ConsumeBody {
    return (
      isTransportIDBody(body) &&
      'rtpCapabilities' in body &&
      'producerId' in body
    );
  }

