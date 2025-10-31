import React, { useContext, useEffect, useState } from "react";
import { LeftEventContext } from "component/layout/HeadLeftLayout";
import { fnLayerPopupView } from 'common/js/function';

// import './css/report_01.css'
import style from './css/report_01.module.css'

const Report_01 = () => {
    // left 버튼 등록 이벤트
    const { setOnRegister } = useContext(LeftEventContext);

    useEffect(() => {
        setOnRegister(() => handleRegister);
        return () => setOnRegister(null);
    }, [setOnRegister]);

    const handleRegister = () => {
        alert("Report01 등록 로직 실행!");
        fnLayerPopupView('WeekLayerPopUp', true);
    };
    //*********************************************************** */

    const today = new Date();
    const currentYear = today.getFullYear();
    const defaultMonth = String(today.getMonth() + 1).padStart(2, "0"); // '01'~'12'

    const [year, setYear] = useState(currentYear);
    const [month, setMonth] = useState(defaultMonth);
    const [weeks, setWeeks] = useState([]);

    // 예: 2025년부터 올해까지 역순 리스트 만들기
    const years = [];
    for (let i = currentYear + 1; i >= 2025; i--) {
        years.push(i);
    }

    const yearChange = (e) => {
        setYear(Number(e.target.value));
    };

    const monThChange = (e) => {
        setMonth(e.target.value);
    };

    const getWeeksOfMonth = (year, month) => {
        const weeks = [];
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0);

        let current = new Date(start);
        // 첫 번째 주의 월요일로 이동
        current.setDate(current.getDate() - ((current.getDay() + 6) % 7));

        while (current <= end) {
            const monday = new Date(current);
            const friday = new Date(current);
            friday.setDate(monday.getDate() + 4);

            const startYearDay = new Date(`1/1/${monday.getFullYear()}`);
            const today = new Date(`${monday.getMonth() + 1}/${monday.getDate()}/${monday.getFullYear()}`);
            const diffDay = (today - startYearDay) / 86400000;
            let weekDay = parseInt(diffDay / 7) + 1;
            if (today.getDay() < startYearDay.getDay()) weekDay += 1; // 1월1일부터 지난 후 계산
            weeks.push({
                week: weekDay,
                start: monday,
                end: friday,
                label: `${monday.getFullYear()}년 ${String(monday.getMonth() + 1).padStart(2, "0")}월 ${String(monday.getDate()).padStart(2, "0")}일 ~ ${friday.getFullYear()}년 ${String(friday.getMonth() + 1).padStart(2, "0")}월 ${String(friday.getDate()).padStart(2, "0")}일`,
            });

            current.setDate(current.getDate() + 7); // 다음 주로 이동
        }

        return weeks;
    }

    useEffect(() => {
        const newWeeks = getWeeksOfMonth(year, month);
        setWeeks(newWeeks);
    }, [year, month]);

    // 주 변경 (전주 / 다음주 버튼)
    const updateWeek = (direction) => {
    };





    return (
        <section className="contens">
            {/* 팝업 */}
            <section id="WeekLayerPopUp" className="dim-layer">
                <section className="dimBg"></section>
                <section className="autoSizeLayerBg">
                    <div className="autoSizeLayer" style={{ width: "1200px" }}>
                        <div className="autoSizeLayerT">
                            <div className="autoSizeLayerCls">
                                <a href="#popclose" className="btn-layerClose">
                                    <img
                                        src="/images/btn/btn_popclose.png"
                                        alt="닫기"
                                    />
                                </a>
                            </div>
                            <div className="autoSizeLayerTInner">
                                <h4>주간 업무 보고</h4>
                            </div>
                        </div>

                        <div className="autoSizeLayerCont">
                            <div className="autoSizeLayerContBody">
                                <div className={style.tableTitle} id="tableTitle">
                                    <p style={{ paddingBottom: "5px" }}></p>
                                </div>

                                <table className={`tableView ${style.weekInput}`} id="weekInput">
                                    <colgroup>
                                        <col style={{ width: "20%" }} />
                                        <col style={{ width: "40%" }} />
                                        <col style={{ width: "40%" }} />
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th>항 목</th>
                                            <th>전주 추진사항</th>
                                            <th colSpan="2">금주 추진사항</th>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                </table>
                            </div>

                            <div className="autoSizeLayerF">
                                <a id="btnSave" className="btn btnBlue" href="#">
                                    등록
                                </a>
                                <a id="btnDelete" className="btn btnRed" href="#" style={{ display: "none" }}
                                >
                                    삭제
                                </a>
                                <a href="#popclose" className="btn btnWhite btn-layerClose" onClick={() => fnLayerPopupView('WeekLayerPopUp', false)}>
                                    닫기
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </section>

            {/* 검색 박스 */}
            <section className={`schBox ${style.reSchBox}`}>
                <section className="txtC">
                    <a className={style.btnWeekPre} id="btnWeekPre" href="#" onClick={() => updateWeek("prev")}>
                        <img
                            src="/images/btn/btn_bleft.png"
                            alt="이전"
                        />
                    </a>
                    &nbsp;
                    <select id="selYear" style={{ width: "100px" }} value={year} onChange={yearChange}>
                        {years.map((y) => (
                            <option key={y} value={y}>
                                {y}년
                            </option>
                        ))}
                    </select>
                    &nbsp;
                    <select id="selMonth" style={{ width: "100px" }} value={month} onChange={monThChange}>
                        <option value="01">01월</option>
                        <option value="02">02월</option>
                        <option value="03">03월</option>
                        <option value="04">04월</option>
                        <option value="05">05월</option>
                        <option value="06">06월</option>
                        <option value="07">07월</option>
                        <option value="08">08월</option>
                        <option value="09">09월</option>
                        <option value="10">10월</option>
                        <option value="11">11월</option>
                        <option value="12">12월</option>
                    </select>
                    &nbsp;
                    <select id="selWeek" style={{ width: "290px" }}>
                        {weeks.map((w, idx) => (
                            <option key={idx} value={w.week}>
                                {w.label}
                            </option>
                        ))}
                    </select>
                    &nbsp;
                    <a className={style.btnWeekNext} id="btnWeekNext" href="#" onClick={() => updateWeek("next")}>
                        <img
                            src="/images/btn/btn_nright.png"
                            alt="다음"
                        />
                    </a>
                </section>
            </section>

            {/* 주간 리스트 */}
            <section className="contsF shadowBox">
                <section className="tableBody">
                    <table className="tableView" id="weekList">
                        <colgroup>
                            <col style={{ width: "12%" }} />
                            <col style={{ width: "7%" }} />
                            <col style={{ width: "40%" }} />
                            <col style={{ width: "40%" }} />
                        </colgroup>
                        <thead>
                            <tr>
                                <th>항&nbsp;&nbsp;목</th>
                                <th>작업자</th>
                                <th>전주 추진사항</th>
                                <th>금주 추진사항</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan="4" className="none">
                                    등록된 내용이 없습니다.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </section>
            </section>
        </section>
    )
}

export default Report_01;