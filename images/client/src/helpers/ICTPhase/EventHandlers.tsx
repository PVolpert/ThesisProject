import OIDCProvider from '../Auth/OIDCProvider';
import { ictProviders } from '../Auth/OIDCProviderInfo';
import { Candidate } from './ICTPhase';
import { ICTProviderInfo, convertToICTProvider } from './OpenIDProvider';
import { TokenSet } from '../../store/slices/ICTAccessTokenSlice';

function getProvidersFromOPN(OPN: Map<string, string>) {
    return [...OPN.keys()].map((opnIssuer) => {
        const oidcProvider = ictProviders.find((provider) => {
            return provider.info.issuer.href === opnIssuer;
        }) as OIDCProvider;

        return oidcProvider;
    });
}

export async function getProvidersFromCandidates(
    candidates: Map<string, Candidate>
) {
    return Promise.all(
        [...candidates.entries()].map(async ([id, candidate]) => {
            const OPNMap = await candidate.receivedOPNMap.exportToMap();
            return { id, providers: getProvidersFromOPN(OPNMap) };
        })
    );
}

export function createTokenSetList(
    selectedProviders: Map<string, OIDCProvider>,
    matchedTokenSet: Map<string, TokenSet>
) {
    const tokenSetList: {
        tokenSet: TokenSet;
        targets: string[];
        openIDProviderInfo: ICTProviderInfo;
    }[] = [];
    selectedProviders.forEach((provider, target) => {
        const providerIssuer = provider.info.issuer.href;
        const existingEntryIndex = tokenSetList.findIndex(
            (entry) => entry.tokenSet.idToken.iss === providerIssuer
        );

        if (existingEntryIndex !== -1) {
            // Provider already exists in the tokenSetList, update the targets
            tokenSetList[existingEntryIndex].targets.push(target);
        } else {
            // Provider is not in the list, create a new entry
            const tokenSet = matchedTokenSet.get(providerIssuer);

            if (tokenSet) {
                const tokenSetInfo = {
                    tokenSet,
                    targets: [target],
                    openIDProviderInfo: convertToICTProvider(provider),
                };

                tokenSetList.push(tokenSetInfo);
            } else {
                throw new Error('Provider has no TokenSet');
            }
        }
    });

    return tokenSetList;
}
