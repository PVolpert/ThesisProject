import { ReactNode } from 'react';
import { Description, MainTitle } from '../UI/Headers';

interface WaitProps {
    children?: ReactNode;
    waitTitle: string;
}

export default function Wait({ children, waitTitle }: WaitProps) {
    return (
        <div className="flex flex-col space-y-2">
            <MainTitle> Waiting for {waitTitle} </MainTitle>
            {children}
            <svg
                className="w-24 text-springblue self-center animate-spin "
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                ></circle>
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
            </svg>
        </div>
    );
}

export function WaitForCallAnswer() {
    return (
        <Wait waitTitle="Call Answers">
            <Description>The opposing side has to accept the call.</Description>
        </Wait>
    );
}

export function WaitForConnectionStart() {
    return (
        <Wait waitTitle="Video Connection Start">
            <Description>
                All step requiring user input are done. Starting the actual
                call.
            </Description>
        </Wait>
    );
}

export function WaitForICTAnswer() {
    return (
        <Wait waitTitle="ICT Answer">
            <Description>
                The opposing side has to accept the provided identity.
            </Description>
        </Wait>
    );
}

export function WaitForICTOffer() {
    return (
        <Wait waitTitle="ICT Offer">
            <Description>
                The caller has to provide a valid identity.
            </Description>
        </Wait>
    );
}
export function WaitForCandidates() {
    return (
        <Wait waitTitle="Candidates">
            <Description>
                The group leader has to provide the other candidates.
            </Description>
        </Wait>
    );
}
export function WaitForPeerOPN() {
    return (
        <Wait waitTitle="trusted Providers of Peers">
            <Description>
                The other candidates have to provide their trusted providers.
            </Description>
        </Wait>
    );
}
export function WaitForPeerICTTransfer() {
    return (
        <Wait waitTitle="ICT of Peers">
            <Description>
                The other candidates have to provide their ICT.
            </Description>
        </Wait>
    );
}
export function WaitForConfirmations() {
    return (
        <Wait waitTitle="Confirmations">
            <Description>
                The candidates have to provider confirmations for completion the
                End-to-End Authentication.
            </Description>
        </Wait>
    );
}
export function WaitForKeyExchange() {
    return (
        <Wait waitTitle="KeyExchange Phase">
            <Description>
                The Key Exchange Phase is currently running in the background.
                See the console for more information.
            </Description>
        </Wait>
    );
}
export function WaitForOtherPeers() {
    return (
        <Wait waitTitle="other Peers">
            <Description>
                Not all other peers have confirmed their Authentication yet.
            </Description>
        </Wait>
    );
}
