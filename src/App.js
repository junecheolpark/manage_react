import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { userLogin } from "store/authUser";

import Login from 'page/login/Login';
import Main from 'page/main/Main';
import Report_01 from 'page/report/Report_01';
import Schedule_01 from 'page/schedule/Schedule_01';
import User_01 from 'page/user/User_01';
import Board_01 from 'page/board/Board_01';
import System_01 from 'page/system/System_01';
import System_02 from 'page/system/System_02';

import HeaderLayout from 'component/layout/HeaderLayout';
import HeadLeftLayout from 'component/layout/HeadLeftLayout';
import LoadingLayer from "component/LoadingLayer";

import { LoadingProvider } from "context/LoadingContext";
import 'common/css/common.css';


function App() {
  // a태그 # 링크 기본이동 방지
  useEffect(() => { 
    const handler = (e) => {
      const el = e.target.closest("a");
      if (!el) return;
      const href = el.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault(); // #, #memo 등 모두 방지
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // Redux에서 로그인된 관리자 정보 가져오기
  const adminUser = useSelector(state => state.authUser);

  // 브라우저 localStorage에 저장된 로그인 정보 가져오기 (문자열 → 객체로 변환)
  const localLoginInfo = JSON.parse(localStorage.getItem('loginInfo'));

  // Redux의 dispatch 함수 (액션 실행용)
  const dispatch = useDispatch();

  // 컴포넌트가 마운트되거나 localLoginInfo가 바뀔 때 실행
  useEffect(() => {

    // 조건 1: 현재 Redux 로그인 정보가 없음 (adminIdx === 0)
    // 조건 2: localStorage에 로그인 정보가 존재할 때
    if (adminUser.adminIdx === 0 && localLoginInfo) {
      // 저장된 로그인 정보를 Redux에 다시 넣어서 자동 로그인 처리
      dispatch(userLogin(localLoginInfo));
    }

  }, [localLoginInfo]); // localLoginInfo 값이 변경될 때마다 실행

  // 로그인시
  if (adminUser.isLogin) {
    return (
      <>
        <LoadingProvider>
          <BrowserRouter>
            <LoadingLayer />
            <Routes>

              <Route element={<HeaderLayout />}>
                <Route path="/" element={<Main />}></Route>
              </Route>

              <Route element={<HeadLeftLayout />}>
                <Route path="/report/01" element={<Report_01 />}></Route>
                <Route path="/schedule/01" element={<Schedule_01 />}></Route>
                <Route path="/user/01" element={<User_01 />}></Route>
                <Route path="/board/01" element={<Board_01 />}></Route>
                <Route path="/board/02" element={<Board_01 />}></Route>
                <Route path="/board/03" element={<Board_01 />}></Route>
                <Route path="/system/01" element={<System_01 />}></Route>
                <Route path="/system/02" element={<System_02 />}></Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </LoadingProvider>
      </>
    );
  } else {
    return (
      <>
        <LoadingProvider>
          <BrowserRouter>
            <LoadingLayer />
            <Routes>
              <Route path="/" element={<Login />}></Route>
            </Routes>
          </BrowserRouter>
        </LoadingProvider>
      </>
    );
  }
}

export default App;
