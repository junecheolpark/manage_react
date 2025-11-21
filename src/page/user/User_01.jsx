import React, { useEffect, useRef, useState } from "react";
import { api } from "api/api";
import { useSelector } from "react-redux";
import { useLoading } from "context/LoadingContext";
import Pagination from 'component/Pagination';
import { fnCodeSelList, fnBlank, fnAlertReturn } from 'common/js/function';

import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

import style from './css/user_01.module.css';

const User_01 = () => {
    const adminUser = useSelector(state => state.authUser);
    const { setIsLoading } = useLoading();

    // ================================================================
    // SECTION 1. 초기 설정
    // ================================================================

    // 공통코드 셀렉트박스 셋팅
    const [selPosi, setSelPosi] = useState([]);
    const [selDept, setSelDept] = useState([]);
    const [selSchUserSts, setSelSchUserSts] = useState([]);
    const [selUserSts, setSelUserSts] = useState([]);
    const [selUserTp, setSelUserTp] = useState([]);
    const [selSchUserTp, setSelSchUserTp] = useState([]);

    useEffect(() => {
        const loadCodes = async () => {
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

    // ================================================================
    // SECTION 2. 검색 / 페이징 / 목록 조회
    // ================================================================

    // 페이지네이션
    const [curPage, setCurPage] = useState(1); // 현재페이지
    const [pageSize] = useState(10); // 페이지에 표시할 행 개수
    const [totalCnt, setTotalCnt] = useState(0); // 총개수

    const [search, setSearch] = useState({
        usertp: 0,
        usersts: 0,
        admintp: 0,
        schsel: 1,
        schtxt: "",
    });

    // 사용사 리스트 불러오기
    const [userList, setUserList] = useState([]);

    // 검색 조건 변경 처리
    const searchChange = (e) => {
        const { name, value } = e.target;
        setSearch((prev) => ({ ...prev, [name]: value }));
    };

    // 검색 엔터키 처리
    const enterKey = (e) => {
        if (e.keyCode === 13) {
            setCurPage(1);
            fnSortListView();
        }
    };

    // total 조회 + list 조회
    const fnSortListView = async () => {
        const params = {
            ltype: 1,
            page: curPage,
            psize: pageSize,
            usertp: Number(search.usertp),
            usersts: Number(search.usersts),
            admintp: Number(search.admintp),
            cidx: 0,
            cnm: "",
            datetp: 0,
            sdate: "",
            edate: "",
            schsel: Number(search.schsel),
            schtxt: search.schtxt,
            orderby: 0,
            desc: 0,
        };
        try {
            setIsLoading(true);
            const [total, res] = await Promise.all([
                api.get("/user/listTotal", { params }),
                api.get("/user/list", { params: { ...params, ltype: 2 } })
            ]);

            setTotalCnt(total.data);
            setUserList(res.data || []);
        } catch (err) {
            setIsLoading(false);
            console.error("요청 실패:", err);
            alert("불러오기 실패");
        } finally {
            setIsLoading(false);
        }
    };

    // 페이지 변경시 
    useEffect(() => {
        // setCurPage(curPage);
        fnSortListView();
    }, [curPage]);

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

    // ================================================================
    // SECTION 3. 상세 조회
    // ================================================================

    const [userView, setUserView] = useState(defaultUserView);
    const [selUser, setSelUser] = useState(0); // 클릭 셀 활성화 여부
    const [isEditable, setIsEditable] = useState(false); // 수정버튼 활성화 여부

    // 사용자 상세 보기
    const fnUserView = async (uidx) => {

        const params = {
            uidx: uidx,
        };
        try {
            setIsLoading(true);
            const res = await api.get("/user/view", { params });
            const resData = res.data;
            // console.log(resData)

            const emailParts = (resData.email || "@").split("@");
            const [emailId, emailDomain] = emailParts;

            setUserView({
                ...userView,     // 기존 폼값 유지
                ...resData,    // 서버 응답 덮어쓰기
                emailId,
                emailDomain,
            });

            setSelUser(uidx); // 선택된 셀
            setIsEditable(resData.user_IDX !== adminUser._c_logIdx);
        } catch (err) {
            alert("목록 불러오기 실패");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
        // alert(`사용자 상세 보기: ${uidx}`);
    }

    // ================================================================
    // SECTION 4. 회원 등록 / 수정 / 취소
    // ================================================================

    const userViewChange = (e) => {
        const { name, value } = e.target;
        setUserView((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // 회원 등록/수정
    const fnUserInput = async () => {
        // --- 유효성 검사 ---
        if (!fnAlertReturn(userView.nm, "성명", '')) return;
        if (!fnAlertReturn(userView.user_TP, "구분", 'select')) return;
        if (!fnAlertReturn(userView.user_ID, "아이디", '')) return;
        if (selUser === 0 && !fnAlertReturn(userView.user_PW, "비밀번호", '')) return;
        if (!fnAlertReturn(userView.user_STS, "상태", 'select')) return;

        // --- 파라미터 구성 ---
        const paramMap = {
            uidx: selUser,
            usertp: Number(userView.user_TP),
            id: userView.user_ID,
            pw: userView.user_PW,
            nm: userView.nm,
            pidx: Number(userView.posi_IDX),
            didx: Number(userView.dept_IDX),
            phone: userView.phone,
            mobile: userView.mobile,
            email: `${userView.emailId}@${userView.emailDomain}`,
            zcode: userView.zipcode,
            addr: userView.addr,
            addrdt: userView.addr_DETAIL,
            usersts: Number(userView.user_STS),
            cidx: 12,
            admintp: Number(userView.admin_TP),
            jdate: userView.join_DATE,
            ridx: 1, // 로그인 사용자 idx 등
            jdate: userView.join_DATE,
            bdate: userView.birthday,
        };

        try {
            setIsLoading(true);
            const res = await api.post("/user/input", paramMap);
            const result = res.data;

            if (result === 0) {
                alert("처리되었습니다.");
                fnUserCancel(); // 입력폼 초기화
                fnSortListView(); // 목록 갱신
            } else if (result === 4) {
                alert("아이디 중복");
            } else if (result === 5) {
                alert("사용자 중복");
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

    // 취소 버튼 클릭시 데이터 초기화
    const fnUserCancel = () => {
        setUserView(defaultUserView);
        setSelUser(0);
        setIsEditable(false);
    }

    // ================================================================
    // SECTION 5.  이메일 자동 검색 처리
    // ================================================================


    // 이메일 입력시 자동완성 검색

    // const [emailInput, setEmailInput] = useState("");
    const [emailList, setEmailList] = useState([]); // 전체 데이터
    const [filtered, setFiltered] = useState([]); // 검색 결과
    const [emailOpen, setEmailOpen] = useState(false);
    const ref = useRef(null);

    // 처음에 배열 가져오기
    useEffect(() => {
        const fetchEmailList = async () => {
            try {
                setIsLoading(true);
                const params = {
                    pidx: 19,
                    cid: "",
                    cnm: "",
                };
                const res = await api.get("/common/codeSelList", { params });
                const resData = res.data;
                //console.log(resData)
                setEmailList(resData.map((v) => ({ label: v.code_NM, value: v.code_IDX })));
            } catch {
                alert("이메일 목록을 불러오지 못했습니다.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchEmailList();
    }, []);

    //  입력값 변경 시 로컬 배열에서 필터링
    useEffect(() => {
        const emailInput = userView.emailDomain || "";
        if (!emailInput.trim()) {
            setFiltered([]);
            return;
        }

        const result = emailList.filter((item) =>
            item.label.toLowerCase().includes(emailInput.toLowerCase())
        );

        // console.log(result)
        setFiltered(
            result.length > 0
                ? result
                : [{ label: "검색된 이메일이 없습니다.", value: 0 }]
        );
        setEmailOpen(true);
    }, [userView.emailDomain, emailList]);

    //  외부 클릭 시 목록 닫기
    useEffect(() => {
        const clickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setEmailOpen(false);
        };
        document.addEventListener("mousedown", clickOutside);
        return () => document.removeEventListener("mousedown", clickOutside);
    }, []);

    // 선택 시 입력창에 반영
    const handleSelect = (label) => {
        if (label === "검색된 이메일이 없습니다.") return;
        userViewChange({ target: { name: "emailDomain", value: label } });
        setEmailOpen(false);
    };

    // ================================================================
    // SECTION 6. 주소 검색
    // ================================================================
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
                        <Pagination
                            totalCount={totalCnt}
                            tableLimit={pageSize}
                            curPage={curPage}
                            onPageChange={(page) => setCurPage(page)}
                        />
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
                                <td><input type="text" name="user_ID" value={userView.user_ID || ""} onChange={userViewChange} /></td>
                                <th>
                                    <span className="colRed">{selUser === 0 ? "*" : ""}</span> 비밀번호
                                </th>
                                <td><input type="text" name="user_PW" value={userView.user_PW || ""}
                                    placeholder={selUser > 0 ? "비밀번호 변경시 입력" : ""} onChange={userViewChange} /></td>
                            </tr>
                            <tr>
                                <th>일반전화</th>
                                <td><input type="text" name="phone" placeholder="숫자만 입력" value={userView.phone || ""} onChange={userViewChange} /></td>
                                <th>휴대전화</th>
                                <td><input type="text" name="mobile" placeholder="숫자만 입력" value={userView.mobile || ""} onChange={userViewChange} /></td>
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
                                            <input type="text" name="zipcode" value={userView.zipcode || ""} onChange={userViewChange} readOnly />
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
                                    // value={userView.birthday || ""}
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
                                    // value={userView.join_DATE || ""}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>이메일</th>
                                <td colSpan="3">
                                    <div className="ucTable">
                                        <div style={{ width: "170px", paddingRight: "5px" }}>
                                            <input type="text" name="emailId" value={userView.emailId || ""} onChange={userViewChange} />
                                        </div>
                                        <div style={{ width: "20px", paddingRight: "5px" }}>@</div>
                                        <div ref={ref} className={style.emailDomainDiv}>
                                            <input type="text" name="emailDomain" className="ui-autocomplete-input" type="text"
                                                maxLength="50" placeholder="이메일 검색 후 선택"
                                                value={userView.emailDomain || ""} onChange={userViewChange}
                                                // onFocus={() => filtered.length > 0 && setEmailOpen(true)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter" && filtered.length > 0) {
                                                        const first = filtered[0];
                                                        if (first.label !== "검색된 이메일이 없습니다.") {
                                                            userViewChange({ target: { name: "emailDomain", value: first.label } });
                                                        }
                                                        setEmailOpen(false);
                                                    }
                                                }}
                                                style={{ width: "100%", padding: "8px" }}
                                            />
                                            <div id="emailSchResult" className={style.emailSchResult}
                                                style={{
                                                    display: emailOpen && filtered.length > 0 ? "block" : "none",
                                                }}
                                            >
                                                <ul
                                                    className="ui-autocomplete ui-front ui-menu ui-widget ui-widget-content"
                                                >
                                                    {filtered.map((item, i) => (
                                                        <li
                                                            className="ui-menu-item"
                                                            key={i}
                                                            onMouseDown={(e) => {
                                                                e.preventDefault(); // blur 방지
                                                                if (item.label !== "검색된 이메일이 없습니다.") {
                                                                    userViewChange({
                                                                        target: { name: "emailDomain", value: item.label },
                                                                    });
                                                                }
                                                                setEmailOpen(false); //  클릭 시 닫기
                                                            }}
                                                            style={{
                                                                cursor: item.label === "검색된 이메일이 없습니다." ? "default" : "pointer",
                                                            }}
                                                            onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
                                                            onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
                                                            dangerouslySetInnerHTML={{
                                                                __html: item.label.replace(
                                                                    new RegExp(`(${userView.emailDomain || ""})`, "gi"),
                                                                    "<strong style='color:#0066cc'>$1</strong>"
                                                                ),
                                                            }}
                                                        />
                                                    ))}
                                                </ul>
                                            </div>
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
                        <a href="#reg" className="btn btnBlue" id="btnInput" onClick={fnUserInput} style={{ display: isEditable ? "none" : "inline-block" }}> {selUser === 0 ? "등록" : "수정"}</a>
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