const Report_01 = () => {

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
                                        src="/resources/images/btn/btn_popclose.png"
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
                                <div className="tableTitle" id="tableTitle">
                                    <p style={{ paddingBottom: "5px" }}></p>
                                </div>

                                <table className="tableView" id="weekInput">
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
                                    저장
                                </a>
                                <a
                                    id="btnDelete"
                                    className="btn btnRed"
                                    href="#"
                                    style={{ display: "none" }}
                                >
                                    삭제
                                </a>
                                <a
                                    href="#popclose"
                                    className="btn btnWhite btn-layerClose"
                                >
                                    닫기
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </section>

            {/* 검색 박스 */}
            <section className="schBox">
                <section className="txtC">
                    <a id="btnWeekPre" href="#">
                        <img
                            src="/resources/images/btn/btn_bleft.png"
                            alt="이전"
                        />
                    </a>
                    &nbsp;
                    <select
                        name="selYear"
                        id="selYear"
                        style={{ width: "100px" }}
                    ></select>
                    &nbsp;
                    <select
                        name="selMonth"
                        id="selMonth"
                        style={{ width: "100px" }}
                    >
                        <option value="01">01월</option>
                        <option value="02">02월</option>
                        <option value="03">03월</option>
                        <option value="04">04월</option>
                        <option value="05">05월</option>
                        <option value="06">06월</option>
                        <option value="07">07월</option>
                        <option value="08">08월</option>
                        <option value="09">09월</option>
                        <option value="10" selected>
                            10월
                        </option>
                        <option value="11">11월</option>
                        <option value="12">12월</option>
                    </select>
                    &nbsp;
                    <select
                        name="selWeek"
                        id="selWeek"
                        style={{ width: "290px" }}
                    ></select>
                    &nbsp;
                    <a id="btnWeekNext" href="#">
                        <img
                            src="/resources/images/btn/btn_nright.png"
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