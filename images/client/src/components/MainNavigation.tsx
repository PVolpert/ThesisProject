import { NavLink } from 'react-router-dom';

import useDisplayToggle from '../hooks/useDisplayToggle';
import { useToken } from '../hooks/useToken';
import NavigationDropdown from './Navigation/NavigationDropdown';
import DropDownButton from './Navigation/DropDownButton';
import LoginLink from './Navigation/LoginLink';
import HomeLink from './Navigation/HomeLink';
import { useStore } from '../store/Store';
import classes from './MainNavigation.module.css';
import ConnectionStatus from './UI/ConnectionStatus';

function MainNavigation() {
    const { accessToken, idToken, resetTokens } = useToken();

    const {
        isShown: isShowDropdown,
        hideModal: hideDropdown,
        showModal: showDropdown,
    } = useDisplayToggle({ shownInitial: false });

    function logOutHandler() {
        hideDropdown();
        resetTokens();
    }

    const showSettingsModal = useStore((state) => state.showSettingsModal);

    const signalingConnectionState = useStore(
        (state) => state.signalingConnectionState
    );

    const name =
        idToken && idToken.name ? idToken.name.toString() : 'Unknown name';
    const username =
        idToken && idToken.preferred_username
            ? idToken.preferred_username.toString()
            : 'Unknown username';

    return (
        <nav className=" p-6">
            <div className="flex items-center justify-between md:space-x-20">
                <div className="flex space-x-6">
                    <NavLink
                        to="/"
                        className="relative flex place-items-center z-2 font-mono text-xl"
                        end
                    >
                        SAFEGUARD
                    </NavLink>
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `flex place-items-center dark:text-amber-200 dark:hover:text-amber-600 text-amber-600 hover:text-amber-400 transition duration-105 ${
                                isActive ? classes['active'] : ''
                            }`.trim()
                        }
                        end
                    >
                        <HomeLink />
                    </NavLink>
                    {accessToken && (
                        <NavLink
                            to="/call"
                            className={({ isActive }) =>
                                `flex place-items-center dark:text-amber-200 dark:hover:text-amber-600 text-amber-600 hover:text-amber-400 transition duration-105 ${
                                    isActive ? classes['active'] : ''
                                }`.trim()
                            }
                        >
                            Make a Call
                        </NavLink>
                    )}
                </div>
                <div className="flex space-x-6 place-items-center">
                    {accessToken && (
                        <ConnectionStatus
                            connectionState={signalingConnectionState}
                        />
                    )}

                    {!accessToken && (
                        <NavLink
                            to="/login"
                            className={({ isActive }) =>
                                `border-2 rounded-lg px-2 md:px-8 py-2 shadow-md border-springred text-white hover:text-springred bg-springred hover:bg-inherit ${
                                    isActive ? 'hidden' : ''
                                }`.trim()
                            }
                        >
                            <LoginLink />
                        </NavLink>
                    )}

                    <div className="relative flex flex-col space-y-2 justify-items-end">
                        {idToken && (
                            <DropDownButton
                                {...{
                                    isShowDropdown,
                                    hideDropdown,
                                    showDropdown,
                                }}
                                username={username}
                            />
                        )}
                        {isShowDropdown && idToken && (
                            <NavigationDropdown
                                {...{
                                    name,
                                    username,
                                    logOutHandler,
                                }}
                                showSettings={() => {
                                    hideDropdown();
                                    showSettingsModal();
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default MainNavigation;
