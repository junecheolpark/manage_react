import { Link, useLocation } from "react-router-dom";

function Lefter() {
    const location = useLocation();
    const path = location.pathname; // ex) /report/01
    const section = path.split("/")[1]; // ex) report

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

    const arrMenu = leftMenus[section] || [];
    console.log(path)
    // 현재 메뉴 찾기
    const currentMenu = arrMenu.find((item) => item.url === path);

    
    return (
        <section className="leftMenu">
            <section className="lmTop">
                <p id="pageNavi" className="ftSize20 ftBold mgB10">
                    &nbsp;&nbsp;
                    {currentMenu && (
                        <>
                            {currentMenu.navi}
                            &nbsp;&nbsp;
                            <span className="ftNormal colGray2">{currentMenu.name}</span>
                        </>
                    )}
                </p>

                <div id="leftTop">
                    {/* 업무보고,일정관리,연차관리 */}
                    <div id="leftTopRpt01" className="leftTopConts">
                        <div className="ucTable">
                            <a href="#reg" className="btn btn100 btnBlue">
                                등록
                            </a>
                        </div>
                    </div>
                </div>
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