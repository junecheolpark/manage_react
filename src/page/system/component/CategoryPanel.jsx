const CategoryPanel = ({
    title,
    level,
    data = [],
    form,
    onSelect,
    onFormChange,
    onSave,
    onCancel,
}) => {

    return (
        <section className="shadowBox">
            <div className="tableTitle pdB10">
                <p className="ftBold">&nbsp;{title}</p>
            </div>

            {/* 리스트 */}
            <div className="DivScrollY AllBorder" style={{ height: 500 }}>
                <table className="tableList">
                    <thead>
                        <tr>
                            <th>코드</th>
                            <th>코드명</th>
                            <th>상태</th>
                            {level > 1 && <th>순위</th>}
                        </tr>
                    </thead>

                    <tbody>
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={level > 1 ? 4 : 3} className="colGray2 ftSize12">
                                    {level === 1
                                        ? "대분류 목록이 없습니다."
                                        : level === 2
                                            ? "중분류를 선택해 주세요."
                                            : "소분류를 선택해 주세요."}
                                </td>
                            </tr>
                        )}

                        {data.map((item) => (
                            <tr key={item.code_IDX}>
                                <td>{item.code_ID}</td>
                                <td>
                                    <a href="#" href="#"
                                        onClick={() => onSelect(item)}
                                        className="linkBtn"
                                    >
                                        {item.code_NM}
                                    </a>
                                </td>
                                <td>{item.code_STS === 1 ? "사용" : "미사용"}</td>

                                {level > 1 && (
                                    <td>
                                        <a href="#"><img src="/images/icon/ic_arrow_u.gif" alt="▲" /></a>
                                        <a href="#"><img src="/images/icon/ic_arrow_d.gif" alt="▼" /></a>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 입력 폼 */}
            <div className="pdT10">
                <table className="tableView">
                    <tbody>
                        <tr>
                            <th>코드명</th>
                            <td colSpan="3">
                                <input
                                    type="text"
                                    value={form.name || ""}
                                    onChange={(e) => onFormChange("name", e.target.value)}
                                />
                            </td>
                        </tr>

                        <tr>
                            <th>코드</th>
                            <td colSpan="3">
                                <input
                                    type="text"
                                    value={form.code || ""}
                                    onChange={(e) => onFormChange("code", e.target.value)}
                                />
                            </td>
                        </tr>

                        <tr>
                            <th>사용 여부</th>
                            <td colSpan="3">
                                <label>
                                    <input
                                        type="radio"
                                        checked={form.use === 1}
                                        onChange={() => onFormChange("use", 1)}
                                    />
                                    사용
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        checked={form.use === 0}
                                        onChange={() => onFormChange("use", 0)}
                                    />
                                    미사용
                                </label>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* 버튼 */}
            <div className="pdT10 btnRight">
                <a href="#" className="btn btnBlue" onClick={onSave}>
                    추가
                </a>
                <a href="#" className="btn btnWhite" onClick={onCancel}>
                    취소
                </a>
            </div>
        </section>
    );
}

export default CategoryPanel;