
/* ojDiv : id
 * totalCount : 총 게시물 수
 * tableLimit : 네비게이션 숫자 
 * pNowPage : 현재페이지
 * onPageChange : 이동할페이지
 */

function Pagination({ totalCount, tableLimit, curPage, onPageChange }) {
    // 전체 게시물 수(totalCount) 기준으로 페이지 계산 및 페이지 이동을 제어하는 부분
    if (totalCount <= 0) return null; 
    // 총 페이지 수 = 총 게시물 수 ÷ 한 페이지당 표시할 개수(tableLimit)
    const totalPages = Math.ceil(totalCount / tableLimit);

    // 한 번에 보여줄 페이지 번호 개수 (예: 1~10, 11~20)
    const blockSize = 10;

    // 현재 페이지(curPage)가 속한 블록 계산
    // 예: 현재 페이지가 13이면, Math.floor((13 - 1)/10) = 1 → 2번째 블록(11~20)
    const currentBlock = Math.floor((curPage - 1) / blockSize);

    // 현재 블록의 첫 페이지 번호 (예: 11)
    const startPage = currentBlock * blockSize + 1;

    // 현재 블록의 마지막 페이지 번호 (예: 20 또는 전체 페이지 수를 넘지 않게 제한)
    const endPage = Math.min(startPage + blockSize - 1, totalPages);

    // 페이지 버튼 클릭 시 실행되는 함수
    const handlePageChange = (page) => {
        // 페이지 번호가 범위를 벗어나면 무시
        if (page < 1 || page > totalPages) return;

        // 상위 컴포넌트로 페이지 변경 이벤트 전달 (리스트 새로 불러오기 등)
        onPageChange(page);
    };

    return (
        <section className="paging" id="pagingView">
            {/* 처음 페이지 */}
            <button
                className={`img brNo ${curPage === 1 ? "no" : ""}`}
                onClick={() => handlePageChange(1)}
                disabled={curPage === 1}
            >
                <img
                    src={
                        curPage === 1
                            ? "/images/btn/paging_first_n.gif"
                            : "/images/btn/paging_first.gif"
                    }
                    alt="first"
                />
            </button>

            {/* 이전 블록 */}
            <button
                className={`img ${startPage > 1 ? "" : "no"}`}
                onClick={() => handlePageChange(startPage - 1)}
                disabled={startPage <= 1}
            >
                <img
                    src={
                        startPage > 1
                            ? "/images/btn/paging_prev.gif"
                            : "/images/btn/paging_prev_n.gif"
                    }
                    alt="before"
                />
            </button>

            {/* 페이지 번호 */}
            {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
                const page = startPage + i;
                return (
                    <button
                        key={page}
                        className={page === curPage ? "on" : ""}
                        onClick={() => handlePageChange(page)}
                    >
                        {page}
                    </button>
                );
            })}

            {/* 다음 블록 */}
            <button
                className={`img brNo ${endPage < totalPages ? "" : "no"}`}
                onClick={() => handlePageChange(endPage + 1)}
                disabled={endPage >= totalPages}
            >
                <img
                    src={
                        endPage < totalPages
                            ? "/images/btn/paging_next.gif"
                            : "/images/btn/paging_next_n.gif"
                    }
                    alt="next"
                />
            </button>

            {/* 마지막 페이지 */}
            <button
                className={`img ${curPage === totalPages ? "no" : ""}`}
                onClick={() => handlePageChange(totalPages)}
                disabled={curPage === totalPages}
            >
                <img
                    src={
                        curPage === totalPages
                            ? "/images/btn/paging_last_n.gif"
                            : "/images/btn/paging_last.gif"
                    }
                    alt="last"
                />
            </button>
        </section>
    );
}
export default Pagination;