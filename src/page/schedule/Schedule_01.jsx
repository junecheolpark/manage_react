import React, { useContext, useEffect, useState } from "react";
import { LeftEventContext } from "component/layout/HeadLeftLayout";
import { fnLayerPopupView } from "common/js/function";

import './css/schedule_01.css'

const Schedule_01 = () => {
    // left 버튼 등록 이벤트
    const { setOnRegister } = useContext(LeftEventContext);

    const [year, setYear] = useState("2025");
    const [month, setMonth] = useState("01");

    useEffect(() => {
        setOnRegister(() => handleRegister);
        return () => setOnRegister(null);
    }, [setOnRegister]);

    const handleRegister = () => {
        fnLayerPopupView("scheduleInputView", true);
    };

    const handleUserSelectPopup = () => {
        fnLayerPopupView("CheckList", true);
    };

    const handleSave = () => {
        alert("일정 저장 로직 실행!");
    };
    //*********************************************************** */
    return (
        <section className="contens">
            {/* 상단 검색 및 이동 */}
            <section className="schBox txtC">
                <section>
                    <a id="btnPrev" href="#">
                        <img src="/images/btn/btn_bleft.png" alt="이전" />
                    </a>
                    &nbsp;
                    <select
                        id="selSchYear"
                        style={{ width: "100px" }}
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                    >
                        <option value="2024">2024년</option>
                        <option value="2025">2025년</option>
                    </select>
                    &nbsp;
                    <select
                        id="selSchMonth"
                        style={{ width: "100px" }}
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                    >
                        {Array.from({ length: 12 }, (_, i) => {
                            const val = String(i + 1).padStart(2, "0");
                            return (
                                <option key={val} value={val}>
                                    {val}월
                                </option>
                            );
                        })}
                    </select>
                    &nbsp;
                    <a id="btnNext" href="#">
                        <img src="/images/btn/btn_nright.png" alt="다음" />
                    </a>
                    <input
                        type="button"
                        id="btnToday"
                        value="오늘"
                        className="btn btnBlue"
                    />
                </section>
            </section>

            <section className="contsF shadowBox">
                <section id="calendar">{/* 캘린더 내용 위치 */}</section>

                {/* 일정 등록 팝업 */}
                <section
                    id="scheduleInputView"
                    className="dim-layer"
                    
                >
                    <section className="dimBg"></section>
                    <section className="autoSizeLayerBg" style={{ overflowY: "auto" }}>
                        <div
                            className="autoSizeLayer ui-draggable"
                            style={{
                                width: "500px",
                                margin: "147.5px auto",
                                position: "relative",
                            }}
                        >
                            <div className="autoSizeLayerT">
                                <div className="autoSizeLayerCls">
                                    <a href="#" onClick={() => fnLayerPopupView('scheduleInputView', false)}>
                                        <img
                                            src="/images/btn/btn_popclose.png"
                                            alt="닫기"
                                        />
                                    </a>
                                </div>
                                <div className="autoSizeLayerTInner">
                                    <h4 className="txtC">등록</h4>
                                </div>
                            </div>

                            <div className="autoSizeLayerCont">
                                <div className="autoSizeLayerContBody">
                                    <table className="tableView">
                                        <tbody>
                                            <tr>
                                                <th>
                                                    <span className="colRed">*</span> 일정구분
                                                </th>
                                                <td>
                                                    <select id="selSchdule">
                                                        <option>일반</option>
                                                        <option>휴가</option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>
                                                    <span className="colRed">*</span> 대상
                                                </th>
                                                <td>
                                                    <div id="targetList">
                                                        <p id="ToName">대상자 없음</p>
                                                        <p>
                                                            <a href="#" 
                                                                id="btnUser"
                                                                className="btn btnBlue"
                                                                onClick={handleUserSelectPopup}
                                                            >
                                                                선택
                                                            </a>
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>
                                                    <span className="colRed">*</span> 날짜
                                                </th>
                                                <td>
                                                    <input
                                                        type="text"
                                                        id="txtSDate"
                                                        className="cal"
                                                        style={{ width: "120px" }}
                                                    />{" "}
                                                    ~{" "}
                                                    <input
                                                        type="text"
                                                        id="txtEDate"
                                                        className="cal"
                                                        style={{ width: "120px" }}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>
                                                    <span className="colRed">*</span> 내역
                                                </th>
                                                <td>
                                                    <textarea
                                                        id="txtConts"
                                                        rows="2"
                                                        style={{ height: "70px" }}
                                                    ></textarea>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>시간</th>
                                                <td>
                                                    <select id="selectTimeType" style={{ width: "100px" }}>
                                                        <option value="1">종일</option>
                                                        <option value="2">오전</option>
                                                        <option value="3">오후</option>
                                                    </select>
                                                    <select id="txtSTime" style={{ width: "100px" }}>
                                                        <option>09:00</option>
                                                        <option>10:00</option>
                                                        <option>11:00</option>
                                                        <option>12:00</option>
                                                        <option>13:00</option>
                                                        <option>14:00</option>
                                                        <option>15:00</option>
                                                        <option>16:00</option>
                                                        <option>17:00</option>
                                                    </select>{" "}
                                                    ~{" "}
                                                    <select id="txtETime" style={{ width: "100px" }}>
                                                        <option>10:00</option>
                                                        <option>11:00</option>
                                                        <option>12:00</option>
                                                        <option>13:00</option>
                                                        <option>14:00</option>
                                                        <option>15:00</option>
                                                        <option>16:00</option>
                                                        <option>17:00</option>
                                                        <option>18:00</option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr className="vacationShow">
                                                <th>승인상태</th>
                                                <td>
                                                    <span id="txtSchedule_TP">-</span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className="autoSizeLayerF">
                                    <a href="#" 
                                        id="btnSave"
                                        className="btn btnBlue"
                                        onClick={handleSave}
                                    >
                                        저장
                                    </a>
                                    <a href="#" 
                                        id="btnDelete"
                                        className="btn btnRed"
                                        style={{ display: "none" }}
                                    >
                                        삭제
                                    </a>
                                    <a href="#"  className="btn btnWhite" onClick={() => fnLayerPopupView('scheduleInputView', false)}>
                                        닫기
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>
                </section>

                {/* 대상자 선택 팝업 */}
                <section
                    id="CheckList"
                    className="dim-layer"
                >
                    <section className="dimBg"></section>
                    <section className="autoSizeLayerBg">
                        <div className="autoSizeLayer" style={{ width: "350px" }}>
                            <div className="autoSizeLayerT">
                                <div className="autoSizeLayerCls">
                                    <button onClick={() => fnLayerPopupView('CheckList', false)}>
                                        <img
                                            src="/images/btn/btn_popclose.png"
                                            alt="닫기"
                                        />
                                    </button>
                                </div>
                                <div className="autoSizeLayerTInner">
                                    <h4>대상자 선택</h4>
                                </div>
                            </div>

                            <div className="autoSizeLayerCont">
                                <div className="autoSizeLayerContBody">
                                    <table id="userList" className="tableList">
                                        <thead>
                                            <tr>
                                                <th>
                                                    <input type="checkbox" />
                                                </th>
                                                <th>직급</th>
                                                <th>성명</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td colSpan="3" className="noData">
                                                    조회된 사용자가 없습니다.
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="autoSizeLayerF">
                                    <button
                                        className="btn btnBlue"
                                        onClick={() => fnLayerPopupView('CheckList', false)}>
                                        확인
                                    </button>
                                    <button
                                        className="btn btnWhite"
                                        onClick={() => fnLayerPopupView('CheckList', false)}>
                                        닫기
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </section>
            </section>
        </section>
    )
}

export default Schedule_01;