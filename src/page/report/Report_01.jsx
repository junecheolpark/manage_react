import React, { useContext, useEffect, useState } from "react";
import { api } from "api/api";
import { useSelector } from "react-redux";
import { useLoading } from "context/LoadingContext";
import { LeftEventContext } from "component/layout/HeadLeftLayout";
import { fnLayerPopupView, fnSelYear, isEmpty, fnDeleteMsg } from 'common/js/function';

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import style from './css/report_01.module.css'

const Report_01 = () => {
    // ================================================================
    // SECTION 1. 초기 설정 및 주차 로직 설정
    // ================================================================
    const adminUser = useSelector(state => state.authUser);
    const { setIsLoading } = useLoading();

    //셀렉트 박스 셋팅
    const today = new Date();
    const currentYear = today.getFullYear();
    const defaultMonth = String(today.getMonth() + 1).padStart(2, "0"); // '01'~'12'

    const [year, setYear] = useState(currentYear);
    const [month, setMonth] = useState(defaultMonth);
    const [week, setWeek] = useState();
    const [weekArr, setWeekArr] = useState([]);

    // 예: 2025년부터 올해까지 역순 리스트 만들기
    const years = fnSelYear(2025, (currentYear - 2025 + 1), false, '년');

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

    //*********************주차 계산, 월/연차 관련**************************** */
    
    const weekChange = (e) => {
        setWeek(Number(e.target.value));
    };

    // 해당 주의 시작일(월요일)과 종료일(금요일), 몇 번째 주인지 반환
    const fewWeeks = (current) => {
        const monday = new Date(current); // 월요일
        const friday = new Date(current); // 금요일
        friday.setDate(monday.getDate() + 4);

        const startYearDay = new Date(monday.getFullYear(), 0, 1); // 0 = 1월
        const diffDay = (monday - startYearDay) / 86400000; // 일수 차이 계산 (1일 = 1000 * 60 * 60 * 24 = 86400000)
        let weekDay = parseInt(diffDay / 7) + 1; // 몇 번째 주인지 계산
        if (monday.getDay() < startYearDay.getDay()) weekDay += 1; // 연초(1월 1일)가 월요일이 아닐 때 주 계산

        return { week: weekDay, start: monday.toLocaleDateString('sv-SE').split('-'), end: friday.toLocaleDateString('sv-SE').split('-') };
    }

    // 해당 연도, 월의 주차 배열 반환
    const getWeeksOfMonth = (year, month) => {
        const weekArr = [];
        const start = new Date(year, month - 1, 1); // 해당 월의 첫 날
        const end = new Date(year, month, 0); // 해당 월의 마지막 날
        let current = new Date(start); // 현재 날짜를 첫 날로 초기화

        // 1일이 토요일,일요일이면 다음날(월요일)로 이동
        if (current.getDay() === 6 || current.getDay() === 0) current.setDate(current.getDate() + 1);
        else current.setDate(current.getDate() - ((current.getDay() + 6) % 7));

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
        if (weekArr.length === 0) return;
        const prevWeek = weekTp === -1 && month === '01' && week === weekArr[1].week; //  이전버튼 클릭시 month 1월2째주라면
        const nextWeek = weekTp === 1 && month === '01' && week === weekArr[0].week; //  다음버튼 클릭시 month 1월1째주라면
        const weekNum = prevWeek ? weekArr[0].week : nextWeek ? weekArr[1].week : week + weekTp; // 1월에 12월이 껴있을수 있기때문에 비교처리

        if (weekArr.some(item => item.week === (weekNum))) {  // 존재하는 주차인지 확인
            setWeek(weekNum);

        } else { // 존재하지않으면 년/월 세팅
            if (weekTp === -1) {  // 이전 주 버튼 클릭 시
                const check = weekArr[1].start[1] === '01'; // 이번달이 1월이라면
                const prevMonth = check ? '12' : String(Number(month) - 1).padStart(2, "0"); // 이전 달 
                const prevYear = check ? year - 1 : year; // 이전 연도
                if (2025 > prevYear) { alert("더이상 이전 연도로 이동할 수 없습니다."); return; }

                const newWeeks = getWeeksOfMonth(prevYear, prevMonth);
                const checkWeekNum = check ? newWeeks[newWeeks.length - 1].week : weekNum;
                setWeekArr(newWeeks);
                setYear(prevYear);
                setMonth(prevMonth);
                setWeek(checkWeekNum);
            } else { // 다음 주 버튼 클릭 시
                const check = weekArr[weekArr.length - 1].start[1] === '12'; // 이번달이 12월이라면
                const nextMonth = check ? '01' : String(Number(month) + 1).padStart(2, "0");
                const nextYear = check ? year + 1 : year;
                if (nextYear > currentYear + 1) { alert("더이상 다음 연도로 이동할 수 없습니다."); return; }

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

    // ================================================================
    // SECTION 2. 검색 / 페이징 / 목록 조회
    // ================================================================
    const [curPage, setCurPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalCnt, setTotalCnt] = useState(0);

    const [workList, setWorkList] = useState([]);
    const [workInputList, setWorkInputList] = useState([]);
    const [beforeWeek, setBeforeWeek] = useState("");
    const [nextWeek, setNextWeek] = useState("");
    
    const fnWorkWeekList = async () => {
        const wIdx = weekArr.findIndex(item => item.week === week);
        let preWeek = 0;
        let preYear = year; // 기본은 현재 연도

        if (wIdx === 0) {
            const check = month === '01'; // 이번달이 1월이라면
            const prevMonth = check ? '12' : String(Number(month) - 1).padStart(2, "0"); // 이전 달 
            preYear = check ? year - 1 : year; // 이전 연도

            const newWeeks = getWeeksOfMonth(preYear, prevMonth);
            preWeek = newWeeks[newWeeks.length - 1].week;
        } else {
            preWeek = weekArr[wIdx - 1].week;
        }

        const params = {
            preyyyy: Number(preYear),
            prewwork: Number(preWeek),
            yyyy: Number(year),
            wwork: Number(week),
            uidx: 0
        }
        try {
            setIsLoading(true);

            const [res, resInput] = await Promise.all([
                api.get("/weekWork/list", { params }),
                api.get("/weekWork/list", { params: { ...params, uidx: adminUser._c_logIdx } })
            ]);

            setWorkList(res.data || []);
            const input = resInput.data;

            const hasData = input.length > 0;
            setWorkInputList(hasData ? input[0] : []);
            setBeforeWeek(hasData ? input[0].prev_CONTS ?? "" : "");
            setNextWeek(hasData ? input[0].now_CONTS ?? "" : "");

            // UI 로직 left 버튼
            setRegisterLabel(hasData && !isEmpty(input[0].now_CONTS) ? "수정" : "등록");
        } catch (err) {
            console.error(err);
            alert("목록 불러오기 실패");
        } finally {
            setIsLoading(false);
        }

    };

    useEffect(() => {
        if (isEmpty(weekArr)) return; //값이 바인딩되기전에는 리턴
        fnWorkWeekList();
    }, [week]);

    // ================================================================
    // SECTION 3. 등록 / 수정 / 삭제
    // ================================================================

    // 등록/수정
    const fnWorkWeekInput = async () => {
        if (isEmpty(beforeWeek) && isEmpty(nextWeek)) {
            alert("내용을 입력해주세요.");
            return;
        }

        const dateRange = weekArr.find(w => w.week === week);
        if (!dateRange) return alert("유효하지 않은 주차입니다.");

        const [sdate, edate] = [dateRange.start.join("-"), dateRange.end.join("-")];
        const timestamp = new Date().toISOString().replace("T", " ").split(".")[0];

        try {
            setIsLoading(true);
            const params = {
                widx: workInputList?.week_WORK_CONTS_IDX ?? 0,
                yyyy: year,
                wwork: week,
                uidx: adminUser._c_logIdx,
                sdate,
                edate,
                cidx: 12,
                pconts: beforeWeek,
                nconts: nextWeek,
                rcd: timestamp
            };
            const res = await api.post("/weekWork/input", params);
            const result = res.data;

            if (result === 0) {
                alert("처리되었습니다.");
                // await deleteTmpWorkWeek(9, timestamp);
                await fnWorkWeekList(); // 목록 재조회
                fnLayerPopupView('WeekLayerPopUp', false)
            } else {
                alert("처리 실패");
            }

        } catch (e) {
            console.error(e);
            alert("등록 실패");
        } finally {
            setIsLoading(false);
        }
    };

    const deleteWorkWeek = async (delType, rcd) => {
        if (!fnDeleteMsg(delType)) return;

        const dtp = delType === 9 ? 2 : 1;

        try {
            setIsLoading(true);

            const params = {
                deltp: dtp,
                yyyy: year,
                wwork: week,
                uidx: adminUser._c_logIdx,
                didx: adminUser._c_logIdx,
                rcd,
            };

            const res = await api.post("/weekWork/delete", params);
            const result = res.data;

            if (result === 0) {
                if (delType !== 9) {
                    alert("처리되었습니다.");
                    await fnWorkWeekList();
                    fnLayerPopupView('WeekLayerPopUp', false)
                }
            } else {
                alert("삭제 실패");
            }

        } catch (e) {
            console.error(e);
            alert("삭제 실패");
        } finally {
            setIsLoading(false);
        }
    };


    // ================================================================
    // SECTION 4. Left 버튼 연동
    // ================================================================
    const { setOnRegister, setRegisterLabel } = useContext(LeftEventContext);

    const handleRegister = () => {
        fnLayerPopupView('WeekLayerPopUp', true);
    };

    useEffect(() => {
        setOnRegister(() => handleRegister);
        return () => setOnRegister(null);
    }, [setOnRegister]);

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
                                    <tbody>
                                        <tr>
                                            <td className="tdCenter">
                                                <select name="selectItem" className="selectItem" defaultValue="12">
                                                    <option value="12" data-id="">
                                                        준철 포트폴리오
                                                    </option>
                                                </select>
                                            </td>

                                            <td >
                                                <div style={{ width: "455px" }}>
                                                    <CKEditor
                                                        editor={ClassicEditor}
                                                        id={`beforeWeek`}
                                                        className={`beforeWeek ${style.txtWeek}`}
                                                        config={{
                                                            placeholder: "내용을 입력해 주세요",
                                                            ckfinder: { uploadUrl: "/common/uploadImgOne" }
                                                        }}
                                                        data={beforeWeek || ""}
                                                        onChange={(event, editor) => {
                                                            const data = editor.getData();
                                                            setBeforeWeek(data);
                                                        }}
                                                    />
                                                </div>
                                            </td>

                                            <td >
                                                <div style={{ width: "455px" }}>
                                                    <CKEditor
                                                        editor={ClassicEditor}
                                                        id={`nextWeek`}
                                                        className={`nextWeek ${style.txtWeek}`}
                                                        config={{
                                                            placeholder: "내용을 입력해 주세요",
                                                            ckfinder: { uploadUrl: "/common/uploadImgOne" }
                                                        }}
                                                        data={nextWeek || ""}
                                                        onChange={(event, editor) => {
                                                            const data = editor.getData();
                                                            setNextWeek(data);
                                                        }}
                                                    />
                                                </div>
                                            </td>

                                            <td></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="autoSizeLayerF">
                                <a id="btnSave" className="btn btnBlue" href="#" onClick={() => fnWorkWeekInput()}>
                                    {!isEmpty(workInputList?.now_CONTS) ? "수정" : "등록"}
                                </a>
                                <a id="btnDelete" className="btn btnRed" href="#" style={{ display: !isEmpty(workInputList?.now_CONTS) ? "blcok" : "none" }}>
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
                            <option key={y.value} value={y.value}>
                                {y.label}
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
                            {workList.length > 0 ? (
                                workList.map((val, i) => (
                                    <tr key={val.week_WORK_CONTS_IDX}>

                                        {(i === 0 || workList[i - 1].company_IDX !== val.company_IDX) && (
                                            <td rowSpan={val.row_CNT} className="rLine tdCenter">
                                                {val.company_NM}
                                            </td>
                                        )}

                                        <td className="rLine tdCenter">
                                            {val.user_NM}
                                        </td>

                                        <td className={`rLine tdVTop ${!val.prev_CONTS ? style.noData : ""}`}>
                                            <div dangerouslySetInnerHTML={{ __html: val.prev_CONTS }} />
                                        </td>

                                        <td className={`tdVTop ${!val.now_CONTS ? style.noData : ""}`}>
                                            <div dangerouslySetInnerHTML={{ __html: val.now_CONTS }} />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="none">등록된 내용이 없습니다.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </section>
            </section>
        </section>
    )
}

export default Report_01;