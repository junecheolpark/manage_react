import React, { useContext, useEffect } from "react";
import { LeftEventContext } from "component/layout/HeadLeftLayout";

const Schedule_01 = () => {
    // left 버튼 등록 이벤트
    const { setOnRegister } = useContext(LeftEventContext);

    useEffect(() => {
        setOnRegister(() => handleRegister);
        return () => setOnRegister(null);
    }, [setOnRegister]);

    const handleRegister = () => {
        alert("Schedule 등록 로직 실행!");
    };
    //*********************************************************** */
    return (
        <>

        </>
    )
}

export default Schedule_01;