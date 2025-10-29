import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from 'page/login/Login';
import Main from 'page/main/Main';
import Report_01 from 'page/report/Report_01';
import Schedule_01 from 'page/schedule/Schedule_01';
import User_01 from 'page/user/User_01';
import Board_01 from 'page/board/Board_01';
import Board_02 from 'page/board/Board_02';
import Board_03 from 'page/board/Board_03';
import System_01 from 'page/system/System_01';
import System_02 from 'page/system/System_02';

import HeaderLayout from 'component/layout/HeaderLayout';
import HeadLeftLayout from 'component/layout/HeadLeftLayout';

import 'common/css/common.css';


function App() {
  // 로그인시
  if (true) {
    return (
      <>
        <BrowserRouter>
          <Routes>

            <Route element={<HeaderLayout />}>
              <Route path="/" element={<Main />}></Route>
            </Route>

            <Route element={<HeadLeftLayout />}>
              <Route path="/report/01" element={<Report_01 />}></Route>
              <Route path="/schedule/01" element={<Schedule_01 />}></Route>
              <Route path="/user/01" element={<User_01 />}></Route>
              <Route path="/board/01" element={<Board_01 />}></Route>
              <Route path="/board/02" element={<Board_02 />}></Route>
              <Route path="/board/03" element={<Board_03 />}></Route>
              <Route path="/system/01" element={<System_01 />}></Route>
              <Route path="/system/02" element={<System_02 />}></Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </>
    );
  } else {
    return (
      <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />}></Route>
          </Routes>
        </BrowserRouter>
      </>
    );
  }
}

export default App;
