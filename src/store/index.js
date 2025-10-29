import { combineReducers } from 'redux'; // 하나의 root reducer만 받음
import authUser from './authUser'; // reducer 모듈
// import todos from './todos';    // reducer 모듈
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage/session"; // session storage

const persistConfig = {
    key: "react",
    storage,
};

const rootReducer = combineReducers({
    authUser,
    // todos
});

export default persistReducer(persistConfig, rootReducer);