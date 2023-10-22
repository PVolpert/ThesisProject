import { useEffect, useState } from 'react';
import Button from '../../../UI/Button';
import { UserId } from '../../../../helpers/Signaling/User';
import UserItem from './UserItem';
import { useStore } from '../../../../store/Store';

interface UseMenuProps {
    activeUsers: UserId[];
}

export default function UseMenu({ activeUsers }: UseMenuProps) {
    const [checkedCount, setCheckedCount] = useState(0);

    const [formData, setFormData] = useState<Map<string, boolean>>(new Map());

    const setCandidates = useStore((state) => state.setCandidates);
    const setType = useStore((state) => state.setType);

    const showOutgoingCallModal = useStore(
        (state) => state.showOutgoingCallModal
    );

    useEffect(() => {
        const formDataMap = new Map(
            activeUsers.map((userID) => [`checkbox_${userID.username}`, false])
        );

        setFormData(formDataMap);
    }, [activeUsers]);

    // Call Function
    const onCallHandlerBuilder = (callee: UserId) => {
        const onCallHandler = () => {
            setCandidates([callee]);
            setType('call');
            showOutgoingCallModal();
        };
        return onCallHandler;
    };

    const onConferenceHandler = () => {
        const filteredUsers = activeUsers.filter(
            (user) => formData.get(`checkbox_${user.username}`) === true
        );
        setCandidates(filteredUsers);
        setType('conference');
        showOutgoingCallModal();
    };

    // Checkbox Changed function
    const onCheckBoxChangeHandlerBuilder = (user: UserId) => {
        const onCheckBoxChangeHandler = () => {
            if (!formData.get(`checkbox_${user.username}`)) {
                const newMap = new Map(formData);
                newMap.set(`checkbox_${user.username}`, true);
                setFormData(newMap);
                setCheckedCount((prior) => {
                    return prior + 1;
                });
                return;
            }
            const newMap = new Map(formData);
            newMap.set(`checkbox_${user.username}`, false);
            setFormData(newMap);
            setCheckedCount((prior) => {
                return prior - 1;
            });
            return;
        };
        return onCheckBoxChangeHandler;
    };

    return (
        <div className="flex space-y-3 flex-col">
            <ul className="flex flex-col ">
                {activeUsers.map((user) => {
                    return (
                        <UserItem
                            username={user.username}
                            key={user.username}
                            callFct={onCallHandlerBuilder(user)}
                            onCheckedChangeHandler={onCheckBoxChangeHandlerBuilder(
                                user
                            )}
                            isChecked={
                                formData.get(`checkbox_${user.username}`) ??
                                false
                            }
                        />
                    );
                }) || <p>No active users :(</p>}
            </ul>
            {checkedCount > 0 && (
                <Button
                    onClick={onConferenceHandler}
                    className="flex-1 justify-center text-lg bg-springblue hover:bg-inherit border-springblue hover:text-springblue text-white transition duration-1050"
                >
                    Conference with {checkedCount}{' '}
                    {checkedCount > 1 ? 'Users' : 'User'}
                </Button>
            )}
        </div>
    );
}
