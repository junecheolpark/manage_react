import { Outlet } from "react-router-dom";
import Header from 'component/Header';
function HeaderLayout() {

    return (
        <>
            <Header />
            <Outlet />
        </>
    )
}
export default HeaderLayout;