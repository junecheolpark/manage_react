import { Link, useLocation } from "react-router-dom";
import React, { useContext } from "react";
import { LeftEventContext } from "component/layout/HeadLeftLayout";

function Lefter() {
    // "/report/01", "/schedule/01", "/system/02" 버튼 클릭시 이벤트 실행
    const { onRegister } = useContext(LeftEventContext);

    const handleClick = (e) => {
        e.preventDefault();
        if (onRegister) onRegister(); // 현재 페이지가 지정한 함수 실행
        else alert("등록 기능이 없는 페이지입니다.");
    };
    //*********************************************************** */

    const location = useLocation();
    const path = location.pathname; // 현재 페이지 경로 추출
    const section = path.split("/")[1]; // ["", "report", "01"] ->  report 만가져옴

    const leftMenus = {
        report: [{ navi: "주간업무", name: "주간업무", url: "/report/01" }],
        schedule: [{ navi: "일정 관리", name: "사내일정", url: "/schedule/01" }],
        user: [{ navi: "사용자 관리", name: "사용자 관리", url: "/user/01" }],
        board: [
            { navi: "게시판", name: "공지사항", url: "/board/01" },
            { navi: "게시판", name: "자료실", url: "/board/02" },
            { navi: "게시판", name: "업무공유", url: "/board/03" },
        ],
        system: [
            { navi: "시스템 관리", name: "코드 관리", url: "/system/01" },
            { navi: "시스템 관리", name: "연차 관리", url: "/system/02" },
        ],
    };

    const arrMenu = leftMenus[section] || []; // 없을 경우  오류 대신 []반환
    // 현재 메뉴 찾기
    const currentMenu = arrMenu.find((item) => item.url === path);


    // 등록 버튼을 보여줄 섹션 정의
    const showRegisterSections = ["/report/01", "/schedule/01", "/system/02"];
    const showRegister = showRegisterSections.includes(path);

    return (
        <section className="leftMenu">
            <section className="lmTop">
                <p id="pageNavi" className="ftSize20 ftBold mgB10">
                    {currentMenu && (
                        <>
                            {currentMenu.navi}
                            &nbsp;&nbsp;
                            <span className="ftNormal colGray2">{currentMenu.name}</span>
                        </>
                    )}
                </p>
                {showRegister && (
                    <div id="leftTop">
                        {/* 업무보고,일정관리,연차관리 */}
                        <div id="leftTopRpt01" className="leftTopConts" onClick={handleClick}>
                            <div className="ucTable">
                                <a href="#reg" className="btn btn100 btnBlue">
                                    등록
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            <section className="lmMenu">
                <h3>
                    <img
                        src="/images/sub/leftMenu_icon_03.png"
                        alt="대메뉴"
                    />
                    &nbsp;&nbsp;
                    <span id="leftMenuTop">{arrMenu.length > 0 ? arrMenu[0].navi : ""}</span>
                </h3>
                <ul id="leftMenuList">
                    {arrMenu.map((menu) => (
                        <li
                            key={menu.url}
                            className={menu.url === path ? "lmChoice" : ""}
                        >
                            <Link to={menu.url}>{menu.name}</Link>
                        </li>
                    ))}

                    {arrMenu.length === 0 && (
                        <li>
                            <a href="#link">&nbsp;</a>
                        </li>
                    )}
                </ul>
            </section>

            <footer></footer>
        </section>
    )

}
export default Lefter;