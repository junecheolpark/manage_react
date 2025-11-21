import React, { useContext, useEffect, useState } from "react";
import { api } from "api/api";
import { LeftEventContext } from "component/layout/HeadLeftLayout";
import { useSelector } from "react-redux";
import { useLoading } from "context/LoadingContext";
import { fnLayerPopupView, fnSelYear, fnCodeSelList, fnBlank } from 'common/js/function';
import { fnVacationUsageRate } from 'common/js/code';

import style from './css/system_02.module.css'

const System_02 = () => {
    // left 버튼 등록 이벤트
    const { setOnRegister } = useContext(LeftEventContext);

    useEffect(() => {
        setOnRegister(() => handleRegister);
        return () => setOnRegister(null);
    }, [setOnRegister]);

    const handleRegister = () => {
        fnVacationInput();
        // alert("사용자을(를) 선택해 주세요.");
    };
    //*********************************************************** */
    const adminUser = useSelector(state => state.authUser);
    const { setIsLoading } = useLoading();

    //*********************************************************** */
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
    const [vacationList, setVacationList] = useState([]);

    // ================================
    // 검색/페이지 state
    // ================================
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

    // ================================
    // 검색 조건 변경
    // ================================
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

    // ================================
    // 1) total 조회 + list 조회
    // ================================
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

            const res = await api.get("/user/VacationTotal", { params });
            const total = res.data;
            setTotalCnt(total);

            fnVacList(total, params);
        } catch (err) {
            console.error(err);
            alert("목록 불러오기 실패");
            setIsLoading(false);
        }
    };

    // ================================
    // 2) 목록 조회
    // ================================
    const fnVacList = async (total, paramMap) => {
        try {
            const params = { ...paramMap, ltype: 2 };
            const res = await api.get("/user/vacationList", { params });
            const resData = res.data;

            setVacList(resData || []);
        } catch (err) {
            alert("목록 불러오기 실패");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // ================================
    // page 변경 시 list reload
    // ================================
    useEffect(() => {
        fnVacListView();
    }, [curPage]);

    useEffect(() => {
        const initialCheck = {};
        const initialCount = {};

        vacList.forEach(item => {
            initialCheck[item.user_IDX] = false;
            initialCount[item.user_IDX] = item.nomal_CNT;
        });

        setVacationChecked(initialCheck);
        setVacationCount(initialCount);
    }, [vacList]);
    // ================================
    // Row 내부 기능
    // ================================
    const listDetail = (uidx, nm) => {
        // 기존 onclick="fnSchList(uidx,nm)" 대응
        console.log("사용자 상세 휴가 내역", uidx, nm);
        // 필요하면 modal or route 이동 구현
    };

    // ================================
    // 등록관련 함수
    // ================================

    // 체크된 사용자: { userIdx: true/false }
    const [allChecked, setAllChecked] = useState(false);
    const [vacationChecked, setVacationChecked] = useState({});

    // 연차 입력값: { userIdx: "10" }
    const [vacationCount, setVacationCount] = useState({});

    const fnCheckAll = (checked) => {
        setAllChecked(checked);

        // vacationChecked 전체 업데이트
        const newChecked = {};
        vacList.forEach(item => {
            newChecked[item.user_IDX] = checked;
        });
        setVacationChecked(newChecked);
    };

    const fnCheck = (uidx, checked) => {
        setVacationChecked(prev => ({
            ...prev,
            [uidx]: checked,
        }));
    };

    // const fnCheck = (uidx, checked) => {
    //     setVacationChecked(prev => {
    //         const newState = {
    //             ...prev,
    //             [uidx]: checked,
    //         };

    //         if (vacList.length > 0) {
    //             const all = vacList.every(item => newState[item.user_IDX]);
    //             setAllChecked(all);
    //         }

    //         return newState;
    //     });
    // };

    //연차 입력 변경
    const fnNomalCntChange = (uidx, value) => {
        setVacationCount(prev => ({
            ...prev,
            [uidx]: value,
        }));
    };

    // ================================
    // 등록/수정
    // ================================

    const fnVacationInput = async () => {
        console.log(vacationChecked);
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

        // 각각의 사용자 연차 입력값
        const ncntStr = checkedUsers
            .map(uidx => vacationCount[uidx] || 0)
            .join(",");

        const paramMap = {
            uidx: uidxStr,
            year: parseInt(search.usersts),     // 연도 select 값
            ncnt: ncntStr,
            ridx: adminUser._c_logIdx         // 관리 user idx
        };

    console.log(paramMap)
    return;
        try {
            setIsLoading(true);
            const res = await api.post("/user/vacationInput", paramMap);

            if (res.data === 0) {
                alert("처리되었습니다.");
                setVacationChecked({});
                setVacationCount({});
                //fnVacationListView(); // 리스트 새로고침
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
                                    <span id="vacationNm">홍길동</span>님 휴가사용 현황
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
                                                        e.preventDefault();
                                                        listDetail(item.user_IDX, item.nm);
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