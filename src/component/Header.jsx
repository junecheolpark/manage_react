import { Link, useNavigate } from "react-router-dom";
// import 'common/css/jquery-ui.css';
import 'common/css/layout.css';
import 'common/css/sub.css';

import { useState } from "react";

function Header() {
    // const movePage = useNavigate();

    // 메뉴 열기/닫기
    const [menuOpen, setMenuOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);

    const menuToggle = () => {
        setMenuOpen(prev => !prev);
    };

    const loginToggle = () => {
        setLoginOpen(prev => !prev);
    };

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
                        <Link to="/">
                            <img src="/images/index/logo.png" alt="junecheol" />
                        </Link>
                    </h1>
                </div>

                <div className="menuList">
                    <ul id="menuTop">
                        <li>
                            <a href="#menu" className="menuToggle" id="btnMenu" onClick={menuToggle}>
                                <img src={menuOpen
                                    ? "/images/btn/btn_menu_close.png"
                                    : "/images/btn/btn_menu_open.png"} alt="menuBtn" />
                            </a>
                        </li>
                        <li><Link to="/report/01">업무보고</Link></li>
                        <li><Link to="/schedule/01">일정관리</Link></li>
                        <li><Link to="/user/01">사용자관리</Link></li>
                        <li><Link to="/board/01">게시판</Link></li>
                        <li><Link to="/system/01">시스템관리</Link></li>
                    </ul>
                    {menuOpen && (
                        <div id="menuAll" >
                            <ul>
                                <li>
                                    <Link to="/report/01">주간업무</Link>
                                    <ul>
                                        <li><Link to="/report/01">주간업무</Link></li>
                                    </ul>
                                </li>
                                <li>
                                    <Link to="/schedule/01">일정 관리</Link>
                                    <ul>
                                        <li><Link to="/schedule/01">사내일정</Link></li>
                                    </ul>
                                </li>
                                <li>
                                    <Link to="/user/01">사용자 관리</Link>
                                    <ul>
                                        <li><Link to="/user/01">사용자 관리</Link></li>
                                    </ul>
                                </li>
                                <li>
                                    <Link to="/board/01">게시판</Link>
                                    <ul>
                                        <li><Link to="/board/01">공지사항</Link></li>
                                        <li><Link to="/board/02">자료실</Link></li>
                                        <li><Link to="/board/03">업무공유</Link></li>
                                    </ul>
                                </li>
                                <li>
                                    <Link to="/system/01">시스템 관리</Link>
                                    <ul>
                                        <li><Link to="/system/01">코드 관리</Link></li>
                                        <li><Link to="/system/02">연차관리</Link></li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>

                <div className="userInfo">
                    <div className="user">
                        <a href="#user" onClick={loginToggle}>
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
                {loginOpen && (
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
                )}
            </section>
        </>
    )

}
export default Header;