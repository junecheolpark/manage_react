import React, { useEffect, useState } from "react";
import { api } from "api/api";
import { useSelector } from "react-redux";
import { useLoading } from "context/LoadingContext";
import { fnAlertReturn } from 'common/js/function';

import CategoryPanel from "./component/CategoryPanel";


import style from './css/system_01.module.css'

const System_01 = () => {
    const adminUser = useSelector(state => state.authUser);
    const { setIsLoading } = useLoading();
    // =============================
    // 1) 상태 정의
    // =============================
    // list = 코드관련 리스트 
    // form = 입력값 관련

    const defaultCateForm = {
        cidx: 0,
        pidx: 0,
        cid: "",
        cnm: "",
        cdep: 1,
        csts: 1,
        csor: 0,
        ridx: adminUser._c_logIdx
    };

    const [cate1List, setCate1List] = useState([]);
    const [cate1Form, setCate1Form] = useState({ ...defaultCateForm, cdep: 1 });

    const [cate2List, setCate2List] = useState([]);
    const [cate2Form, setCate2Form] = useState({ ...defaultCateForm, cdep: 2 });

    const [cate3List, setCate3List] = useState([]);
    const [cate3Form, setCate3Form] = useState({ ...defaultCateForm, cdep: 3 });



    // =============================
    // 2) API 호출 함수
    // =============================

    const loadCategory = async (level, parentIdx) => {
        try {
            setIsLoading(true);
            const res = await api.get("/code/list", { params: { idx: parentIdx } });
            const resData = res.data;

            const setters = {
                1: setCate1List,
                2: setCate2List,
                3: setCate3List,
            };
            setters[level](resData);

        } catch (e) {
            alert("로드 실패");
        } finally {
            setIsLoading(false);
        }
    };


    // 3) 항목 클릭 시 하위 목록 로딩

    const handleSelectCate1 = (item) => {

        setCate1Form({
            cidx: item.code_IDX,
            pidx: item.parent_IDX,
            cid: item.code_ID,
            cnm: item.code_NM,
            cdep: item.code_DEPTH,
            csts: item.code_STS,
            csor: item.code_SORT,
            ridx: adminUser._c_logIdx
        });
        cancel(2);
        loadCategory(2, item.code_IDX);
    };

    const handleSelectCate2 = (item) => {

        setCate2Form({
            cidx: item.code_IDX,
            pidx: item.parent_IDX,
            cid: item.code_ID,
            cnm: item.code_NM,
            cdep: item.code_DEPTH,
            csts: item.code_STS,
            csor: item.code_SORT,
            ridx: adminUser._c_logIdx
        });
        cancel(3);
        loadCategory(3, item.code_IDX);
    };

    const handleSelectCate3 = (item) => {
        setCate3Form({
            cidx: item.code_IDX,
            pidx: item.parent_IDX,
            cid: item.code_ID,
            cnm: item.code_NM,
            cdep: item.code_DEPTH,
            csts: item.code_STS,
            csor: item.code_SORT,
            ridx: adminUser._c_logIdx
        });
    };


    // =============================
    // 4) 입력 변경
    // =============================

    const onChange1 = (key, value) =>
        setCate1Form((prev) => ({ ...prev, [key]: value }));

    const onChange2 = (key, value) =>
        setCate2Form((prev) => ({ ...prev, [key]: value }));

    const onChange3 = (key, value) =>
        setCate3Form((prev) => ({ ...prev, [key]: value }));


    // =============================
    // 5) 저장 / 취소
    // =============================

    /**
     * 코드 저장
     * @param {number} level 1=대분류 / 2=중분류 / 3=소분류
     */
    const saveCate = async (level) => {
        // 저장 대상 form 선택
        const paramMap = level === 1 ? cate1Form : level === 2 ? cate2Form : cate3Form;
        
        // 필수 입력 체크
        if (!fnAlertReturn(paramMap.cnm, "코드명", '')) return;
        if (!fnAlertReturn(paramMap.cid, "코드", '')) return;
        
        //  React 불변성 유지 → 복사해서 수정
        let newParam = { ...paramMap };
        
        // 신규 등록 시(csor === 0) 정렬번호/부모코드/전체코드 자동 설정
        if (newParam.csor === 0) {
            // 리스트 길이 (정렬번호 생성용)
            newParam.csor = level === 1 ? cate1List.length : level === 2 ? cate2List.length : cate3List.length;
            newParam.pidx = level === 1 ? 0 : level === 2 ? cate1Form.cidx : cate2Form.cidx;
            newParam.cid = level === 1 ? '' : level === 2 ? cate1Form.cid + newParam.cid : cate2Form.cid + newParam.cid;
        }

        try {
            setIsLoading(true);
            const res = await api.post("/code/input", newParam);
            const result = res.data;

            if (result === 0) {
                alert("처리되었습니다.");

                // 입력값 초기화
                cancel(level);

                // 저장한 레벨만 다시 로딩
                level === 1 ? loadCategory(1, 0) : loadCategory(level, newParam.pidx);
            } else if (result === 4) {
                alert("중복된 코드명이 있습니다.");
            } else {
                alert("등록 실패");
            }
        } catch (err) {
            console.error(err);
            alert("요청 실패");
        } finally {
            setIsLoading(false);
        }
    };

    // 정렬 기능
    const sortChange = async (level, item, chsort) => {

        const paramMap = {
            cidx: item.code_IDX, // 현재
            pidx: item.parent_IDX, // 현재
            chsort: chsort, // 바뀔
            sort: item.code_SORT // 현재
        }

        try {
            setIsLoading(true);

            const res = await api.post("/code/sort", paramMap);

            if (res.data === 0) {
                // 정렬 성공 → 해당 level 다시 로드
                cancel(level - 1)
                loadCategory(level, item.parent_IDX);
            } else {
                alert("정렬 실패");
            }
        } catch (err) {
            alert("요청 실패");
        } finally {
            setIsLoading(false);
        }
    };

    // 선택한 레벨의 하위 카테고리들을 모두 초기화
    const cancel = (level) => {
        // 레벨 이하 모두 초기화 (의도적 fall-through)
        switch (level) {
            case 1: setCate1Form({ ...defaultCateForm, cdep: 1 });
                setCate2List([]);
            case 2: setCate2Form({ ...defaultCateForm, cdep: 2 });
                setCate3List([]);
            case 3: setCate3Form({ ...defaultCateForm, cdep: 3 });
                break;
            default:
                break;
        }
    };


    // =============================
    // 6) UI 렌더링
    // =============================

    useEffect(() => {
        loadCategory(1, 0);
    }, []);

    return (
        <section className="contens">
            <section className={style.codeManagement}>
                {/* 대분류 */}
                <CategoryPanel
                    title="대분류"
                    level={1}
                    list={cate1List}
                    form={cate1Form}
                    onSelect={handleSelectCate1}
                    onFormChange={onChange1}
                    onSave={() => saveCate(1)}
                    onCancel={() => cancel(1)}
                    sortChange={sortChange}
                />

                {/* 중분류 */}
                <CategoryPanel
                    title="중분류"
                    level={2}
                    list={cate2List}
                    form={cate2Form}
                    onSelect={handleSelectCate2}
                    onFormChange={onChange2}
                    onSave={() => saveCate(2)}
                    onCancel={() => cancel(2)}
                    sortChange={sortChange}
                />

                {/* 소분류 */}
                <CategoryPanel
                    title="소분류"
                    level={3}
                    list={cate3List}
                    form={cate3Form}
                    onSelect={handleSelectCate3}
                    onFormChange={onChange3}
                    onSave={() => saveCate(3)}
                    onCancel={() => cancel(3)}
                    sortChange={sortChange}
                />

                {/* 대분류 최초 로드 */}
            </section>
        </section >
    )
}

export default System_01;