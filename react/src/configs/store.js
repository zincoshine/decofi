import { createStore, applyMiddleware } from 'redux';
import {persistStore, persistReducer, createMigrate} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunkMiddleware from 'redux-thunk';

import combinedReducers from 'reducers';


const migrations = {
    0: (state) => {
        window.localStorage.clear();
    }
};

const persistConfig = {
    key: 'primary',
    version:0,
    storage,
    migrate: createMigrate(migrations)
};

const persistedReducer = persistReducer(persistConfig, combinedReducers);

export default () => {
    let store = createStore(persistedReducer,{}, applyMiddleware(thunkMiddleware));
    let persistor = persistStore(store);
    return { store, persistor }
}
