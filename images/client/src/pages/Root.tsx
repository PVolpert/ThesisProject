import { Outlet } from 'react-router-dom';
import MainNavigation from '../components/MainNavigation';
import Modals from '../components/ModalsDisplay';

export default function RootLayout() {
    //? Maybe include a Demo-Sidebar
    return (
        <>
            <Modals />
            <MainNavigation />
            <Outlet />
        </>
    );
}
