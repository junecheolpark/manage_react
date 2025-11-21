import React, { useContext, useEffect, useState, useCallback } from "react";
import { api } from "api/api";
import { LeftEventContext } from "component/layout/HeadLeftLayout";
import { useSelector } from "react-redux";
import { useLoading } from "context/LoadingContext";
import { fnLayerPopupView, fnSelYear, fnCodeSelList, fnBlank } from 'common/js/function';
import { fnVacationUsageRate } from 'common/js/code';

import style from './css/system_02.module.css'

const System_02 = () => {
    const adminUser = useSelector(state => state.authUser);
    const { setIsLoading } = useLoading();

    // ================================================================
    // SECTION 1. 초기 설정
    // ================================================================
    
    //셀렉트 박스 셋팅
    const today = new Date();
    const currentYear = today.getFullYear();
    const years = fnSelYear(2025, (currentYear - 2025 + 1), false, '년');

    const [selUserSts, setSelUserSts] = useState([]);

    useEffect(() => {
        async function loadCodes() {
            const userSelUserSts = await fnCodeSelList([1, 16, "", "선택", 0, true, 0]);

            setSelUserSts(userSelUserSts);
        }
        loadCodes();
    }, []);

    // ================================================================
    // SECTION 2. 검색 / 페이징 / 목록 조회
    // ================================================================
    const [curPage, setCurPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalCnt, setTotalCnt] = useState(0);

    const [search, setSearch] = useState({
        year: currentYear,
        usersts: 0,
        schsel: 1,
        schtxt: ""
    });

    // ================================
    // 목록 state
    // ================================
    const [vacList, setVacList] = useState([]);

    // 검색 조건 변경
    const searchChange = (e) => {
        const { name, value } = e.target;
        setSearch((prev) => ({ ...prev, [name]: value }));
    };

    // 엔터 검색
    const enterKey = (e) => {
        if (e.keyCode === 13) {
            setCurPage(1);
            fnVacListView();
        }
    };

    // total 조회 + list 조회
    const fnVacListView = async () => {
        const params = {
            ltype: 1,
            page: curPage,
            psize: pageSize,
            cidx: adminUser._c_logCIdx,
            year: parseInt(search.year),
            usersts: parseInt(search.usersts),
            schsel: parseInt(search.schsel),
            schtxt: search.schtxt,
            orderby: 0,
            desc: 0
        };
        try {
            setIsLoading(true);

            const [total, res] = await Promise.all([
                api.get("/user/VacationTotal", { params }),
                api.get("/user/vacationList", { params: { ...params, ltype: 2 } })
            ]);

            setTotalCnt(total.data);
            setVacList(res.data || []);
        } catch (err) {
            console.error(err);
            alert("목록 불러오기 실패");
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }

    };

    useEffect(() => {
        fnVacListView();
    }, [curPage]);

    // ================================================================
    // SECTION 3. 휴가 상세 팝업 조회
    // ================================================================

    //휴가 내역리스트
    const [vacationList, setVacationList] = useState([]);
    const [vacationUserNm, setVacationUserNm] = useState("");
    const [vacationCount, setVacationCount] = useState({});

    const fnSchList = async (uidx, nm) => {
        setIsLoading(true);

        // 팝업에 사용자 이름 반영
        setVacationUserNm(nm);
        const params = {
            uidx: uidx,
            sdate: `${search.year}-01-01`,
            edate: `${search.year}-12-31`,
        };

        try {
            const res = await api.get("/schedule/list", {params});
            const items = res.data;

            const filtered = [];

            items.forEach(val => {
                const { reg_DATE, code_NM, sdate, edate, schedule_TP, approve_STS, conts } = val;
                const vacationTypes = { 27: 1, 29: 0.5, 34: 0 };

                // 승인 + 연차, 반차, 기타휴가만
                if (approve_STS === 2 && vacationTypes[schedule_TP] !== undefined) {
                    const dayCnt = vacationTypes[schedule_TP];

                    filtered.push({
                        applyDate: reg_DATE?.substr(0, 10),
                        type: code_NM,
                        startDate: sdate,
                        endDate: edate,
                        days: dayCnt,
                        reason: conts
                    });
                }
            });

            setVacationList(filtered);

            // 팝업 열기
            fnLayerPopupView("VacationView", true);

        } catch (err) {
            console.error(err);
            alert("휴가 내역 조회 실패");
        } finally {
            setIsLoading(false);
        }
    };

    // ================================================================
    // SECTION 4. 체크박스 / 입력값 관리
    // ================================================================

    // 체크된 사용자: { userIdx: true/false }
    const [allChecked, setAllChecked] = useState(false);
    const [vacationChecked, setVacationChecked] = useState({});

    const fnCheckAll = (checked) => {
        setAllChecked(checked);

        // vacationChecked 전체 업데이트
        const newChecked = {};
        vacList.forEach(item => {
            newChecked[item.user_IDX] = checked;
        });
        setVacationChecked(newChecked);
    };

    // 체크박스 
    const fnCheck = (uidx, checked) => {
        setVacationChecked(prev => {
            const updated = { ...prev, [uidx]: checked };

            // 전체 체크 여부 계산 (updated 기반)
            const all = vacList.every(item => updated[item.user_IDX]);
            setAllChecked(all);
            return updated;
        });
    };

    //연차 입력 변경
    const fnNomalCntChange = (uidx, value) => {
        setVacationCount(prev => ({
            ...prev,
            [uidx]: value,
        }));
    };

    // ================================================================
    // SECTION 5. 연차 등록 / 수정
    // ================================================================

    const fnVacationInput = async () => {
        // 체크된 사용자만 필터링
        const checkedUsers = Object.keys(vacationChecked).filter(
            (uidx) => vacationChecked[uidx] === true
        );

        if (checkedUsers.length === 0) {
            alert("사용자를 선택해주세요.");
            return;
        }

        // uidx 목록
        const uidxStr = checkedUsers.join(",");

        const ncntStr = checkedUsers.map(uidx => {
            // 입력했으면 입력값
            if (vacationCount[uidx] !== undefined && vacationCount[uidx] !== "") {
                return vacationCount[uidx];
            }

            // 입력 없으면 기존 값 nomal_CNT 사용
            const info = vacList.find(v => v.user_IDX == uidx);
            return info ? info.nomal_CNT : 0;
        }).join(",");

        const paramMap = {
            uidx: uidxStr,
            year: parseInt(search.year),     // 연도 select 값
            ncnt: ncntStr,
            ridx: adminUser._c_logIdx         // 관리 user idx
        };
        console.log(paramMap)
    try {
            setIsLoading(true);
            const res = await api.post("/user/vacationInput", paramMap);

            if (res.data === 0) {
                alert("처리되었습니다.");
                setVacationChecked({});
                setVacationCount({});
                setAllChecked(false);
                fnVacListView(); // 리스트 새로고침
            } else {
                alert("실패");
            }
        } catch (err) {
            console.error(err);
            alert("요청 실패");
        } finally {
            setIsLoading(false);
        }
    };

    // ================================================================
    // SECTION 6. Left 버튼 연동
    // ================================================================
    const { setOnRegister } = useContext(LeftEventContext);

    // 최신 상태 반영되는 함수
    const handleRegister = useCallback(() => {
        fnVacationInput(); // 내부에서 최신 state 읽음
    }, [vacationChecked, vacationCount]);

    // context 에 업데이트
    useEffect(() => {
        setOnRegister(() => handleRegister);
        return () => setOnRegister(null);
    }, [setOnRegister, handleRegister]); 

    return (
        <section className="contens">
            {/* 휴가 상세 팝업 */}
            <section id="VacationView" className="dim-layer" style={{ display: "none" }}>
                <section className="autoSizeLayerBg" style={{ overflowY: "auto" }}>
                    <div
                        className="autoSizeLayer ui-draggable"
                        style={{ width: "1000px", margin: "147.5px auto", position: "relative" }}
                    >
                        <div className="autoSizeLayerT">
                            <div className="autoSizeLayerCls">
                                <a href="#popclose" onClick={() => fnLayerPopupView('VacationView', false)}>
                                    <img
                                        src="/resources/images/btn/btn_popclose.png"
                                        alt="닫기"
                                    />
                                </a>
                            </div>
                            <div className="autoSizeLayerTInner">
                                <h4 className="ui-draggable-handle txtC">
                                    <span id="vacationNm">{vacationUserNm}</span>님 휴가사용 현황
                                </h4>
                            </div>
                        </div>

                        <div className="autoSizeLayerCont">
                            <div className="autoSizeLayerContBody">
                                <section className="tableBody">
                                    <div className="DivScrollYHead">
                                        <table className="tableList">
                                            <colgroup>
                                                <col style={{ width: "14%" }} />
                                                <col style={{ width: "15%" }} />
                                                <col style={{ width: "14%" }} />
                                                <col style={{ width: "14%" }} />
                                                <col style={{ width: "10%" }} />
                                                <col />
                                            </colgroup>
                                            <thead>
                                                <tr>
                                                    <th>신청일</th>
                                                    <th>휴가구분</th>
                                                    <th>시작일</th>
                                                    <th>종료일</th>
                                                    <th>일수</th>
                                                    <th>휴가사유</th>
                                                </tr>
                                            </thead>
                                        </table>
                                    </div>
                                    <div className="DivScrollY" style={{ height: "300px" }}>
                                        <table className="tableList" id="AppList2">
                                            <colgroup>
                                                <col style={{ width: "14%" }} />
                                                <col style={{ width: "15%" }} />
                                                <col style={{ width: "14%" }} />
                                                <col style={{ width: "14%" }} />
                                                <col style={{ width: "10%" }} />
                                                <col />
                                            </colgroup>
                                            <tbody>
                                                {vacationList.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="6">검색된 휴가 사용내역이 없습니다.</td>
                                                    </tr>
                                                ) : (
                                                    vacationList.map((v, i) => (
                                                        <tr key={i}>
                                                            <td>{v.applyDate}</td>
                                                            <td>{v.type}</td>
                                                            <td>{v.startDate}</td>
                                                            <td>{v.endDate}</td>
                                                            <td>{v.days}</td>
                                                            <td>{v.reason}</td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </section>
                            </div>
                            <div className="autoSizeLayerF">
                                <a href="#popclose" className="btn btnWhite" onClick={() => fnLayerPopupView('VacationView', false)}>
                                    닫기
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </section>

            {/* 검색 영역 */}
            <section className="schBox">
                <p>
                    총 <span id="totalCnt" className="colBlue">{totalCnt}</span>건
                </p>
                <select
                    name="year"
                    value={search.year}
                    onChange={searchChange}
                    style={{ width: "120px" }}
                >
                    {years.map((y) => (
                        <option key={y.value} value={y.value}>
                            {y.label}
                        </option>
                    ))}
                </select>
                <select name="usersts" id="selStatus" style={{ width: "120px" }} value={search.usersts || 0} onChange={searchChange}>
                    {selUserSts.map((item) => (
                        <option key={item.value} value={item.value} data-id={item.id}>
                            {item.label}
                        </option>
                    ))}
                </select>
                <select style={{ width: "120px" }} id="selSearch">
                    <option value="1">성명</option>
                    <option value="2">아이디</option>
                </select>
                <input
                    name="schtxt"
                    style={{ width: "150px" }}
                    value={search.schtxt}
                    onChange={searchChange}
                    onKeyUp={enterKey}
                />
                <input type="submit" value="검색" className="btn btnBlue" onClick={() => { setCurPage(1); fnVacListView(); }} />
            </section>

            {/* 메인 표 */}
            <section className="contsBox">
                <section className="contsF" style={{ width: "100%" }}>
                    <table className={`${style.AppList} tableList noCursor stats`} id="AppList">
                        <colgroup>
                            <col style={{ width: "3%" }} />
                            <col style={{ width: "20%" }} />
                            <col style={{ width: "10%" }} />
                            <col style={{ width: "10%" }} />
                            <col style={{ width: "7%" }} />
                            <col style={{ width: "7%" }} />
                            <col style={{ width: "7%" }} />
                            <col style={{ width: "7%" }} />
                        </colgroup>
                        <thead>
                            <tr>
                                <th rowSpan="2">
                                    <input
                                        type="checkbox"
                                        checked={allChecked}
                                        onChange={(e) => fnCheckAll(e.target.checked)}
                                    />
                                </th>
                                <th colSpan="3">사원정보</th>
                                <th colSpan="4">연차휴가</th>
                            </tr>
                            <tr>
                                <th>부서명</th>
                                <th>직급</th>
                                <th>성명</th>
                                <th>발생</th>
                                <th>사용</th>
                                <th>잔여</th>
                                <th>사용률</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vacList.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="noData">
                                        검색된 정보가 없습니다.
                                    </td>
                                </tr>
                            ) : (
                                vacList.map((item, idx) => {
                                    const nomal = item.nomal_CNT;
                                    const used = item.use_NOMAL_CNT;
                                    const percent = nomal === 0 ? 100 : Math.floor(used * 100 / nomal);

                                    return (
                                        <tr key={idx}>
                                            {/* 체크박스 */}
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={vacationChecked[item.user_IDX] || false}
                                                    onChange={(e) =>
                                                        fnCheck(item.user_IDX, e.target.checked)
                                                    }
                                                />
                                            </td>
                                            <td>{fnBlank(item.dept_NM)}</td>
                                            <td>{fnBlank(item.posi_NM)}</td>
                                            <td>{item.nm}</td>

                                            {/* 연차 보유 */}
                                            <td>
                                                <input
                                                    type="text"
                                                    className={style.nomalCnt}
                                                    value={vacationCount[item.user_IDX] ?? nomal}
                                                    onChange={(e) =>
                                                        fnNomalCntChange(item.user_IDX, e.target.value)
                                                    }
                                                />
                                            </td>

                                            {/* 사용 */}
                                            <td className="ftBold">
                                                <a
                                                    href="#"
                                                    onClick={(e) => {
                                                        // e.preventDefault();
                                                        fnSchList(item.user_IDX, item.nm);
                                                    }}
                                                >
                                                    {used}
                                                </a>
                                            </td>

                                            {/* 잔여 */}
                                            <td>{nomal - used}</td>

                                            {/* 사용률 */}
                                            <td>
                                                <span className={fnVacationUsageRate(percent)}>
                                                    {percent} %
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </section>
            </section>
        </section>
    )
}

export default System_02;