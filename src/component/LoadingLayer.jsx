import { useLoading } from "context/LoadingContext";

function LoadingLayer() {
    const { isLoading } = useLoading();
    if (!isLoading) return null;

    return (
        <section className="loading-layer">
            <div className="loadingBg"></div>
            <div className="loadingImg">
                <img src="/images/loading.svg" alt="로딩중..." />
            </div>
        </section>
    )
}
export default LoadingLayer;