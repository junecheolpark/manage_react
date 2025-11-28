import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { api } from "api/api";
import { useSelector } from "react-redux";
import { useLoading } from "context/LoadingContext";
import Pagination from 'component/Pagination';
import { fnFileSize, fnDeleteMsg, fnAlertReturn, isEmpty } from 'common/js/function';

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

import FileDropDown from 'component/FileDropDown';
import style from './css/board_01.module.css'
const Board_01 = () => {

    // ================================================================
    // SECTION 1. 초기 설정
    // ================================================================
    const adminUser = useSelector(state => state.authUser);
    const { setIsLoading } = useLoading();

    const { boardType } = useParams(); // URL: /board/:boardType
    const { urlSearch } = useLocation();  // ?bidx=123

    const params = new URLSearchParams(urlSearch);
    const bidx = Number(params.get("bidx"));
   
    const boardMap = {
        "01": 10,
        "02": 11,
    };
    const arrPath = window.location.pathname.split("/");
    const masterBoardIdx = boardMap[arrPath[2]] ?? 12;

    useEffect(() => {
        if (bidx) fnBoardView(bidx);
    }, [bidx]);

    // ================================================================
    // SECTION 2. 검색 / 페이징 / 목록 조회
    // ================================================================

    // 페이지네이션
    const [curPage, setCurPage] = useState(1); // 현재페이지
    const [pageSize] = useState(10); // 페이지에 표시할 행 개수
    const [totalCnt, setTotalCnt] = useState(0); // 총개수

    const [search, setSearch] = useState({
        schd1: "",
        schd2: "",
        schrnm: "",
        schsel: 2,
        schtxt: "",
    });

    // 게시판 리스트 불러오기
    const [boardList, setBoardList] = useState([]);

    // 검색 조건 변경 처리
    const searchChange = (e) => {
        const { name, value } = e.target;
        setSearch((prev) => ({ ...prev, [name]: value }));
    };

    // 검색 엔터키 처리
    const enterKey = (e) => {
        if (e.keyCode === 13) {
            setCurPage(1);
        }
    };

    // total 조회 + list 조회
    const fnSortListView = async () => {
        const params = {
            ltype: 1,
            page: curPage,
            psize: pageSize,
            midx: masterBoardIdx,
            schd1: search.schd1,
            schd2: search.schd2,
            schrnm: search.schrnm,
            schsel: search.schsel,
            schtxt: search.schtxt,
            orderby: 0,
            desc: 0
        };
        try {
            setIsLoading(true);
            const [total, res] = await Promise.all([
                api.get("/board/listTotal", { params }),
                api.get("/board/list", { params: { ...params, ltype: 2 } })
            ]);
            setTotalCnt(total.data);
            setBoardList(res.data || []);
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
    }, [curPage, masterBoardIdx]);

    // ================================================================
    // SECTION 3. 상세 조회
    // ================================================================
    const defaultBoardView = {
        board_IDX: 0,
        subj: "",
        conts: "",
        reg_IDX: adminUser._c_logIdx,
        reg_NM: adminUser._c_logNm,
        reg_DATE: "",
        rcnt: 0,
    };

    const [boardView, setBoardView] = useState(defaultBoardView);
    const [selBoard, setSelBoard] = useState(0); // 클릭 셀 활성화 여부
    // const [isEditable, setIsEditable] = useState(false); // 수정버튼 활성화 여부

    const fnBoardView = async (bidx) => {
        const params = {
            bidx: bidx,
        };
        try {
            await fnBoardInput(1); // 조회수
            setIsLoading(true);
            const res = await api.get("/board/view", { params });
            const resData = res.data;
            // console.log(resData)


            setBoardView({
                ...boardView,     // 기존 폼값 유지
                ...resData    // 서버 응답 덮어쓰기
            });

            setSelBoard(bidx); // 선택된 셀

            fnBoardFileList(bidx);
        } catch (err) {
            alert("목록 불러오기 실패");
            console.error(err);
        }
    }
    // ================================================================
    // SECTION 4. 등록 / 수정 / 취소 / 삭제
    // ================================================================

    const boardViewChange = (e) => {
        const { name, value } = e.target;
        setBoardView((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    
    // 게시글 저장
    const fnBoardInput = async (regCnt) => {
        //  게시글 유효성 체크
        if (regCnt !== 1) {
            if (!fnAlertReturn(boardView.subj, "제목", '')) return;

            if (isEmpty(boardView.conts) === "") {
                alert("내용을 입력해주세요");
                return;
            }
        }

        const params = {
            bidx : boardView.board_IDX,
            mbidx: masterBoardIdx,
            rnm: boardView.reg_NM,             
            rcnt: regCnt, // 조회수 업데이트인지 구분
            subj: boardView.subj,
            conts: boardView.conts,
            ridx: boardView.reg_IDX
        };

        try {
            setIsLoading(true);
            // 게시글 등록/수정
            const res = await api.post("/board/input", params);
            const result = res.data;

            // 조회수가 아니고, 게시글 등록 성공시
            if (result === 0 && regCnt == 0) {
                await fnBoardFileDelete(); // 파일 삭제 처리
                await fnBoardFileInput(); // 새 파일 서버, DB 등록
                alert("처리 되었습니다.");
                fnBoardCancel();
                fnSortListView();
            }

        } catch (err) {
            console.error(err);
            alert("게시글 저장 실패");
        } finally {
            setIsLoading(false);
        }
    }

    // 게시물 삭제
    const fnBoardDelete = async () => {
        if (!fnDeleteMsg(1)) return;
        try {

            const paramMap = {
                deltp: 1,                      // 삭제 구분
                bidx: boardView.board_IDX,     // 게시글 ID
                didx: adminUser._c_logIdx,     // 작업한 사용자 ID
            };

            setIsLoading(true);

            const res = await api.post("/board/delete", paramMap);
            const result = res.data;

            if (result === 0) {
                alert("처리 되었습니다.");

                fnBoardCancel();
                fnSortListView();
                setCurPage(1);

            } else {
                alert("실패");
            }

        } catch (e) {
            alert("처리 중 오류가 발생했습니다.");
            console.error(e);
        } finally {
            // 7) 로딩 종료
            setIsLoading(false);
        }
    }

    // 취소 버튼 클릭시 데이터 초기화
    const fnBoardCancel = () => {
        setBoardView(defaultBoardView); // 뷰 초기화
        setSelBoard(0); //선택취소

        setServerFiles([]);            // 서버 파일 비우기
        setNewFiles([]);            // 대기 파일 비우기
        setDeletedServerFiles([]);  // 삭제 예정 목록 비우기
    }


    // ================================================================
    // SECTION 5. 파일 목록 조회 / 등록 / 삭제
    // ================================================================
   
    // 서버에 이미 저장된 파일들 (수정 화면)
    const [serverFiles, setServerFiles] = useState([]); // 기존 파일 목록
    const [deletedServerFiles, setDeletedServerFiles] = useState([]); // 지울 기존 파일들

    // 새로 추가한 파일들 (아직 서버에 안 올라간)
    const [newFiles, setNewFiles] = useState([]);

    // fileList 조회
    const fnBoardFileList = async (bidx) => {
        try {
            const params = {
                bidx: Number(bidx),
                fidx: 0,
                ftp: 0
            };

            const res = await api.post("/board/fileList", params);
            const items = res.data || [];

            setServerFiles(items);

        } catch (err) {
            alert("파일 목록 불러오기 실패");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // 새 파일 실제 업로드
    const fnBoardFileServerInput = async () => {
        const formData = new FormData();
        newFiles.forEach(f => formData.append("uploadFiles", f));
        formData.append("utype", "multi");
        formData.append("ufolder", "board");

        const fileRes = await api.post("/common/fileupload", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });

        return fileRes.data.fileDTOList;
    }

    // 새 파일 DB 등록
    const fnBoardFileInput = async () => {
        try {
            if (newFiles.length === 0) return;
            const uploadedFiles = await fnBoardFileServerInput();
            if (!uploadedFiles || uploadedFiles.length === 0) return;

            for (const f of uploadedFiles) {
                if (f.upload_ST !== 1) {
                    alert("일부파일 저장중 오류가 발생했습니다.");
                    continue;
                }
                const params = {
                    bidx: boardView.board_IDX,
                    fidx: 0,
                    ftp: 1,
                    fpath: f.file_PATH,
                    fnm: f.file_NM,
                    rfnm: f.real_FILE_NM,
                    fsize: Number(f.file_SIZE),
                    ridx: adminUser._c_logIdx
                };
                await api.post("/board/fileInput", params);
            }

        } catch (err) {
            console.error(err);
            alert("게시글파일 저장 실패");
        }
    }

    // 기존 첨부파일 삭제
    const fnBoardFileDelete = async () => {
        try {
            if (deletedServerFiles.length === 0) return;

            for (const f of deletedServerFiles) {
                const params = {
                    furl: unescape(f.file_PATH),
                    fnm: unescape(f.file_NM),
                    deltp: 0,
                    bidx: boardView.board_IDX,
                    fidx: Number(f.file_IDX),
                    didx: adminUser._c_logIdx
                };
                await api.post("/board/fileDelete", params);
            }
        } catch (err) {
            console.error(err);
            alert("게시글파일 삭제 실패");
        }
    }

    // 파일 추가
    const fnAddFiles = (e) => {
        e.preventDefault();
        const files = e.target.files;
        setNewFiles(prev => [...prev, ...files]);
    };

    // 기존 파일 목록에서 삭제 버튼 눌렀을 때
    const fnRemoveServerFile = (file) => {
        if (!fnDeleteMsg(3)) return;

        // 화면 목록에서 제거
        setServerFiles((prev) => prev.filter((f) => f.file_IDX !== file.file_IDX));

        // 삭제 요청 목록에 추가 (DB에서 삭제할 예정)
        setDeletedServerFiles((prev) => [...prev, file]);
    };

    // 새로 추가된 (대기) 파일 삭제 버튼 눌렀을 때
    const fnRemoveNewFile = (index) => {
        // 해당 인덱스를 newFiles에서 제거
        setNewFiles((prev) => prev.filter((_, i) => i !== index));
    };

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
                    selected={search.schd1}
                    onChange={(date) =>
                        setSearch(prev => ({
                            ...prev,
                            schd1: date
                        }))
                    }
                    dateFormat="yyyy-MM-dd"
                    locale={ko}
                    placeholderText="시작일"
                    className="cal"
                    style={{ width: "120px" }}
                />
                ~
                <DatePicker
                    selected={search.schd2}
                    onChange={(date) =>
                        setSearch(prev => ({
                            ...prev,
                            schd2: date
                        }))
                    }
                    dateFormat="yyyy-MM-dd"
                    locale={ko}
                    placeholderText="종료일"
                    className="cal"
                    style={{ width: "120px" }}
                />

                <input type="text" name="schrnm" placeholder="작성자" style={{ width: "120px" }} onChange={searchChange} />
                <input type="text" name="schtxt" placeholder="제목" style={{ width: "250px" }} onChange={searchChange} onKeyUp={enterKey} />
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
                            {boardList.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="noData">
                                        검색된 게시글이 없습니다.
                                    </td>
                                </tr>
                            ) : (
                                boardList.map((item) => (
                                    <tr
                                        key={item.board_IDX}
                                        onClick={() => fnBoardView(item.board_IDX)} // 클릭 시 상세 보기
                                        className={` ${selBoard === item.board_IDX ? "selRow" : ""}`}
                                        onClick={() => fnBoardView(item.board_IDX)}
                                    >
                                        <td className="tdL">
                                            <p className="text-ellipsis" title={item.subj}>
                                                <span>{item.subj}</span>
                                            </p>
                                        </td>
                                        <td>
                                            <span className="lblFile">
                                                {item.file_IDX === 0 ? (
                                                    "-"
                                                ) : (
                                                    <img
                                                        src="/images/icon/ic_file.png"
                                                        alt="첨부파일 있음"
                                                        height="16"
                                                    />
                                                )}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="lblRegName">{item.reg_NM}</span>
                                        </td>
                                        <td>
                                            <span className="lblCnt">{item.read_CNT}</span>
                                        </td>
                                        <td>
                                            <span className="lblRegDate">{item.reg_DATE.substr(0, 10)}</span>
                                        </td>
                                    </tr>
                                )))}
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
                                <td><span id="regName">{adminUser._c_logNm}</span></td>
                                <th>작성날짜</th>
                                <td><span id="regDate">{boardView.reg_DATE.substr(0, 16) || '자동 저장'}</span></td>
                            </tr>
                            <tr>
                                <td colSpan="4" style={{ padding: "10px 0" }}>
                                    <input type="text" name="subj" value={boardView.subj || ""} maxLength="100" placeholder="제목을 입력해 주세요" onChange={boardViewChange} />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="4" style={{ padding: "10px 0", height: "304px" }}>
                                    <CKEditor
                                        editor={ClassicEditor}
                                        data={boardView.conts || ""}
                                        config={{
                                            placeholder: "내용을 입력해 주세요",
                                            ckfinder: { uploadUrl: "/common/uploadImgOne" }
                                        }}
                                        onChange={(event, editor) => {
                                            const data = editor.getData();
                                            boardViewChange({
                                                target: { name: "conts", value: data }
                                            });
                                        }} />
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* 파일 업로드 */}
                    <div className="fileUploadBody">
                        <FileDropDown
                            serverFiles={serverFiles}               // 기존 파일
                            newFiles={newFiles}                     // 새로 추가된 파일
                            onChangeFiles={setNewFiles}             // FileDropDown에서 파일이 변경되면 호출됨
                            onRemoveServerFile={fnRemoveServerFile} // 기존파일 삭제
                            onRemoveNewFile={fnRemoveNewFile}       // 새파일 삭제
                        />

                        <div id="fileFoot">
                            <div className="filebox mgTB10">
                                <label htmlFor="j_file">파일추가</label>
                                <input type="file" id="j_file" multiple onChange={fnAddFiles}/>
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
                        <a href="#" className="btn btnBlue" id="btnInput" onClick={() => fnBoardInput(0)}>{selBoard === 0 ? "등록" : "수정"}</a>
                        <a href="#" className="btn btnRed" id="btnDelete" style={{ display: selBoard === 0 ? "none" : "inline-block" }} onClick={fnBoardDelete}>삭제</a>
                        <a href="#" className="btn btnWhite" id="btnCancel" onClick={fnBoardCancel}>취소</a>
                    </div>
                </section>
            </section>

        </section>
    )
}

export default Board_01;