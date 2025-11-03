import React, { useContext, useEffect, useState } from "react";
import { LeftEventContext } from "component/layout/HeadLeftLayout";
import { fnLayerPopupView } from "common/js/function";

import style from './css/system_02.module.css'

const System_02 = () => {
    // left 버튼 등록 이벤트
    const { setOnRegister } = useContext(LeftEventContext);

    useEffect(() => {
        setOnRegister(() => handleRegister);
        return () => setOnRegister(null);
    }, [setOnRegister]);

    const handleRegister = () => {
        alert("사용자을(를) 선택해 주세요.");
    };
    //*********************************************************** */

    const [vacationList, setVacationList] = useState([]);
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
                    총 <span id="totalCnt" className="colBlue">0</span>건
                </p>
                <select style={{ width: "120px" }} id="selSchYear">
                    <option value="0">년도</option>
                </select>
                <select style={{ width: "120px" }} id="selStatus">
                    <option value="17">가입</option>
                    <option value="18">탈퇴</option>
                </select>
                <select style={{ width: "120px" }} id="selSearch">
                    <option value="1">성명</option>
                    <option value="2">아이디</option>
                </select>
                <input type="text" style={{ width: "150px" }} id="txtSearch" />
                <input type="submit" value="검색" className="btn btnBlue" id="btnSch" />
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
                                    <input type="checkbox" />
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
                            <tr>
                                <td colSpan="8" className="noData">
                                    검색된 사용자가 없습니다.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </section>
            </section>
        </section>
    )
}

export default System_02;