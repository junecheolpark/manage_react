import React, { useState, useEffect } from "react";
// import  './css/main.css'
import style from './css/main.module.css'

function Main() {
    useEffect(() => {
        document.addEventListener("click", (e) => {
            const el = e.target.closest("a");
            if (el && el.getAttribute("href") === "#") e.preventDefault();
        });
    }, []);

    /* 메모 관련 */
    const [memos, setMemos] = useState([]);

    const handleAdd = (e) => {
        e.preventDefault();
        if (memos.length >= 5) {
            alert("5개까지 추가 가능합니다.");
            return;
        }
        setMemos([...memos, { id: Date.now(), text: "" }]);
    };

    const handleDelete = (id) => {
        setMemos(memos.filter((m) => m.id !== id));
    };

    const handleChange = (id, value) => {
        setMemos(memos.map((m) => (m.id === id ? { ...m, text: value } : m)));
    };

    const handleSave = (id) => {
        const memo = memos.find((m) => m.id === id);
        alert(`저장된 메모 내용:\n${memo.text}`);
        // 실제 저장 로직(API 호출 등)은 여기서 처리
    };

/* 메모 관련 **/

    return (
        <section className={style.board}>
            <section className={style.mainBoard}>
                {/* 근태관리 */}
                <div className={style.tA}>
                    <div className={style.mTitle}>
                        <span className="ftSize20 ftBold">근태관리</span>&nbsp;&nbsp;&nbsp;
                        <a href="/mypage/01" className={style.moreBtn}>more +</a>
                    </div>
                    <div className={style.contBox}>
                        <p id="today" className="mgB20 ftSize18 ftMedium">
                            <span className="ftSize20 ftMedium"></span>
                            <span className="ftSize20 ftMedium"></span>
                            <span className="ftSize20 ftMedium"></span>
                            <span className="ftSize20 ftMedium"></span>
                        </p>
                        <p className="mgTB10">출근시간 <span id="goWork" className="floatR colGray2">-</span></p>
                        <p>퇴근시간 <span id="backWork" className="floatR colGray2">-</span></p>
                        <p className="mgTB10">남은연차 <span id="yearLeave" className="floatR colGray2">0</span></p>
                        <div className={style.txtC}>
                            <p className={style.fick}>
                                <a href="#reg" className="btn btn100 btnBlue" onClick={() => { }}>출/퇴근 등록</a>
                            </p>
                        </div>
                    </div>
                </div>
                {/* 주간일정 */}
                <div className={style.weekly}>
                    <div className={style.mTitle}>
                        <span className="ftSize20 ftBold">주간일정</span>&nbsp;&nbsp;
                        <a href="/schedule/01" className={style.moreBtn}>more +</a>
                    </div>
                    <div id="contentswrap1" className={`contentswrap shadowBox ${style.contBox}`}>
                        <div className={style.indexSchedule} >
                            <table>
                                <colgroup>
                                    <col width="10%" />
                                    <col width="10%" />
                                    <col width="10%" />
                                    <col width="10%" />
                                    <col width="10%" />
                                    <col width="10%" />
                                    <col width="10%" />
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th className="colRed sunday">일요일</th>
                                        <th className="monday">월요일</th>
                                        <th className="tuesday">화요일</th>
                                        <th className="wednesday">수요일</th>
                                        <th className="thursday">목요일</th>
                                        <th className="friday">금요일</th>
                                        <th className="colBlue2 saturday">토요일</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td id="sunday"></td>
                                        <td id="monday"></td>
                                        <td id="tuesday"></td>
                                        <td id="wednesday"></td>
                                        <td id="thursday"></td>
                                        <td id="friday"></td>
                                        <td id="saturday"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* 게시판 */}
                <div className={style.bulletin}>
                    <div className={style.mTitle}>
                        <span className="ftSize20 ftBold">게시판</span>
                        <a href="/clipboard/01" className={style.moreBtn}>more +</a>
                    </div>
                    <div className={style.contBox}>
                        <div className={style.noticeTop}>
                            <a href="#">
                                &nbsp;&nbsp;<img src="/images/icon/notice_icon.png" alt="Notice" />
                                <span className="ftBold ftSize16" id="noticeTxt">-</span>
                            </a>
                        </div>
                        <div className={style.tabMenuList}>
                            <ul>
                                <li data-mbidx="0" className={style.choicebulletin}><a href="#all">전체</a></li>
                                <li data-mbidx="10"><a href="/WEB-INF/views/clipboard/clipboard_01.html">공지사항</a></li>
                                <li data-mbidx="11"><a href="/WEB-INF/views/clipboard/clipboard_02.html">자료실</a></li>
                                <li data-mbidx="12"><a href="/WEB-INF/views/clipboard/clipboard_03.html">업무공유</a></li>
                            </ul>
                        </div>
                        <div className={style.tabMenuCont}>
                            <ul>
                                <li>
                                    <a href="#">전체</a>
                                    <ul id="boardList">
                                        <li style={{ textAlign: "center" }}>
                                            <span className="noData">검색된 게시글이 없습니다.</span>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
            {/* myPlace */}
            <section className={style.myPlace}>
                <p className="ftSize20 ftBold mP">
                    My Place&nbsp;&nbsp;
                    <a href="#memo" onClick={handleAdd}>
                        <img src="/images/icon/ic_memo.png" alt="추가" />추가
                    </a>
                </p>
                <div className="mDiv" id="memoBox">
                    {memos.map((memo) => (
                        <div key={memo.id} className={style.memo}>
                            <div className={style.placeTitle}>
                                <div className="floatR" data-uidx="0" data-rdate="">
                                    <button
                                        className="btn btnS btnWhite memoSave"
                                        onClick={() => handleSave(memo.id)}
                                    >
                                        저장
                                    </button>
                                    &nbsp;
                                    <button
                                        className="btn btnS btnBlueLine memoDel"
                                        onClick={() => handleDelete(memo.id)}
                                    >
                                        삭제
                                    </button>
                                </div>
                                <textarea
                                    rows="5"
                                    cols="5"
                                    className="txtMemo"
                                    value={memo.text}
                                    onChange={(e) => handleChange(memo.id, e.target.value)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </section>
    )
}

export default Main;