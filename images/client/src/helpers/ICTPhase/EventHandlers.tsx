import OIDCProvider from '../Auth/OIDCProvider';
import { ictProviders } from '../Auth/OIDCProviderInfo';
import { Candidate } from './ICTPhase';
import { OpenIDProviderInfo, convertOIDCProvider } from './OpenIDProvider';
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
        openIDProviderInfo: OpenIDProviderInfo;
    }[] = [];

    const targetsByProvider = new Map<string, string[]>();

    selectedProviders.forEach((provider, target) => {
        const providerIssuer = provider.info.issuer.href;
        // Add to list if already in map or create a new map item
        if (targetsByProvider.has(providerIssuer)) {
            targetsByProvider.get(providerIssuer)?.push(target);
        } else {
            targetsByProvider.set(providerIssuer, [target]);
        }

        const tokenSet = matchedTokenSet.get(providerIssuer);

        if (tokenSet) {
            const tokenSetInfo = {
                tokenSet,
                targets: targetsByProvider.get(providerIssuer) ?? [],
                openIDProviderInfo: convertOIDCProvider(provider),
            };

            tokenSetList.push(tokenSetInfo);
        } else {
            throw new Error('Provider has no TokenSet');
        }
    });

    return tokenSetList;
}
