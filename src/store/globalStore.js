import {configureStore} from "@reduxjs/toolkit"
import userSliceReducer from "./userSlice"

const globalStore=configureStore({
    reducer:{
        user:userSliceReducer
    }
})

export default globalStore