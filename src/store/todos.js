/* 액션 타입 선언 */
const USER_LOGIN = 'todos/USER_LOGIN';
const USER_LOGOUT = 'todos/USER_LOGOUT';

/* 액션 생성함수 선언 */
export const user_login = () => ({
    type: USER_LOGIN,
    todo: {
    id: '',
    }
});

export const user_logout = () => ({
    type: USER_LOGOUT,
    isLogin : false
});

/* 초기 상태 선언 */
// 리듀서의 초기 상태는 꼭 객체타입일 필요 없습니다.
// 배열이여도 되고, 원시 타입 (숫자, 문자열, 불리언 이여도 상관 없습니다.
const initialState = [
    {
        idx: 0,
        name: '',
        id: '',
        role: '',
        isLogin: false,
    }
];

export default function todos(state = initialState, action) {
    switch (action.type) {
      case USER_LOGIN:
        return state.concat(action.todo);
      case USER_LOGOUT:
        return initialState;
      default:
        return state;
    }
  }