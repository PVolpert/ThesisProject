import { Outlet } from 'react-router-dom';
import MainNavigation from '../components/MainNavigation';
import Modals from '../components/ModalsDisplay';
import { useStore } from '../store/Store';
import Signaling from '../components/Signaling';

export default function RootLayout() {
    //? Maybe include a Demo-Sidebar
    const accessToken = useStore((state) => state.accessToken);
    return (
        <>
            {accessToken && <Signaling />}
            <Modals />
            <MainNavigation />
            <Outlet />
        </>
    );
}
