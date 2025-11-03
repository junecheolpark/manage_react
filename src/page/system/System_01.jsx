import React, { useState } from "react";
import style from './css/system_01.module.css'

const System_01 = () => {
    const [category1List, setCategory1List] = useState([]);
    const [category2List, setCategory2List] = useState([]);
    const [category3List, setCategory3List] = useState([]);

    const [cateName1, setCateName1] = useState("");
    const [cateCode1, setCateCode1] = useState("");
    const [cateUse1, setCateUse1] = useState("1");

    const [cateName2, setCateName2] = useState("");
    const [cateCode2, setCateCode2] = useState("");
    const [cateUse2, setCateUse2] = useState("1");

    const [cateName3, setCateName3] = useState("");
    const [cateCode3, setCateCode3] = useState("");
    const [cateUse3, setCateUse3] = useState("1");

    const handleAddCategory = (level) => {
        if (level === 1) {
            setCategory1List([
                ...category1List,
                { code: cateCode1, name: cateName1, use: cateUse1 },
            ]);
            setCateName1("");
            setCateCode1("");
        } else if (level === 2) {
            setCategory2List([
                ...category2List,
                { code: cateCode2, name: cateName2, use: cateUse2 },
            ]);
            setCateName2("");
            setCateCode2("");
        } else if (level === 3) {
            setCategory3List([
                ...category3List,
                { code: cateCode3, name: cateName3, use: cateUse3 },
            ]);
            setCateName3("");
            setCateCode3("");
        }
    };

    return (
        <section className="contens">
            <section className={style.codeManagement}>
                {/* 대분류 */}
                <section className="shadowBox">
                    <div className="tableTitle pdB10">
                        <p className="ftBold">&nbsp;대분류</p>
                    </div>

                    <div className="DivScrollY AllBorder" style={{ height: "500px" }}>
                        <table className="tableList">
                            <thead>
                                <tr>
                                    <th>코드</th>
                                    <th>코드명</th>
                                    <th>상태</th>
                                </tr>
                            </thead>
                            <tbody>
                                {category1List.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="colGray2 ftSize12">
                                            검색된 내용이 없습니다.
                                        </td>
                                    </tr>
                                ) : (
                                    category1List.map((item, i) => (
                                        <tr key={i}>
                                            <td>{item.code}</td>
                                            <td>{item.name}</td>
                                            <td>{item.use === "1" ? "사용" : "미사용"}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="pdT10">
                        <table className="tableView">
                            <tbody>
                                <tr>
                                    <th>코드명</th>
                                    <td colSpan="3">
                                        <input
                                            type="text"
                                            value={cateName1}
                                            onChange={(e) => setCateName1(e.target.value)}
                                            maxLength="50"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th>코드</th>
                                    <td colSpan="3">
                                        <input
                                            type="text"
                                            value={cateCode1}
                                            onChange={(e) => setCateCode1(e.target.value)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th>사용 여부</th>
                                    <td colSpan="3">
                                        <label>
                                            <input
                                                type="radio"
                                                name="CateUse1"
                                                value="1"
                                                checked={cateUse1 === "1"}
                                                onChange={(e) => setCateUse1(e.target.value)}
                                            />
                                            사용
                                        </label>
                                        &nbsp;&nbsp;
                                        <label>
                                            <input
                                                type="radio"
                                                name="CateUse1"
                                                value="0"
                                                checked={cateUse1 === "0"}
                                                onChange={(e) => setCateUse1(e.target.value)}
                                            />
                                            미사용
                                        </label>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="pdT10 btnRight">
                        <a href="#"  className="btn btnBlue" onClick={() => handleAddCategory(1)}>
                            추가
                        </a>
                        <a href="#"  className="btn btnWhite">취소</a>
                    </div>
                </section>

                {/* 중분류 */}
                <section className="shadowBox">
                    <div className="tableTitle pdB10">
                        <p className="ftBold">&nbsp;중분류</p>
                    </div>

                    <div className="DivScrollY AllBorder" style={{ height: "500px" }}>
                        <table className="tableList">
                            <thead>
                                <tr>
                                    <th>코드</th>
                                    <th>코드명</th>
                                    <th>상태</th>
                                </tr>
                            </thead>
                            <tbody>
                                {category2List.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="colGray2 ftSize12">
                                            대분류를 선택해 주세요.
                                        </td>
                                    </tr>
                                ) : (
                                    category2List.map((item, i) => (
                                        <tr key={i}>
                                            <td>{item.code}</td>
                                            <td>{item.name}</td>
                                            <td>{item.use === "1" ? "사용" : "미사용"}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="pdT10">
                        <table className="tableView">
                            <tbody>
                                <tr>
                                    <th>코드명</th>
                                    <td colSpan="3">
                                        <input
                                            type="text"
                                            value={cateName2}
                                            onChange={(e) => setCateName2(e.target.value)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th>코드</th>
                                    <td colSpan="3">
                                        <input
                                            type="text"
                                            value={cateCode2}
                                            onChange={(e) => setCateCode2(e.target.value)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th>사용 여부</th>
                                    <td colSpan="3">
                                        <label>
                                            <input
                                                type="radio"
                                                name="CateUse2"
                                                value="1"
                                                checked={cateUse2 === "1"}
                                                onChange={(e) => setCateUse2(e.target.value)}
                                            />
                                            사용
                                        </label>
                                        &nbsp;&nbsp;
                                        <label>
                                            <input
                                                type="radio"
                                                name="CateUse2"
                                                value="0"
                                                checked={cateUse2 === "0"}
                                                onChange={(e) => setCateUse2(e.target.value)}
                                            />
                                            미사용
                                        </label>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="pdT10 btnRight">
                        <a href="#"  className="btn btnBlue" onClick={() => handleAddCategory(2)}>
                            추가
                        </a>
                        <a href="#"  className="btn btnWhite">취소</a>
                    </div>
                </section>

                {/* 소분류 */}
                <section className="shadowBox">
                    <div className="tableTitle pdB10">
                        <p className="ftBold">&nbsp;소분류</p>
                    </div>

                    <div className="DivScrollY AllBorder" style={{ height: "500px" }}>
                        <table className="tableList">
                            <thead>
                                <tr>
                                    <th>코드</th>
                                    <th>코드명</th>
                                    <th>상태</th>
                                </tr>
                            </thead>
                            <tbody>
                                {category3List.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="colGray2 ftSize12">
                                            중분류를 선택해 주세요.
                                        </td>
                                    </tr>
                                ) : (
                                    category3List.map((item, i) => (
                                        <tr key={i}>
                                            <td>{item.code}</td>
                                            <td>{item.name}</td>
                                            <td>{item.use === "1" ? "사용" : "미사용"}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="pdT10">
                        <table className="tableView">
                            <tbody>
                                <tr>
                                    <th>코드명</th>
                                    <td colSpan="3">
                                        <input
                                            type="text"
                                            value={cateName3}
                                            onChange={(e) => setCateName3(e.target.value)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th>코드</th>
                                    <td colSpan="3">
                                        <input
                                            type="text"
                                            value={cateCode3}
                                            onChange={(e) => setCateCode3(e.target.value)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th>사용 여부</th>
                                    <td colSpan="3">
                                        <label>
                                            <input
                                                type="radio"
                                                name="CateUse3"
                                                value="1"
                                                checked={cateUse3 === "1"}
                                                onChange={(e) => setCateUse3(e.target.value)}
                                            />
                                            사용
                                        </label>
                                        &nbsp;&nbsp;
                                        <label>
                                            <input
                                                type="radio"
                                                name="CateUse3"
                                                value="0"
                                                checked={cateUse3 === "0"}
                                                onChange={(e) => setCateUse3(e.target.value)}
                                            />
                                            미사용
                                        </label>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="pdT10 btnRight">
                        <a href="#"  className="btn btnBlue" onClick={() => handleAddCategory(3)}>
                            추가
                        </a>
                        <a href="#"  className="btn btnWhite">취소</a>
                    </div>
                </section>
            </section>
        </section>
    )
}

export default System_01;