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