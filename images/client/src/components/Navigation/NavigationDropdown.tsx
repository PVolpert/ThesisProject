import { ReactNode } from 'react';
import UserIcon from '../UI/UserIcon';
import { Description } from '../UI/Headers';
import SettingsButton from './SettingsButton';
import LogOutButton from './LogOutButton';
import UserBlock from '../UI/UserBlock';

interface NavigationDropdownProps {
    children?: ReactNode;
    className?: string;
    username: string;
    name: string;
    showSettings: () => void;
    logOutHandler: () => void;
}

export default function NavigationDropdown({
    username,
    name,
    showSettings,
    logOutHandler,
}: NavigationDropdownProps) {
    return (
        <div className="absolute top-full right-0 z-10 flex flex-col p-2 rounded space-y-2 bg-zinc-400 dark:bg-zinc-700">
            {/* Name Field */}

            <UserBlock name={name} username={username} />
            {/* Options */}
            <SettingsButton showSettings={showSettings} />

            {/* Log Out */}
            <LogOutButton logOutHandler={logOutHandler} />
        </div>
    );
}
