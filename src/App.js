import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from 'page/login/Login';
import 'common/css/common.css';


function App() {
  // 로그인시
  if (true) {
    return (
      <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />}></Route>
            <Route path="/report/01" element={<Login />}></Route>
            <Route path="/schedule/01" element={<Login />}></Route>
            <Route path="/user/01" element={<Login />}></Route>
            <Route path="/clipboard/01" element={<Login />}></Route>
            <Route path="/clipboard/02" element={<Login />}></Route>
            <Route path="/clipboard/03" element={<Login />}></Route>
            <Route path="/system/01" element={<Login />}></Route>
            <Route path="/system/02" element={<Login />}></Route>
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
