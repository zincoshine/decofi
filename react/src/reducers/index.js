import {combineReducers} from "redux";
import web3Reducer from './web3Reducer';
import decofiUserReducer from './decofiUserReducer';
import decofiAdminReducer from './decofiAdminReducer';


export default combineReducers({
    web3Reducer,
    decofiUserReducer,
    decofiAdminReducer,
});
