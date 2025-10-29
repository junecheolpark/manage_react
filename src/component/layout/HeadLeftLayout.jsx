import { Outlet } from "react-router-dom";
import Header from 'component/Header';
import Lefter from 'component/Lefter';
function HeadLeftLayout() {

    return (
        <>
            <Header />
            <Lefter />
            <Outlet />
        </>
    )
}
export default HeadLeftLayout;