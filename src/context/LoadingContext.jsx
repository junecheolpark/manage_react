/*
✅ 정리: 로딩 관리의 3가지 수준
수준	                                설명	                                                       추천 방법
1. 페이지 내부 로딩                     특정 컴포넌트만 로딩 필요 (ex: 목록 불러오기, 버튼 클릭 후 로딩)	useState 로컬 상태 ✅
2. 페이지 전체 로딩 (전역 공통 UI)	    모든 페이지에서 API 호출 시 로딩 레이어 띄우기	                    Context (LoadingContext) ✅
3. 전역 로딩 + 복잡한 흐름 (다중 API등)	Redux Thunk, Saga 같이 상태가 여러 모듈에 걸쳐 있을 때              Redux 관리 ✅
*/

import { createContext, useContext, useState } from "react";

const LoadingContext = createContext();
export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};