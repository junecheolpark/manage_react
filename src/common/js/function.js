import { api } from "api/api";

/**
 * 레이어 팝업 열기/닫기 제어
 * @param {string} id - 팝업 ID
 * @param {boolean} show - true면 열기, false면 닫기
 */
export function fnLayerPopupView(id, show = true) {
    const el = document.getElementById(id);
    if (!el) return;

    const popup = el.querySelector(".autoSizeLayer");
    const popupBg = el.querySelector(".autoSizeLayerBg");

    if (show) {
        // 초기 상태 세팅
        el.style.display = "block";
        el.style.opacity = "0";
        el.style.transition = "opacity 0.5s ease";

        // fadeIn 효과
        requestAnimationFrame(() => {
            el.style.opacity = "1";
        });

        document.body.style.overflow = "hidden";

        if (popup) {
            const contsHeight = popup.offsetHeight;
            const totalHeight = el.offsetHeight;
            const margin = Math.max((totalHeight - contsHeight) / 2, 50);
            popup.style.margin = `${margin}px auto`;
        }
        if (popupBg) popupBg.style.overflowY = "auto";
    } else {
        // fadeOut 효과
        el.style.transition = "opacity 0.5s ease";
        el.style.opacity = "0";
        document.body.style.overflow = "auto";
        if (popupBg) popupBg.style.overflowY = "hidden";

        // 0.3초 뒤 display:none 적용 (애니메이션 끝난 후)
        setTimeout(() => {
            el.style.display = "none";
        }, 300);
    }
}

/**
* 년도 설정
* @param {number} stYear : 시작 년도
* @param {number} addYear : 현재 년도 기준 + addYear
* @param {boolean} blBlank : 선택 option 추가함/추가 안함 (true, false)
* @param {string} txt : 년도 숫자 뒤에 붙일 텍스트
 */
export function fnSelYear(stYear, addYear, blBlank, txt) {
	const arr = [];
	const date = new Date();
	const year = date.getFullYear();

	 // 선택 항목 (옵션)
    if (blBlank) arr.push({ value: 0, label: "선택" });

    // stYear부터 현재년도+addYear까지
    for (let i = stYear; i <= year + addYear; i++) {
        arr.push({ value: i, label: `${i}${txt}` });
    }

    return arr; // 배열 반환

}

/**
 * 입력 검증 함수
 * @param {string|number} value 입력값
 * @param {string} label 필드명 (ex: "아이디", "비밀번호")
 * @param {string} type 검사유형 ('select', 'num' 등)
 * @returns {boolean} true = 통과 / false = 실패
 */
export const fnAlertReturn = (value, label, type) => {
    const trimmed = String(value ?? "").trim();
    // 숫자만 허용하는 헬퍼
    const onlyNumeric = (val) => /^[0-9]+$/.test(val);

    if (type === "select") {
        if (trimmed === "" || trimmed === "0") {
            alert(`${label}을(를) 선택해 주세요.`);
            return false;
        }
    } else {
        if (trimmed === "") {
            alert(`${label}을(를) 입력해 주세요.`);
            return false;
        }

        if (type === "num") {
            const numericValue = trimmed.replace(/\./g, "").replace(/,/g, "");
            if (!onlyNumeric(numericValue)) {
                alert(`${label}은(는) 숫자만 입력해 주세요.`);
                return false;
            }
        }
    }

    return true;
};

/**
 * 코드 목록
 * 0 : 목록 구분 - 1:숫자형, 2:문자형
 * 1 : 상위 idx
 * 2 : 상위 id
 * 3 : option default text
 * 4 : option default value
 * 5 : option default show/hide
 * 6 : selected value
 */
export const fnCodeSelList = async (arr) => {
  const [_, pidx, cid, placeholder, defaultVal] = arr;

    const paramMap = {
        params: { pidx: pidx, cid: cid, cnm: "" },
    };


  try {
    const res = await api.get("/common/codeSelList", paramMap);

    const regData = res.data;
    let options = [];

    // 기본 option
    options.push({ value: defaultVal, id: "", label: placeholder });

    if (regData.length === 0) {
      options.push({ value: defaultVal, id: "", label: "no data" });
    } else {
      regData.forEach((val) => {
        options.push({
          value: val.code_IDX,
          id: val.code_ID,
          label: val.code_NM,
        });
      });
    }

    return options;
  } catch (err) {
    console.error("Error:", err);
    return [{ value: defaultVal, id: "", label: "Error!" }];
  }
};