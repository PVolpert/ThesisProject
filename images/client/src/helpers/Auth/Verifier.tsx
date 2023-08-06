import { generateRandomCodeVerifier } from 'oauth4webapi';

class Verifier {
    #verifier: string | null;
    // Create Verifier
    protected createLocal() {
        //Guard : Error if one exists
        this.verifier = generateRandomCodeVerifier();
        return this;
    }

    protected resetLocal() {
        this.#verifier = null;
        return this;
    }

    public get verifier(): string | null {
        return this.#verifier;
    }

    public set verifier(newVerifier) {
        if (this.#verifier) {
            throw new Response(
                JSON.stringify({
                    message: 'verifier already set',
                }),
                { status: 400 }
            );
        }
        if (!newVerifier) {
            throw new Response(
                JSON.stringify({
                    message: 'input must be a string',
                }),
                { status: 400 }
            );
        }
        this.#verifier = newVerifier;
    }

    constructor() {
        this.#verifier = null;
    }
}

export class VerifierStorage extends Verifier {
    #storageName: string;
    // Store Verifier
    store() {
        // Guard: Error if already stored
        if (localStorage.getItem(this.#storageName)) {
            throw new Response(
                JSON.stringify({
                    message: 'verifier already stored',
                }),
                { status: 400 }
            );
        }
        // Guard: Check if verifier is set
        if (!this.verifier) {
            throw new Response(
                JSON.stringify({
                    message: 'verifier not set',
                }),
                { status: 400 }
            );
        }

        localStorage.setItem(this.#storageName, this.verifier);
        return this;
    }

    create() {
        if (localStorage.getItem(this.#storageName)) {
            throw new Response(
                JSON.stringify({
                    message: 'a verifier is already stored',
                }),
                { status: 400 }
            );
        }
        this.createLocal();
        return this;
    }

    load() {
        const storedVerifier = localStorage.getItem(this.#storageName);
        if (!storedVerifier) {
            throw new Response(
                JSON.stringify({
                    message: 'no verifier stored',
                }),
                { status: 400 }
            );
        }
        this.verifier = storedVerifier;
        return this;
    }

    reset() {
        this.resetLocal();
        localStorage.removeItem(this.#storageName);
        return this;
    }

    constructor(storageName: string) {
        super();
        this.#storageName = storageName;
    }
}
