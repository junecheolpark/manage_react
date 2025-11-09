import React, { useEffect, useRef, useState } from "react";
import { api } from "api/api";
import { useSelector } from "react-redux";

import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import { fnCodeSelList, fnBlank } from 'common/js/function';

import style from './css/user_01.module.css';

const User_01 = () => {
    const adminUser = useSelector(state => state.authUser);

    // 공통코드 셀렉트박스 셋팅

    const [selPosi, setSelPosi] = useState([]);
    const [selDept, setSelDept] = useState([]);
    const [selSchUserSts, setSelSchUserSts] = useState([]);
    const [selUserSts, setSelUserSts] = useState([]);
    const [selUserTp, setSelUserTp] = useState([]);
    const [selSchUserTp, setSelSchUserTp] = useState([]);

    useEffect(() => {
        async function loadCodes() {
            const userSelPosi = await fnCodeSelList([1, 10, '', '선택', 0, true, 0]);
            const userSelDept = await fnCodeSelList([1, 14, '', '선택', 0, true, 0]);
            const userSelSchUserSts = await fnCodeSelList([1, 16, '', '상태', 0, true, 0]);
            const userSelUserSts = await fnCodeSelList([1, 16, "", "선택", 0, true, 0]);
            const userSelUserTp = await fnCodeSelList([1, 30, "", "선택", 0, true, 0]);
            const userSelSchUserTp = await fnCodeSelList([1, 30, "", "구분", 0, true, 0]);

            setSelPosi(userSelPosi);
            setSelDept(userSelDept);
            setSelSchUserSts(userSelSchUserSts);
            setSelUserSts(userSelUserSts);
            setSelUserTp(userSelUserTp);
            setSelSchUserTp(userSelSchUserTp);
        }
        loadCodes();
    }, []);

    /*************************************** */
    // 사용사 리스트 불러오기
    const [curPage, setCurPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalCnt, setTotalCnt] = useState(0);
    const [userList, setUserList] = useState([]);

    const [search, setSearch] = useState({
        usertp: 0,
        usersts: 0,
        admintp: 0,
        schsel: 1,
        schtxt: "",
    });

    // 카운트 가져오기
    const fnSortListView = async () => {
        const params = {
            ltype: 1,
            page: curPage,
            psize: pageSize,
            usertp: parseInt(search.usertp),
            usersts: parseInt(search.usersts),
            admintp: parseInt(search.admintp),
            cidx: 0,
            cnm: "",
            datetp: 0,
            sdate: "",
            edate: "",
            schsel: parseInt(search.schsel),
            schtxt: search.schtxt,
            orderby: 0,
            desc: 0,
        };

        try {
            const res = await api.get("/user/listTotal", { params }); 
            const total = res.data;

            // console.log("총 개수:", total);
            setTotalCnt(total);

            fnSortList(total, params); // 기존 함수 호출
        } catch (err) {
            console.error("요청 실패:", err);
            alert("불러오기 실패");
        } 
    };
    // 목록 가져오기
    const fnSortList = async (total, paramMap ) => {
        const params = { ...paramMap, ltype: 2 };
        try {
            const res = await api.get("/user/list", { params });
            const items = res.data;

            if (!items || items.length === 0) {
                setUserList([]);
            } else {
                setUserList(items);
            }
        } catch (err) {
            alert("목록 불러오기 실패");
            console.error(err);
        }
    };

    // 엔터키 처리
    const enterKey = (e) => {
        if (e.keyCode === 13) {
            setCurPage(1);
            fnSortListView();
        }
    };

    // 검색 조건 변경 처리
    const searchChange = (e) => {
        const { name, value } = e.target;
        setSearch((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        fnSortListView();
    }, []);

    const defaultUserView = {
        user_IDX: 0,
        nm: "",
        user_ID: "",
        user_PW: "",
        phone: "",
        mobile: "",
        email: "",
        zipcode: "",
        addr: "",
        addr_DETAIL: "",
        admin_TP: 0,
        birthday: "",
        company_IDX: 0,
        company_NM: "",
        dept_IDX: 0,
        posi_IDX: 0,
        join_DATE: "",
        user_STS: 0,
        user_TP: 0,
        emailId: "",
        emailDomain: "",
        admin_NM: "",
    };

    const [userView, setUserView] = useState(defaultUserView);
    const [selUser, setSelUser] = useState(0); // 클릭 셀 활성화 여부
    const [isEditable, setIsEditable] = useState(false); // 수정버튼 활성화 여부

    // 사용자 상세 보기
    const fnUserView = async (uidx) => {
        const params = {
            uidx: uidx,
        };
        try {
            const res = await api.get("/user/view", { params });
            // console.log(res)
            const resData = res.data;

            const emailParts = (resData.email || "@").split("@");
            const [emailId, emailDomain] = emailParts;

            setUserView({
                ...userView,     // 기존 폼값 유지
                ...resData,    // 서버 응답 덮어쓰기
                emailId,
                emailDomain,
            });

            setSelUser(uidx); // 선택된 셀
            setIsEditable(resData.user_IDX === adminUser._c_logIdx);
        } catch (err) {
            alert("목록 불러오기 실패");
            console.error(err);
        }
        // alert(`사용자 상세 보기: ${uidx}`);
    }
    
    // 취소 버튼 클릭시 데이터 초기화
    const fnUserCancel = () => {
        setUserView(defaultUserView);
        setSelUser(0);
    }
    
    const userViewChange = (e) => {
        const { name, value } = e.target;
        setUserView((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    //***************** 주소 검색 ********************** */
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

                setUserView((prev) => ({
                    ...prev,
                    zipcode: data.zonecode,
                    addr: addr + extraAddr,
                }));
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



    return (
        <section className="contens">
            <section className="schBox">
                <p>
                    총 <span id="totalCnt" className="colBlue">{totalCnt}</span>건
                </p>
                <select name="usertp" style={{ width: "120px" }} value={search.usertp} onChange={searchChange}>
                    {selSchUserTp.map((item) => (
                        <option key={item.value} value={item.value} data-id={item.id}>
                            {item.label}
                        </option>
                    ))}
                </select>
                <select name="usersts" style={{ width: "120px" }} value={search.usersts} onChange={searchChange}>
                    {selSchUserSts.map((item) => (
                        <option key={item.value} value={item.value} data-id={item.id}>
                            {item.label}
                        </option>
                    ))}
                </select>
                <select name="schsel" style={{ width: "120px" }} value={search.schsel} onChange={searchChange}>
                    <option value="1">성명</option>
                    <option value="2">사번(ID)</option>
                    <option value="3">연락처</option>
                    <option value="4">이메일</option>
                </select>
                <input type="text" name="schtxt" style={{ width: "200px" }} value={search.schtxt} onChange={searchChange} onKeyUp={enterKey} />
                <input type="submit" id="btnSch" className="btn btnBlue" value="검색" onClick={fnSortListView} />
            </section>

            <section className={style.userManagement}>
                <section className="shadowBox">
                    <section className="tableBody">
                        <table id="userList" className="tableList">
                            <colgroup>
                                <col />
                                <col style={{ width: "12%" }} />
                                <col style={{ width: "12%" }} />
                                <col style={{ width: "14%" }} />
                                <col style={{ width: "17%" }} />
                                <col style={{ width: "15%" }} />
                            </colgroup>
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
                                {userList.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="noData">
                                            검색된 사용자가 없습니다.
                                        </td>
                                    </tr>
                                ) : (
                                    userList.map((user) => (
                                        <tr
                                            key={user.user_IDX}
                                            data-uidx={user.user_IDX}
                                            data-cidx={user.company_IDX || 0}
                                            onClick={() => fnUserView(user.user_IDX)} // 클릭 시 상세 보기
                                            className={`${user.user_STS === 18 ? "colRed" : ""} 
                                            ${selUser === user.user_IDX ? "selRow" : ""}`}
                                        >
                                            <td>
                                                <p className="text-ellipsis" title={user.company_NM}>
                                                    {user.company_NM || "-"}
                                                </p>
                                            </td>
                                            <td>
                                                <p className="text-ellipsis" title={user.nm}>
                                                    {user.nm || "-"}
                                                </p>
                                            </td>
                                            <td>{user.posi_NM || "-"}</td>
                                            <td>{user.user_ID}</td>
                                            <td>{user.mobile || user.phone || "-"}</td>
                                            <td>{user.user_STS_NM}</td>
                                        </tr>
                                    ))
                                )}
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
                                <td><input type="text" name="nm" value={userView.nm || ""} onChange={userViewChange} /></td>
                                <th>
                                    <span className="colRed">*</span> 구분
                                </th>
                                <td>
                                    <select name="user_TP" value={userView.user_TP || 0} onChange={userViewChange}>
                                        {selUserTp.map((item) => (
                                            <option key={item.value} value={item.value} data-id={item.id}>
                                                {item.label}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <th>부서</th>
                                <td>
                                    <select name="dept_IDX" value={userView.dept_IDX || 0} onChange={userViewChange}>
                                        {selDept.map((item) => (
                                            <option key={item.value} value={item.value} data-id={item.id}>
                                                {item.label}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <th>직위</th>
                                <td>
                                    <select name="posi_IDX" value={userView.posi_IDX || 0} onChange={userViewChange}>
                                        {selPosi.map((item) => (
                                            <option key={item.value} value={item.value} data-id={item.id}>
                                                {item.label}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <span className="colRed">*</span> 아이디
                                </th>
                                <td><input type="text"  name="user_ID" value={userView.user_ID || ""} onChange={userViewChange} /></td>
                                <th>
                                    <span className="colRed" id="pwRequired">*</span> 비밀번호
                                </th>
                                <td><input type="password" name="user_PW"  onChange={userViewChange}/></td>
                            </tr>
                            <tr>
                                <th>일반전화</th>
                                <td><input type="text" name="phone" placeholder="숫자만 입력" value={userView.phone || ""} onChange={userViewChange}/></td>
                                <th>휴대전화</th>
                                <td><input type="text" name="mobile" placeholder="숫자만 입력" value={userView.mobile || ""} onChange={userViewChange}/></td>
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
                                            <input type="text" name="zipcode" value={userView.zipcode || ""} onChange={userViewChange} readOnly  />
                                        </div>
                                        <div style={{ width: "40%", paddingRight: "5px" }}>
                                            <input type="text" name="addr" value={userView.addr || ""} onChange={userViewChange} readOnly />
                                        </div>
                                        <div>
                                            <input type="text" id="txtAddrDetail" name="addr_DETAIL" value={userView.addr_DETAIL || ""} onChange={userViewChange} />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th>생년월일</th>
                                <td>
                                    <DatePicker
                                        selected={userView.birthday}
                                        onChange={(date) =>
                                            setUserView((prev) => ({
                                                ...prev,
                                                birthday: date,
                                            }))
                                        }
                                        dateFormat="yyyy-MM-dd"
                                        locale={ko}
                                        placeholderText="날짜 선택"
                                        className="cal"
                                        value={userView.birthday || ""}
                                    />
                                </td>
                                <th>입사일자</th>
                                <td>
                                    <DatePicker
                                        selected={userView.join_DATE}
                                        onChange={(date) =>
                                            setUserView((prev) => ({
                                                ...prev,
                                                join_DATE: date,
                                            }))
                                        }
                                        dateFormat="yyyy-MM-dd"
                                        locale={ko}
                                        placeholderText="날짜 선택"
                                        className="cal"
                                        value={userView.join_DATE || ""}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>이메일</th>
                                <td colSpan="3">
                                    <div className="ucTable">
                                        <div style={{ width: "170px", paddingRight: "5px" }}>
                                            <input type="text" name="emailId" value={userView.emailId || ""} onChange={userViewChange}/>
                                        </div>
                                        <div style={{ width: "20px", paddingRight: "5px" }}>@</div>
                                        <div style={{ minWidth: "200px" }}>
                                            <input type="text" name="emailDomain" placeholder="이메일 검색 후 선택" value={userView.emailDomain || ""} onChange={userViewChange} />
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
                                    <select name="user_STS" value={userView.user_STS || 0} onChange={userViewChange}>
                                        {selUserSts.map((item) => (
                                            <option key={item.value} value={item.value} data-id={item.id}>
                                                {item.label}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <th>권한</th>
                                <td>
                                    <span >{fnBlank(userView.admin_NM)}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="btnRight pdT10">
                        <a href="#reg" className="btn btnBlue" id="btnInput">등록</a>
                        <a href="#del" className="btn btnRed" className={style.btnDelete}>삭제</a>
                        <a href="#can" className="btn btnWhite" onClick={fnUserCancel}>취소</a>
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