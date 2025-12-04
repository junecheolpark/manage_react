import { createContext, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from 'component/Header';
import Lefter from 'component/Lefter';

export const LeftEventContext = createContext();

function HeadLeftLayout() {
    const [onRegister, setOnRegister] = useState(null);
    const [registerLabel, setRegisterLabel] = useState("등록"); // ← 텍스트 추가

    return (
        <LeftEventContext.Provider value={{ onRegister, setOnRegister, registerLabel, setRegisterLabel }}>
            <Header />
            <section className="contentsBox">
                <Lefter />
                <Outlet />
            </section>
        </LeftEventContext.Provider>
    )
}
export default HeadLeftLayout;