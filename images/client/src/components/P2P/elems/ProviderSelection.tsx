import { ReactNode, useEffect, useState } from 'react';
import OIDCProvider from '../../../helpers/Auth/OIDCProvider';
import { Candidate } from '../../../helpers/ICTPhase/ICTPhase';
import { useStore } from '../../../store/Store';
import { TokenSet } from '../../../store/slices/ICTAccessTokenSlice';
import { getProvidersFromCandidates } from '../../../helpers/ICTPhase/EventHandlers';
import { ictProviders } from '../../../helpers/Auth/OIDCProviderInfo';
import { Description } from '../../UI/Headers';
import { stringToUserId } from '../../../helpers/Signaling/User';
import RadioItem from './RadioItem';

interface ProviderSelectionProps {
    candidates: Map<string, Candidate>;
    setSelectedProviders: React.Dispatch<
        React.SetStateAction<Map<string, OIDCProvider>>
    >;
    matchedTokenSet: Map<string, TokenSet>;
    setMatchedTokenSet: React.Dispatch<
        React.SetStateAction<Map<string, TokenSet>>
    >;
    children: ReactNode;
}

export default function ProviderSelection({
    candidates,
    setSelectedProviders,
    matchedTokenSet,
    setMatchedTokenSet,
    children,
}: ProviderSelectionProps) {
    const tokenSets = useStore((state) => state.ictTokenSets);
    const [calleesOPN, setCalleesOPN] = useState<
        { id: string; providers: OIDCProvider[] }[]
    >([]);

    const handleOptionChangeBuilder = (
        radioName: string,
        value: OIDCProvider
    ) => {
        return () =>
            setSelectedProviders((prevSelectedOptions) => {
                const newMap = new Map(prevSelectedOptions);
                newMap.set(radioName, value);
                return newMap;
            });
    };

    useEffect(() => {
        if (candidates.size == 0) {
            return;
        }
        (async () => {
            setCalleesOPN(await getProvidersFromCandidates(candidates));
        })();
    }, [candidates]);

    useEffect(() => {
        const newMap = new Map<string, TokenSet>();

        ictProviders.forEach((oidcProvider) => {
            const matchedTokenSet = tokenSets.find((tokenSet) => {
                return oidcProvider.info.issuer.href === tokenSet.idToken.iss;
            });
            if (matchedTokenSet) {
                newMap.set(oidcProvider.info.issuer.href, matchedTokenSet);
            }
        });
        setMatchedTokenSet(newMap);
    }, [tokenSets]);

    return (
        <div>
            {children}
            <div className="flex flex-col space-y-2">
                {calleesOPN.map(({ id, providers }) => {
                    return (
                        <div className="flex flex-col space-y-2">
                            <Description>
                                Please pick a OIDC-Provider for{' '}
                                {stringToUserId(id).username}:
                            </Description>
                            {providers.map((oidcProvider) => {
                                return (
                                    <RadioItem
                                        ictProvider={oidcProvider}
                                        idToken={
                                            matchedTokenSet.get(
                                                oidcProvider.info.issuer.href
                                            )?.idToken
                                        }
                                        radioName={id}
                                        onChangeHandler={handleOptionChangeBuilder(
                                            id,
                                            oidcProvider
                                        )}
                                    />
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
