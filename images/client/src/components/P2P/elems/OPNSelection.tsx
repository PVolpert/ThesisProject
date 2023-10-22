import { useEffect } from 'react';
import { ictProviders } from '../../../helpers/Auth/OIDCProviderInfo';
import OIDCProvider from '../../../helpers/Auth/OIDCProvider';
import OPNItem from './OPNItem';
import { Description } from '../../UI/Headers';

interface OPNSelectionProps {
    setCheckedCount: React.Dispatch<React.SetStateAction<number>>;
    isCheckedMap: Map<string, boolean>;
    setIsCheckedMap: React.Dispatch<React.SetStateAction<Map<string, boolean>>>;
}

export default function OPNSelection({
    setCheckedCount,
    isCheckedMap,
    setIsCheckedMap,
}: OPNSelectionProps) {
    // Use available ictProviders to fill the CheckedMap
    useEffect(() => {
        const newMap = new Map(
            ictProviders.map((ictProvider) => [ictProvider.info.name, false])
        );

        setIsCheckedMap(newMap);
    }, []);

    const onCheckBoxChangeHandlerBuilder = (ictProvider: OIDCProvider) => {
        const onCheckBoxChangeHandler = () => {
            // Element was not checked now checked
            const newMap = new Map(isCheckedMap);
            if (!isCheckedMap.get(ictProvider.info.name)) {
                newMap.set(ictProvider.info.name, true);
                setCheckedCount((prior) => {
                    return prior + 1;
                });
            } else {
                newMap.set(ictProvider.info.name, false);
                setCheckedCount((prior) => {
                    return prior - 1;
                });
            }
            // Element was checked now unchecked
            setIsCheckedMap(newMap);
            return;
        };
        return onCheckBoxChangeHandler;
    };

    return (
        <div className="flex flex-col space-y-2" key={'OPNSelection'}>
            <Description>Please pick OIDC-Providers you trust:</Description>
            <div className="flex flex-col md:flex-row md:space-y-0 space-y-2 md:space-x-2">
                {ictProviders.map((ictProvider) => {
                    return (
                        <OPNItem
                            checked={
                                isCheckedMap.get(ictProvider.info.name) ?? false
                            }
                            ictProviderName={ictProvider.info.name}
                            ictProviderImg={ictProvider.info.img}
                            onChangeHandler={onCheckBoxChangeHandlerBuilder(
                                ictProvider
                            )}
                        />
                    );
                })}
            </div>
        </div>
    );
}
