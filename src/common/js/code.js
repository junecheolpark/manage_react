// 휴가 사용률
export const fnVacationUsageRate = (pVal) => {
    /*
        0 ~ 30 빨강
        30 ~ 60 파랑
        60 ~ 90 초록
        90 ~ 100 검정
        */
    if (pVal < 30) return "colRed";
    if (pVal < 60) return "colBlue";
    if (pVal < 90) return "colGreen2";
    return "";
}

// 일정관리 색상
export const fnScheduleTp = (pVal) => {
    /*
    26	"공휴일"
    27	"연차"
    29	"반차"
    33	"기타"
    */
    if (pVal === 29) return "colGreen";
    if (pVal === 26) return "colRed";
    return "colBlack";
}
