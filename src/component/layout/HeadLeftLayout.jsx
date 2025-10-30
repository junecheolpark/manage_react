import { Outlet } from "react-router-dom";
import Header from 'component/Header';
import Lefter from 'component/Lefter';
function HeadLeftLayout() {

    return (
        <>
            <Header />
            <section className="contentsBox">
                <Lefter />
                <Outlet />
            </section>
        </>
    )
}
export default HeadLeftLayout;