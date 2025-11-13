import React, { useEffect, useState } from "react";
import { api } from "api/api";
import { useLoading } from "context/LoadingContext";
import CategoryPanel from "./component/CategoryPanel";
import style from './css/system_01.module.css'

const System_01 = () => {
    // =============================
    // 1) 상태 정의
    // =============================

    const [cate1List, setCate1List] = useState([]);
    const [cate1Form, setCate1Form] = useState({ name: "", code: "", use: 1 });

    const [cate2List, setCate2List] = useState([]);
    const [cate2Form, setCate2Form] = useState({ name: "", code: "", use: 1 });

    const [cate3List, setCate3List] = useState([]);
    const [cate3Form, setCate3Form] = useState({ name: "", code: "", use: 1 });

    const [loading, setLoading] = useState(false);


    // =============================
    // 2) API 호출 함수
    // =============================

    const loadCategory = async (level, parentIdx) => {
        try {
            setLoading(true);
            const res = await api.get("/code/list", { params: { idx: parentIdx } });
            console.log(res);

            if (level === 1) setCate1List(res.data);
            if (level === 2) setCate2List(res.data);
            if (level === 3) setCate3List(res.data);
        } catch (e) {
            alert("로드 실패");
        } finally {
            setLoading(false);
        }
    };


    // =============================
    // 3) 항목 클릭 시 하위 목록 로딩
    // =============================

    const handleSelectCate1 = (item) => {
        setCate1Form({
            name: item.code_NM,
            code: item.code_ID,
            use: item.code_STS,
        });

        loadCategory(2, item.code_IDX);
    };

    const handleSelectCate2 = (item) => {
        setCate2Form({
            name: item.code_NM,
            code: item.code_ID,
            use: item.code_STS,
        });

        loadCategory(3, item.code_IDX);
    };

    const handleSelectCate3 = (item) => {
        setCate3Form({
            name: item.code_NM,
            code: item.code_ID,
            use: item.code_STS,
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

    const saveCate1 = () => alert("대분류 저장 API 연결");
    const saveCate2 = () => alert("중분류 저장 API 연결");
    const saveCate3 = () => alert("소분류 저장 API 연결");

    const cancel = (level) => {

        if (level <= 3) {
            setCate3Form({ name: "", code: "", use: 1 });
            setCate3List([]);
        }

        if (level <= 2) {
            setCate2Form({ name: "", code: "", use: 1 });
            setCate2List([]);
        }

        if (level <= 1) {
            setCate1Form({ name: "", code: "", use: 1 });
            setCate1List([]);
        }
    };


    // =============================
    // 6) UI 렌더링
    // =============================

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
                    onChange={onChange1}
                    onSave={saveCate1}
                    onCancel={() =>cancel(1)}
                />

                {/* 중분류 */}
                <CategoryPanel
                    title="중분류"
                    level={2}
                    list={cate2List}
                    form={cate2Form}
                    onSelect={handleSelectCate2}
                    onChange={onChange2}
                    onSave={saveCate2}
                    onCancel={() => cancel(2)}
                />

                {/* 소분류 */}
                <CategoryPanel
                    title="소분류"
                    level={3}
                    list={cate3List}
                    form={cate3Form}
                    onSelect={handleSelectCate3}
                    onChange={onChange3}
                    onSave={saveCate3}
                    onCancel={() => cancel(3)}
                />

                {/* 대분류 최초 로드 */}
            </section>
        </section >
    )
}

export default System_01;