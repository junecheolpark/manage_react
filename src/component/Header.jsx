function Header() {
    const movePage = useNavigate();
    import { useNavigate} from "react-router-dom";

    return (
        <>
            <section className="loading-layer">
                <div className="loadingBg"></div>
                <div className="loadingImg">
                    <img src="/images/loading.svg" alt="로딩중..." />
                </div>
            </section>

            {/* 상단 메뉴 */}
            <section className="topMenu">
                <div className="logo">
                    <h1>
                        <a href="/index">
                            <img src="/images/index/logo.png" alt="junecheol" />
                        </a>
                    </h1>
                </div>

                <div className="menuList">
                    <ul id="menuTop">
                        <li>
                            <a href="#menu" className="menuToggle" id="btnMenu">
                                <img src="/images/btn/btn_menu_open.png" alt="menuBtn" />
                            </a>
                        </li>
                        <li><a href="/report/01">업무보고</a></li>
                        <li><a href="/schedule/01">일정관리</a></li>
                        <li><a href="/user/01">사용자관리</a></li>
                        <li><a href="/clipboard/01">게시판</a></li>
                        <li><a href="/system/01">시스템관리</a></li>
                    </ul>

                    <div id="menuAll">
                        <ul>
                            <li>
                                <a href="/report/01">주간업무</a>
                                <ul>
                                    <li><a href="/report/01">주간업무</a></li>
                                </ul>
                            </li>
                            <li>
                                <a href="/schedule/01">일정 관리</a>
                                <ul>
                                    <li><a href="/schedule/01">사내일정</a></li>
                                </ul>
                            </li>
                            <li>
                                <a href="/user/01">사용자 관리</a>
                                <ul>
                                    <li><a href="/user/01">사용자 관리</a></li>
                                </ul>
                            </li>
                            <li>
                                <a href="/clipboard/01">게시판</a>
                                <ul>
                                    <li><a href="/clipboard/01">공지사항</a></li>
                                    <li><a href="/clipboard/02">자료실</a></li>
                                    <li><a href="/clipboard/03">업무공유</a></li>
                                </ul>
                            </li>
                            <li>
                                <a href="/system/01">시스템 관리</a>
                                <ul>
                                    <li><a href="/system/01">코드 관리</a></li>
                                    <li><a href="/system/02">연차관리</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="userInfo">
                    <div className="user">
                        <a href="#user">
                            <img
                                src="/images/profile/s_profile_01.png"
                                id="userCharacterS"
                                alt="userImg"
                                onError={(e) =>
                                (e.currentTarget.src =
                                    '/images/profile/s_profile_01.png')
                                }
                            />
                            <span>
                                <span id="logNM" className="colWhite">&nbsp;</span>
                                <br />
                                <span id="logDept" className="colGray3 ftSize12">&nbsp;</span>
                            </span>
                        </a>
                    </div>
                </div>

                <div id="popUserInfo" className="shadowBox">
                    <a href="#popclose" className="btn-layerClose">
                        <img
                            src="/images/btn/btn_popclose.png"
                            alt="닫기"
                        />
                    </a>

                    <div className="popInfoTop">
                        <img
                            src="/images/common/no_Image.jpg"
                            alt="유저"
                            id="userCharacter"
                            onError={(e) =>
                            (e.currentTarget.src =
                                '/images/common/no_Image.jpg')
                            }
                        />
                        <p id="userName">
                            <span id="popLogNm" className="ftBold ftSize18 mgB5"></span>
                            <span id="popLogDept" className="colGray2"></span>
                        </p>
                    </div>

                    <div className="popInfoCont">
                        <div id="popMyInfo">
                            <ul>
                                <li>
                                    <a href="/login/logout" className="colRed">
                                        <img src="/images/icon/ic_logout.png" alt="로그아웃" />
                                        &nbsp;로그아웃
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )

}