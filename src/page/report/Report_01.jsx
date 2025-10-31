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
    const [week, setWeek] = useState();
    const [weekArr, setWeekArr] = useState([]);

    // 예: 2025년부터 올해까지 역순 리스트 만들기
    const years = [];
    for (let i = currentYear + 1; i >= 2025; i--) {
        years.push(i);
    }

    const yearChange = (e) => {
        const newYear = Number(e.target.value);
        setYear(newYear);
        const newWeeks = getWeeksOfMonth(newYear, month);
        setWeekArr(newWeeks);
        setWeek(newWeeks[0].week);
    };

    const monThChange = (e) => {
        const newMonth = e.target.value;
        setMonth(newMonth);
        const newWeeks = getWeeksOfMonth(year, newMonth);
        setWeekArr(newWeeks);
        setWeek(newWeeks[0].week);
    };

    const weekChange = (e) => {
        setWeek(Number(e.target.value));
    };

    // 해당 주의 시작일(월요일)과 종료일(금요일), 몇 번째 주인지 반환
    const fewWeeks = (current) => {
        const monday = new Date(current); // 월요일
        const friday = new Date(current); // 금요일
        friday.setDate(monday.getDate() + 4);

        const startYearDay = new Date(`1/1/${monday.getFullYear()}`); // 해당 연도의 1월 1일

        const diffDay = (monday - startYearDay) / 86400000; // 일수 차이 계산 (1일 = 1000 * 60 * 60 * 24 = 86400000)
        let weekDay = parseInt(diffDay / 7) + 1; // 몇 번째 주인지 계산
        if (monday.getDay() < startYearDay.getDay()) weekDay += 1; // 연초(1월 1일)가 월요일이 아닐 때 주 계산

        return { week: weekDay, start: monday.toISOString().slice(0, 10).split('-'), end: friday.toISOString().slice(0, 10).split('-') };
    }

    // 해당 연도, 월의 주차 배열 반환
    const getWeeksOfMonth = (year, month) => {
        const weekArr = [];
        const start = new Date(year, month - 1, 1); // 해당 월의 첫 날
        const end = new Date(year, month, 0); // 해당 월의 마지막 날
        let current = new Date(start); // 현재 날짜를 첫 날로 초기화

        current.setDate(current.getDate() - ((current.getDay() + 6) % 7)); // 해당 달의 첫째 날을 포함한 주의 월요일
        while (current <= end) {
            const result = fewWeeks(current);
            weekArr.push({
                week: result.week,
                start: result.start,
                end: result.end,
                // label: `${result.start.getFullYear()}년 ${String(result.start.getMonth() + 1).padStart(2, "0")}월 ${String(result.start.getDate()).padStart(2, "0")}일 ~ ${result.end.getFullYear()}년 ${String(result.end.getMonth() + 1).padStart(2, "0")}월 ${String(result.end.getDate()).padStart(2, "0")}일`,
                label: `${result.start[0]}년 ${result.start[1]}월 ${result.start[2]}일 ~ ${result.end[0]}년 ${result.end[1]}월 ${result.end[2]}일`,
            });

            current.setDate(current.getDate() + 7); // 다음 주로 이동
        }

        return weekArr;
    }

    // 주 변경 (전주 / 다음주 버튼)
    const updateWeek = (weekTp) => {
        const weekNum = week + weekTp;
        // 존재하는 주차인지 확인
        if (weekArr.some(imtem => imtem.week === (weekNum))) {
            setWeek(weekNum);

        }else{ // 존재하지않으면 년/월 세팅
            // 이전 주 버튼 클릭 시
            if (weekTp === -1) {
                const check = weekArr[0].start[1] === '12';
                const prevMonth = check ? '12' : String(Number(month) - 1).padStart(2, "0");
                const prevYear = check ? year - 1 : year;
                const newWeeks = getWeeksOfMonth(prevYear, prevMonth);
                const checkWeekNum = check ? newWeeks[newWeeks.length - 1].week : weekNum;
                setWeekArr(newWeeks);
                setYear(prevYear);
                setMonth(prevMonth);
                setWeek(checkWeekNum);
            } else {
                // 다음 주 버튼 클릭 시
                const check = weekArr[weekArr.length - 1].end[1] === '01';
                const nextMonth = check ? '01' : String(Number(month) + 1).padStart(2, "0");
                const nextYear = check ? year + 1 : year;
                const newWeeks = getWeeksOfMonth(nextYear, nextMonth);
                const checkWeekNum = check ? newWeeks[0].week : weekNum;
                setWeekArr(newWeeks);
                setYear(nextYear);
                setMonth(nextMonth);
                setWeek(checkWeekNum);
            }
        }
    };

    useEffect(() => {
        const newWeeks = getWeeksOfMonth(year, month);
        setWeekArr(newWeeks);

        // 첫 로딩 시 현재 주로 설정 또는 month, year 변경 시 첫 주로 설정
        if (!week) {
            const toMonday = new Date(new Date().setDate(new Date().getDate() - ((new Date().getDay() + 6) % 7)));
            const thisWeek = fewWeeks(toMonday);
            setWeek(thisWeek.week);

        }
    }, []);

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
                    <a className={style.btnWeekPre} id="btnWeekPre" href="#" onClick={() => updateWeek(-1)}>
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
                    <select id="selWeek" style={{ width: "290px" }} value={week} onChange={weekChange}>
                        {weekArr.map((w, idx) => (
                            <option key={idx} value={w.week}>
                                {w.label}
                            </option>
                        ))}
                    </select>
                    &nbsp;
                    <a className={style.btnWeekNext} id="btnWeekNext" href="#" onClick={() => updateWeek(1)}>
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