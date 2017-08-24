import { createStore, applyMiddleware, combineReducers,compose } from 'redux'
import redux_thunk from 'redux-thunk'


const initialState = {
    a: 1,
    b:'Hello'
}
const CHANGE_NUMBER = `CHANGE_NUMBER`
const ADD_STRING = `ADD_STRING`

const a = (state = 0, action) =>     
    (action.type === CHANGE_NUMBER) ? action.payload :state
            
const b = (state = 'Hello', action) => 
    (action.type === ADD_STRING)?state.concat(action.payload):state    

const reducer = combineReducers({ a, b })


const reduxThunk = ({ dispatch, getState }) => next => action => {
    if (typeof action == 'function') {

        return action(dispatch,getState)
    }

    return next(action)
}

const logger1 = store => next => action => {
    console.log('logger1 start');
    return next(action)
}

const logger2 = store => next => action => {
    console.log('logger2 start');
    return next(action)
}

const enhancer1 = createStore => (reducer, preloadeState,enhancer) => {
    const store = createStore(reducer,preloadeState,enhancer)
        
    const dispatch = action => {
        console.log('enhancer1 disptch');
        store.dispatch(action)
    }
    
    console.log('enhancer1');
    
    return Object.assign({},store,{dispatch})
}

const enhancer2 = createStore => (reducer, preloadeState, enhancer) => {
    const store = createStore(reducer, preloadeState, enhancer)

    const dispatch = action => {
        console.log('enhancer2 dispatch');
        store.dispatch(action)

    }
    console.log('enhancer2');

    return Object.assign({}, store, { dispatch })
}

// const store = applyMiddleware( reduxThunk,logger1, logger2 )(createStore)(reducer, initialState)
const store = createStore(
    reducer,
    initialState,
    compose(
        applyMiddleware(reduxThunk, logger1, logger2),
        enhancer2,
        enhancer1,
    )
)

//一定要放在dispatch前面
store.subscribe(() => console.log(store.getState()))


const asnyDispatch = () => (dispatch, getState) => {
    dispatch({
        type: CHANGE_NUMBER,
        payload:5
    })
    setTimeout(() => {
        dispatch({
            type: ADD_STRING,
            payload:'World'
        })
    },1000)
}

store.dispatch(
    asnyDispatch()
)

