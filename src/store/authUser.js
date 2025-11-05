/* 액션 타입 만들기 */
const USER_LOGIN = 'USER_LOGIN';
const USER_LOGOUT = 'USER_LOGOUT';

/* 액션 생성함수 만들기 */
export const userLogin = (basicAdminInfo) => ({ type: USER_LOGIN, adminInfo: basicAdminInfo });
export const userLogout = () => ({ type: USER_LOGOUT });

// 초기 상태 선언
/***
 * @param { _c_logIdx : Int , _c_logSign  : Int , _c_logCIdx : Int , _c_logAdTp : Int , _c_logNmCnt : Int , _c_logUNmCnt : Int, _c_logImgNum : Int
 * , _c_logNm : String , _c_logMobile : String , _c_logPhone : String , _c_logEmail : String , _c_logPosi : String , _c_logDept : String , isLogin : Boolean }
 */
const initialState = {
  _c_logIdx: 0,
  _c_logSign: 0,
  _c_logCIdx: 0,
  _c_logNm: '',
  _c_logMobile: '',
  _c_logPhone: '',
  _c_logEmail: '',
  _c_logPosi: '',
  _c_logDept: '',
  _c_logAdTp: 0,
  _c_logNmCnt: 0,
  _c_logUNmCnt: 0,
  _c_logImgNum: 0,
  isLogin: false,
};

// 리듀서 선언
export default function counter(state = initialState, action) {
  switch (action.type) {
    case USER_LOGIN:
      return {
        _c_logIdx: action.adminInfo._c_logIdx,
        _c_logSign: action.adminInfo._c_logSign,
        _c_logCIdx: action.adminInfo._c_logCIdx,
        _c_logNm: action.adminInfo._c_logNm,
        _c_logMobile: action.adminInfo._c_logMobile,
        _c_logPhone: action.adminInfo._c_logPhone,
        _c_logEmail: action.adminInfo._c_logEmail,
        _c_logPosi: action.adminInfo._c_logPosi,
        _c_logDept: action.adminInfo._c_logDept,
        _c_logAdTp: action.adminInfo._c_logAdTp,
        _c_logNmCnt: action.adminInfo._c_logNmCnt,
        _c_logUNmCnt: action.adminInfo._c_logUNmCnt,
        _c_logImgNum: action.adminInfo._c_logImgNum,
        isLogin: true,
      }
    case USER_LOGOUT:
      return {
        _c_logIdx: 0,
        _c_logSign: 0,
        _c_logCIdx: 0,
        _c_logNm: '',
        _c_logMobile: '',
        _c_logPhone: '',
        _c_logEmail: '',
        _c_logPosi: '',
        _c_logDept: '',
        _c_logAdTp: 0,
        _c_logNmCnt: 0,
        _c_logUNmCnt: 0,
        _c_logImgNum: 0,
        isLogin: false,
      };
    default:
      return state;
  }
}