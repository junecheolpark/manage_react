import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

import style from './css/board_01.module.css'
const Board_01 = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    return (
        <section className="contens">
            {/* 검색 영역 */}
            <section className="schBox">
                <p>
                    총 <span id="totalCnt" className="colBlue">0</span>건
                </p>
                <select id="ddlDateSearch" style={{ width: "120px" }}>
                    <option value="">작성일</option>
                </select>

                <DatePicker
                    selected={startDate}
                    onChange={setStartDate}
                    dateFormat="yyyy-MM-dd"
                    locale={ko}
                    placeholderText="시작일"
                    className="cal"
                    style={{ width: "120px" }}
                />
                ~
                <DatePicker
                    selected={endDate}
                    onChange={setEndDate}
                    dateFormat="yyyy-MM-dd"
                    locale={ko}
                    placeholderText="종료일"
                    className="cal"
                    style={{ width: "120px" }}
                />

                <input type="text" id="txtRegName" placeholder="작성자" style={{ width: "120px" }} />
                <input type="text" id="txtTitle" placeholder="제목" style={{ width: "250px" }} />
                <input type="submit" id="btnSch" value="검색" className="btn btnBlue" />
            </section>
            <section className={style.board_01}>
                {/* 게시판 목록 */}
                <section className="shadowBox">
                    <table className="tableList">
                        <colgroup>
                            <col />
                            <col style={{ width: "10%" }} />
                            <col style={{ width: "10%" }} />
                            <col style={{ width: "10%" }} />
                            <col style={{ width: "17%" }} />
                        </colgroup>
                        <thead>
                            <tr>
                                <th>제목</th>
                                <th>첨부파일</th>
                                <th>작성자</th>
                                <th>조회수</th>
                                <th>작성일</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan="5" className="noData">검색된 게시글이 없습니다.</td>
                            </tr>
                        </tbody>
                    </table>
                    <section id="pagingView" className="paging" />
                </section>

                {/* 작성 영역 */}
                <section className="shadowBox">
                    <table className="tableView">
                        <colgroup>
                            <col style={{ width: "12%" }} />
                            <col style={{ width: "40%" }} />
                            <col style={{ width: "10%" }} />
                            <col style={{ width: "38%" }} />
                        </colgroup>
                        <tbody>
                            <tr>
                                <th>작성자</th>
                                <td><span id="regName">로그인 사용자</span></td>
                                <th>작성날짜</th>
                                <td><span id="regDate">자동 저장</span></td>
                            </tr>
                            <tr>
                                <td colSpan="4" style={{ padding: "10px 0" }}>
                                    <input id="txtSubj" type="text" maxLength="100" placeholder="제목을 입력해 주세요" />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="4" style={{ padding: "10px 0" }}>
                                    <textarea id="resCnts" placeholder="내용을 입력해 주세요" />
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* 파일 업로드 */}
                    <div className="ry_fileUploadBody">
                        <div className="DivScrollY" id="fileDragBody">
                            <table className="tableList">
                                <thead>
                                    <tr>
                                        <th>파일명</th>
                                        <th>용량</th>
                                        <th>상태</th>
                                        <th>삭제</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* 파일 목록 렌더링 위치 */}
                                </tbody>
                            </table>
                        </div>

                        <div id="fileFoot">
                            <div className="filebox mgTB10">
                                <label htmlFor="ry_file">파일추가</label>
                                <input type="file" id="ry_file" multiple />
                                <a href="#download" id="fileDownBtn" className="btn btnWhite" style={{ display: "none" }}>
                                    파일전체 다운로드
                                </a>
                                <a href="#input" id="fileUpBtn" className="btn btnBlueLine floatR" style={{ display: "none" }}>
                                    파일 업로드
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* 하단 버튼 */}
                    <div className={style.boardFootBtn}>
                        <a href="#"  className="btn btnBlue" id="btnInput">등록</a>
                        <a href="#"  className="btn btnRed" id="btnDelete" style={{ display: "none" }}>삭제</a>
                        <a href="#"  className="btn btnWhite" id="btnCancel">취소</a>
                    </div>
                </section>
            </section>

        </section>
    )
}

export default Board_01;