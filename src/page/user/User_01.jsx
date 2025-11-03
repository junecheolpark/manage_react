import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

import style from './css/user_01.module.css';

const User_01 = () => {
    /*****************주소검색********************** */
    const layerRef = useRef(null);

    const fnAddrSchClose = () => {
        if (layerRef.current) layerRef.current.style.display = "none";
    };

    const fnAddrSch = () => {
        new window.daum.Postcode({
            oncomplete: function (data) {
                let addr = "";
                let extraAddr = "";

                if (data.userSelectedType === "R") addr = data.roadAddress;
                else addr = data.jibunAddress;

                if (data.userSelectedType === "R") {
                    if (data.bname && /[동|로|가]$/g.test(data.bname)) extraAddr += data.bname;
                    if (data.buildingName && data.apartment === "Y")
                        extraAddr += (extraAddr ? ", " + data.buildingName : data.buildingName);
                    if (extraAddr) extraAddr = " (" + extraAddr + ")";
                }

                document.getElementById("txtZipCd").value = data.zonecode;
                document.getElementById("txtAddr").value = addr + extraAddr;
                document.getElementById("txtAddrDetail").focus();

                if (layerRef.current) layerRef.current.style.display = "none";
            },
            width: "100%",
            height: "100%",
            maxSuggestItems: 5,
        }).embed(layerRef.current);

        if (layerRef.current) {
            layerRef.current.style.display = "block";
            initLayerPosition();
        }
    };

    const initLayerPosition = () => {
        if (!layerRef.current) return;
        const width = 300;
        const height = 400;
        const borderWidth = 2;
        layerRef.current.style.width = width + "px";
        layerRef.current.style.height = height + "px";
        layerRef.current.style.border = borderWidth + "px solid";
        layerRef.current.style.left =
            ((window.innerWidth - width) / 2 - borderWidth) + "px";
        layerRef.current.style.top =
            ((window.innerHeight - height) / 2 - borderWidth) + "px";
    };

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);
    /*************************************** */

    const [birth, setBirth] = useState(null);
    const [joinDate, setJoinDate] = useState(null);
    return (
        <section className="contens">
            <section className="schBox">
                <p>
                    총 <span id="totalCnt" className="colBlue">0</span>건
                </p>
                <select id="selSchUserTp" style={{ width: "120px" }}>
                    <option value="0">구분</option>
                </select>
                <select id="selSchUserSts" style={{ width: "120px" }}>
                    <option value="0">상태</option>
                </select>
                <select id="selSch" style={{ width: "120px" }}>
                    <option value="1">성명</option>
                    <option value="2">사번(ID)</option>
                    <option value="3">연락처</option>
                    <option value="4">이메일</option>
                </select>
                <input type="text" id="txtSch" style={{ width: "200px" }} />
                <input type="submit" id="btnSch" className="btn btnBlue" value="검색" />
            </section>

            <section className={style.userManagement}>
                <section className="shadowBox">
                    <section className="tableBody">
                        <table id="userList" className="tableList">
                            <thead>
                                <tr>
                                    <th>회사</th>
                                    <th>성명</th>
                                    <th>직위</th>
                                    <th>ID</th>
                                    <th>연락처</th>
                                    <th>상태</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colSpan="6" className="noData">
                                        검색된 사용자가 없습니다.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <section className="paging" id="pagingView">
                            <button className="img brNo">
                                <img src="/images/btn/paging_first_n.gif" alt="first" />
                            </button>
                            <button className="img no">
                                <img src="/images/btn/paging_prev_n.gif" alt="before" />
                            </button>
                            <button className="on">1</button>
                            <button className="img brNo">
                                <img src="/images/btn/paging_next_n.gif" alt="next" />
                            </button>
                            <button className="img">
                                <img src="/images/btn/paging_last_n.gif" alt="last" />
                            </button>
                        </section>
                    </section>
                </section>

                <section className="shadowBox">
                    <table id="userInput" className="tableView">
                        <tbody>
                            <tr>
                                <th>
                                    <span className="colRed">*</span> 성명
                                </th>
                                <td><input type="text" id="txtNm" data-uidx="0" /></td>
                                <th>
                                    <span className="colRed">*</span> 구분
                                </th>
                                <td>
                                    <select id="selUserTp">
                                        <option value="0">선택</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <th>부서</th>
                                <td>
                                    <select id="selDept">
                                        <option value="0">선택</option>
                                    </select>
                                </td>
                                <th>직위</th>
                                <td>
                                    <select id="selPosi">
                                        <option value="0">선택</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <span className="colRed">*</span> 아이디
                                </th>
                                <td><input type="text" id="txtID" /></td>
                                <th>
                                    <span className="colRed" id="pwRequired">*</span> 비밀번호
                                </th>
                                <td><input type="password" id="txtPW" /></td>
                            </tr>
                            <tr>
                                <th>일반전화</th>
                                <td><input type="text" id="txtPhone" placeholder="숫자만 입력" /></td>
                                <th>휴대전화</th>
                                <td><input type="text" id="txtMobile" placeholder="숫자만 입력" /></td>
                            </tr>
                            <tr>
                                <th>
                                    주소{" "}
                                    <img
                                        src="/images/btn/btn_sch.png"
                                        alt="검색"
                                        style={{ width: "20px", cursor: "pointer" }}
                                        onClick={fnAddrSch}
                                    />
                                </th>
                                <td colSpan="3">
                                    <div className="ucTable">
                                        <div style={{ width: "70px", paddingRight: "5px" }}>
                                            <input type="text" id="txtZipCd" readOnly />
                                        </div>
                                        <div style={{ width: "40%", paddingRight: "5px" }}>
                                            <input type="text" id="txtAddr" readOnly />
                                        </div>
                                        <div>
                                            <input type="text" id="txtAddrDetail" />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th>생년월일</th>
                                <td>
                                    <DatePicker
                                        selected={birth}
                                        onChange={(date) => setBirth(date)}
                                        dateFormat="yyyy-MM-dd"
                                        locale={ko}
                                        placeholderText="날짜 선택"
                                        className="cal"
                                    />
                                </td>
                                <th>입사일자</th>
                                <td>
                                    <DatePicker
                                        selected={joinDate}
                                        onChange={(date) => setJoinDate(date)}
                                        dateFormat="yyyy-MM-dd"
                                        locale={ko}
                                        placeholderText="날짜 선택"
                                        className="cal"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>이메일</th>
                                <td colSpan="3">
                                    <div className="ucTable">
                                        <div style={{ width: "170px", paddingRight: "5px" }}>
                                            <input type="text" id="txtEmail" />
                                        </div>
                                        <div style={{ width: "20px", paddingRight: "5px" }}>@</div>
                                        <div style={{ minWidth: "200px" }}>
                                            <input type="text" id="txtEmailDm" placeholder="이메일 검색 후 선택" />
                                            <div id="emailSchResult"></div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <span className="colRed">*</span> 상태
                                </th>
                                <td>
                                    <select id="selUserSts">
                                        <option value="0">선택</option>
                                    </select>
                                </td>
                                <th>권한</th>
                                <td>
                                    <span id="lblAdTpNm" data-atp="0">-</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="btnRight pdT10">
                        <a href="#reg" className="btn btnBlue" id="btnInput">등록</a>
                        <a href="#del" className="btn btnRed" className={style.btnDelete}>삭제</a>
                        <a href="#can" className="btn btnWhite">취소</a>
                    </div>
                </section>
            </section>

            <div
                id="addrSchView"
                ref={layerRef}
                style={{
                    display: "none",
                    position: "fixed",
                    overflow: "hidden",
                    zIndex: 1,
                    WebkitOverflowScrolling: "touch",
                }}
            >
                <img
                    src="//t1.daumcdn.net/postcode/resource/images/close.png"
                    id="btnCloseLayer"
                    style={{
                        cursor: "pointer",
                        position: "absolute",
                        right: "-3px",
                        top: "-3px",
                        zIndex: 1,
                    }}
                    onClick={fnAddrSchClose}
                    alt="닫기"
                />
            </div>
        </section>
    )
}

export default User_01;