import React, { useState } from "react";
import { api } from "api/api";
import { userLogin } from "store/authUser";
import { useDispatch } from "react-redux";
import { fnAlertReturn } from 'common/js/function';

import style from './css/login.module.css'
const Login = () => {

    // Redux의 dispatch 함수 가져오기
    // → 액션(userLogin, userLogout 등)을 실행할 때 사용
    const dispatch = useDispatch();
    const [loginInfo, setLoginInfo] = useState({ adminId: 'qwc22', adminPwd: '1234' });

    const getAdminId = (e) => {
        setLoginInfo((prev) => {
            return {
                ...prev,
                adminId: e.target.value.trim(),
            };
        });
    };

    const getAdminPwd = (e) => {
        setLoginInfo((prev) => {
            return {
                ...prev,
                adminPwd: e.target.value.trim(),
            };
        });
    }

    const loginProc = async () => {
        if (!fnAlertReturn(loginInfo.adminId, "아이디", '')) return;
        if (!fnAlertReturn(loginInfo.adminPwd, "비밀번호", '')) return;

        const paramMap = {
            ltp: 1
            , id: loginInfo.adminId
            , pw: loginInfo.adminPwd
            , at_login: false
        };

        const res = await api.post("/login/login", paramMap);
        const regData = res.data;


        if (regData === 0) {
            const rtn = await api.post(`login/loginCok`, {});
            const rntData = rtn.data;
            const userInfo = {
                _c_logIdx: rntData.user_IDX,
                _c_logSign: rntData.sign_TP,
                _c_logCIdx: rntData.company_IDX,
                _c_logNm: rntData.nm,
                _c_logMobile: rntData.mobile,
                _c_logPhone: rntData.phone,
                _c_logEmail: rntData.email,
                _c_logPosi: rntData.posi_NM,
                _c_logDept: rntData.dept_NM,
                _c_logAdTp: rntData.admin_TP,
                _c_logNmCnt: rntData.nomal_CNT,
                _c_logUNmCnt: rntData.use_NOMAL_CNT,
                _c_logImgNum: rntData.user_IMG_NUM,
            };
            localStorage.setItem("loginInfo", JSON.stringify(userInfo));
            dispatch(userLogin(userInfo));
            window.location.href = "/";
        } else {
            alert("회원 정보를 불러오지 못했습니다. 관리자에게 문의하세요.");
        }
    };

    const enterKey = (e) => {
        if (e.keyCode === 13) {
            loginProc();
        }
    };
    
    return (
        <>
            <section className={style.loadingLayer}>
                <div className={style.loadingBg}></div>
                <div className={style.loadingImg}>
                    <img src="/images/loading.png" alt="로딩중..." />
                </div>
            </section>

            {/* <section className="loginCont"> */}
            <section className={style.loginCont}>
                <section className={style.loginBG}>
                    <p>아이디어를<br /><span className="ftBold colPoint">구체화하는 힘,<br /> 박준철</span>입니다. </p>
                </section>

                <section className={style.login} id="login">
                    <section>
                        <img src="/images/login/logo.png" alt="junecheol" />
                        <p>LOGIN</p>

                        <input type="text" className="mgB20" placeholder="아이디를 입력해주세요." value={loginInfo.adminId} onChange={getAdminId} onKeyUp={enterKey} />

                        <input type="password" className="mgB20" placeholder="비밀번호를 입력해주세요." value={loginInfo.adminPwd} onChange={getAdminPwd} onKeyUp={enterKey} />

                        <a href="#login" id="btnLogin" className={style.loginBtn} onClick={loginProc}>
                            로그인
                        </a>
                    </section>
                </section>
            </section>
        </>
    )
}

export default Login;