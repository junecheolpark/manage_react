import style from './css/login.module.css'
const Login = () => {

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
                    <p>아이디어를<br /><span class="ftBold colPoint">구체화하는 힘,<br /> 박준철</span>입니다. </p>
                </section>

                <section className={style.login} id="login">
                    <section>
                        <img src="/images/login/logo.png" alt="junecheol" />
                        <p>LOGIN</p>

                        <input type="text" className="mgB20" id="txtID" placeholder="아이디를 입력해주세요." maxLength="100" />

                        <input type="password" className="mgB20" id="txtPW" placeholder="비밀번호를 입력해주세요." maxLength="100" />

                        <a href="#login" id="btnLogin" className={style.loginBtn}>
                            로그인
                        </a>
                    </section>
                </section>
            </section>
        </>
    )
}

export default Login;