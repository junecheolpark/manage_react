import { isEmpty } from 'common/js/function';

/**
 * CategoryPanel 컴포넌트 Props 설명
 * 
 * @param {string} title - 패널 제목 (예: "대분류", "중분류", "소분류")
 * @param {number} level - 현재 카테고리 레벨 (1 = 대분류, 2 = 중분류, 3 = 소분류)
 * @param {Array<Object>} list - 현재 레벨에 해당하는 카테고리 목록 데이터 (레벨 1이상은 최소 클릭분류값 불러옴 )
 * @param {Object} form - 현재 입력 폼의 상태 (cnm, cid, csts 등 입력 값 저장 객체)
 * @param {Function} onSelect - 리스트에서 항목을 클릭했을 때 다음 레벨의 카테고리를 로딩하는 기능
 * @param {Function} onFormChange - 입력 폼 값이 변경될 때 실행되는 함수
 * @param {Function} onSave - "추가" 또는 "수정" 버튼 클릭 시 실행되는 함수 (입력한 폼 데이터를 서버로 전송하는 역할)
 * @param {Function} onCancel - "취소" 버튼 클릭 시 실행되는 함수 (해당 레벨 및 하위 레벨의 입력/목록 상태를 초기화)
 */
const CategoryPanel = ({
    title,
    level,
    list = [],
    form,
    onSelect,
    onFormChange,
    onSave,
    onCancel,
}) => {
    const safeList = isEmpty(list) ? [] : list;

    return (
        <section className="shadowBox">
            <div className="tableTitle pdB10">
                <p className="ftBold">&nbsp;{title}</p>
            </div>

            {/* 리스트 */}
            <div className="DivScrollY AllBorder" style={{ height: 500 }}>
                <table className="tableList">
                    <colgroup>
                        <col style={{ width: "20%" }} />
                        <col style={{ width: "60%" }} />
                        <col style={{ width: "20%" }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>코드</th>
                            <th>코드명</th>
                            <th>상태</th>
                            {level > 1 && <th>순위</th>}
                        </tr>
                    </thead>

                    <tbody>
                        {(
                            (safeList.length <= 1)
                        ) && (
                                <tr>
                                    <td colSpan={level > 1 ? 4 : 3} className="colGray2 ftSize12">
                                        {safeList.length === 0 ? (
                                            level === 1
                                                ? "대분류 목록이 없습니다."
                                                : level === 2
                                                    ? "대분류를 선택해 주세요."
                                                    : "중분류를 선택해 주세요."
                                        ) : (
                                            level === 1
                                                ? "대분류 목록이 없습니다." :
                                                "검색된 내용이 없습니다."
                                        )}
                                    </td>
                                </tr>
                            )}

                        {(level === 1 ? safeList : safeList.slice(1)).map((item) => (
                            <tr key={item.code_IDX}>
                                <td>{item.code_ID}</td>
                                <td onClick={() => onSelect(item)}>
                                    <a href="#" className="linkBtn">
                                        {item.code_NM}
                                    </a>
                                </td>
                                <td>{item.code_STS === 1 ? "사용" : "미사용"}</td>

                                {level > 1 && (
                                    <td>
                                        <a href="#"><img src="/images/icon/ic_arrow_u.gif" alt="▲" /></a>
                                        <br/>
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
                                    value={form.cnm || ""}
                                    onChange={(e) => onFormChange("cnm", e.target.value)}
                                />
                            </td>
                        </tr>

                        <tr>
                            <th>코드</th>
                            <td colSpan="3">
                                <input
                                    type="text"
                                    value={form.cid || ""}
                                    onChange={(e) => onFormChange("cid", e.target.value)}
                                    placeholder={level !== 1 && !isEmpty(list) ? "코드 뒤 숫자만 입력해주세요." : ""}
                                    readOnly={form.cidx === 0 ? false : true}
                                />
                            </td>
                        </tr>

                        <tr>
                            <th>사용 여부</th>
                            <td colSpan="3">
                                <label>
                                    <input
                                        type="radio"
                                        checked={form.csts === 1}
                                        onChange={() => onFormChange("csts", 1)}
                                    />
                                    사용
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        checked={form.csts === 0}
                                        onChange={() => onFormChange("csts", 0)}
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
                <a href="#" className="btn btnBlue" onClick={onSave}
                    style={{ display: level !== 1 && isEmpty(list) ? 'none' : 'inline-block' }}
                >
                    {form.cidx === 0 ? '추가' : '수정'}
                </a>
                <a href="#" className="btn btnWhite" onClick={onCancel}>
                    취소
                </a>
            </div>
        </section>
    );
}

export default CategoryPanel;