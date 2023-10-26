export function sendPostRequestWithAuthorization(authToken: string) {
    return async ({
        url,
        postBody,
        callback,
        errback,
    }: {
        url: string;
        postBody: any;
        callback: (resp: any) => Promise<any>;
        errback: (e: unknown) => Promise<void>;
    }) => {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json', // Set the appropriate content type
                    authorization: `Bearer ${authToken}`, // Set the authorization header with the provided token
                    origin: 'http://client.localhost',
                    'access-control-allow-origin': '*',
                },
                body: JSON.stringify(postBody), // Convert the data to JSON
            });

            if (response.ok) {
                return callback(response);
            } else {
                throw new Error(`${response.statusText}`);
                // Handle errors here
            }
        } catch (error) {
            errback(error);
        }
    };
}
export function sendGetRequestWithAuthorization(authToken: string) {
    return async ({
        url,
        callback,
        errback,
    }: {
        url: string;
        callback: (resp: any) => Promise<any>;
        errback: (e: unknown) => Promise<void>;
    }) => {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json', // Set the appropriate content type
                    Authorization: `Bearer ${authToken}`, // Set the authorization header with the provided token
                    Origin: 'http://client.localhost',
                    'Access-Control-Allow-Origin': 'http://sfu.localhost',
                },
            });

            if (response.ok) {
                return callback(response);
            } else {
                throw new Error(`${response.statusText}`);
                // Handle errors here
            }
        } catch (error) {
            errback(error);
        }
    };
}
