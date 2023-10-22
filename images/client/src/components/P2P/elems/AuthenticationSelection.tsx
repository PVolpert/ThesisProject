import { ReactNode, useEffect, useState } from 'react';
import { Candidate, Identity } from '../../../helpers/ICTPhase/ICTPhase';
import AuthenticationItem from './AuthenticationItem';

interface AuthenticationSelectionProps {
    candidates: Map<string, Candidate>;
    children: ReactNode;
    setAreUsersAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AuthenticationSelection({
    candidates,
    children,
    setAreUsersAuthenticated,
}: AuthenticationSelectionProps) {
    const [userMap, setUserMap] = useState<Map<string, Identity>>(new Map());

    const [isCheckedMap, setIsCheckedMap] = useState<Map<string, boolean>>(
        new Map()
    );

    const onCheckBoxChangeHandlerBuilder = (userId: string) => {
        const onCheckBoxChangeHandler = () => {
            // Element was not checked now checked
            const newMap = new Map(isCheckedMap);
            if (!isCheckedMap.get(userId)) {
                newMap.set(userId, true);
            } else {
                newMap.set(userId, false);
            }
            // Element was checked now unchecked
            setIsCheckedMap(newMap);
        };
        return onCheckBoxChangeHandler;
    };

    useEffect(() => {
        setAreUsersAuthenticated(
            [...isCheckedMap.values()].every((isChecked) => isChecked)
        );
    }, [isCheckedMap]);

    useEffect(() => {
        const newCheckedMap = new Map(
            Array.from(candidates.keys(), (key) => [key, false])
        );
        setIsCheckedMap(newCheckedMap);
    }, [candidates]);

    useEffect(() => {
        const newUserMap = new Map();

        [...candidates.entries()].forEach(([key, candidate]) => {
            if (!candidate.identity) {
                throw new Error('Candidate has no assigned identity');
            }

            newUserMap.set(key, candidate.identity);
        });

        setUserMap(newUserMap);
    }, [candidates]);

    return (
        <div className="flex flex-col gap-y-2" key={'AuthenticationSelection'}>
            {children}

            {[...userMap.entries()].map(([id, user]) => {
                return (
                    <AuthenticationItem
                        {...user}
                        checked={isCheckedMap.get(id) ?? false}
                        onCheckBoxChangeHandler={onCheckBoxChangeHandlerBuilder(
                            id
                        )}
                    />
                );
            })}
        </div>
    );
}
