import React, { useContext, useEffect, useState, useRef } from "react";
import { LeftEventContext } from "component/layout/HeadLeftLayout";
import { fnLayerPopupView, fnSelYear } from "common/js/function";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import koLocale from "@fullcalendar/core/locales/ko";

import './css/schduleFullcalender.css'
import style from './css/schedule_01.module.css'

const Schedule_01 = () => {
    // left 버튼 등록 이벤트
    const { setOnRegister } = useContext(LeftEventContext);

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
    const [events] = useState([
        { title: "회의", start: "2025-11-03", extendedProps: { stype: 1, sidx: 101 } },
        { title: "출장", start: "2025-11-07", end: "2025-11-09", extendedProps: { stype: 2, sidx: 102 } },
    ]);

    const handleEventClick = (info) => {
        const { title, extendedProps } = info.event;
        const sidx = extendedProps?.sidx;

        if (title === "심사") {
            window.location.href = `/Schedule_View_01.aspx?yyyy=${info.event.start.getFullYear()}&mm=${info.event.start.getMonth() + 1
                }&sidx=${sidx}`;
        } else {
            alert(`${title} 일정 클릭됨`);
        }
    };

    const renderEventContent = (eventInfo) => {
        const { title, extendedProps } = eventInfo.event;
        const stype = extendedProps?.stype;

        if (stype === 1) {
            return (
                <div className="fc-content btnPointer" onClick={() => alert(`사용자 일정 보기: ${title}`)}>
                    <span className="fc-title">{title}</span>
                </div>
            );
        } else if (stype === 2) {
            return (
                <div className="fc-content">
                    <span className="fc-title">{title}</span>
                </div>
            );
        }
        return <span>{title}</span>;
    };

    const calendarRef = useRef(null); // FullCalendar 제어용 ref

    // 버튼 클릭 핸들러
    const handleCalendarNav = (type) => {
        const calendarApi = calendarRef.current.getApi(); // FullCalendar 인스턴스 접근
        const today = new Date();

        if (type === "prev") calendarApi.prev(); // 이전달 이동
        else if (type === "next") calendarApi.next(); // 다음달 이동
        else if (type === "today") {
            const viewDate = calendarApi.getDate();
            if (
                viewDate.getFullYear() === today.getFullYear() &&
                viewDate.getMonth() === today.getMonth()
            )
                return; // 이미 이번 달이면 무시
            calendarApi.today(); // 오늘로 이동
        }

        // 이동 후 날짜 정보 갱신
        const newDate = calendarApi.getDate();
        const calYear = newDate.getFullYear();
        const calMonth = String(newDate.getMonth() + 1).padStart(2, "0");

        setYear(calYear);
        setMonth(calMonth);

        // 원래 함수 호출 대응 (필요 시 구현)
        fnHolidayList();
        fnSchList();
    };

    // 예시용 함수 (실제 구현시 제거)
    const fnHolidayList = () => console.log("공휴일 리스트 로드");
    const fnSchList = () => console.log("스케줄 리스트 로드");


    const today = new Date();
    const currentYear = today.getFullYear();
    const defaultMonth = String(today.getMonth() + 1).padStart(2, "0"); // '01'~'12'

    const [year, setYear] = useState(currentYear);
    const [month, setMonth] = useState(defaultMonth);

    // 예: 2025년부터 올해까지 역순 리스트 만들기
    const years = fnSelYear(2025, (currentYear - 2025 + 1), false, '년');

    return (
        <section className="contens">
            {/* 상단 검색 및 이동 */}
            <section className={`${style.schBoxs} schBox txtC`}>
                <section>
                    <a className={style.btnPrev} id="btnPrev" href="#" onClick={() => handleCalendarNav("prev")}>
                        <img src="/images/btn/btn_bleft.png" alt="이전" />
                    </a>
                    &nbsp;
                    <select
                        id="selSchYear"
                        style={{ width: "100px" }}
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                    >
                        {years.map((y) => (
                            <option key={y.value} value={y.value}>
                                {y.label}
                            </option>
                        ))}
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
                    <a className={style.btnNext} id="btnNext" href="#" onClick={() => handleCalendarNav("next")}>
                        <img src="/images/btn/btn_nright.png" alt="다음" />
                    </a>
                    <input type="button" id="btnToday" value="오늘" className="btn btnBlue" onClick={() => handleCalendarNav("today")} />
                </section>
            </section>

            <section className="contsF shadowBox">
                <section id="calendar">{/* 캘린더 내용 위치 */}
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[dayGridPlugin, interactionPlugin]} // 사용하는 플러그인 (월간 캘린더, 클릭 등 상호작용)
                        schedulerLicenseKey="GPL-My-Project-Is-Open-Source"  // 라이선스 키 (GPL 무료 프로젝트용)
                        initialDate="2025-11-01"  // 최초 표시될 날짜 (기준일)
                        locale={koLocale} // 언어 설정 (한국어 로케일 적용)
                        height={700} //  전체 캘린더 높이
                        // contentHeight="auto" // 내용 높이 자동 조절
                        dayMaxEventRows={false} // 한셀에 표시할 최대 이벤트 행 수 (false면 제한 없음)
                        displayEventTime={false} // 이벤트 시간 표시 여부
                        editable={false} // 이벤트 수정 가능 여부
                        selectable={false} // 날짜 선택 가능 여부
                        eventClick={handleEventClick} // 이벤트 클릭 시 실행할 함수
                        eventContent={renderEventContent} // 각 이벤트 표시 커스터마이징
                        events={events} // 이벤트 데이터
                        headerToolbar={false} // 상단 헤더 툴바 제거
                        // titleFormat={{ year: "numeric", month: "2-digit" }} // 제목 형식 (예: "2025.11")
                        dayHeaderContent={(args) => [ // 요일 헤더 커스터마이징
                            "일요일",
                            "월요일",
                            "화요일",
                            "수요일",
                            "목요일",
                            "금요일",
                            "토요일",
                        ][args.date.getDay()]}
                        dayCellContent={(args) => args.date.getDate()} // 날짜 셀에 일자만 표시
                    />
                </section>

                {/* 일정 등록 팝업 */}
                <section
                    id="scheduleInputView" className={`${style.scheduleInputView} dim-layer`}
                    
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
                                <div className={style.autoSizeLayerContBody}>
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
                                                    <div className={style.targetList} id="targetList">
                                                        <p children={style.toName} id= "ToName">대상자 없음</p>
                                                        <p>
                                                            <a href="#" 
                                                                id="btnUser"
                                                                className={`${style.btnUser} btn btnBlue`}
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
                                                        id="txtConts" className={style.txtConts}                                                        rows="2"
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
                                <div className={style.autoSizeLayerContBody}>
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