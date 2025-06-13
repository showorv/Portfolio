import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'



const initialState = {
    loading: false,
    user:{},
    isAuthenticated: false,
    error: null,
    message: null,
    isUpdated: false

}
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers:{
        loginRequest(state,action){
            state.loading = true;
            state.isAuthenticated = false
            state.user = {},
            state.error = null
        },
        loginSuccess(state,action){
            state.loading = false;
            state.isAuthenticated = true
            state.user = action.payload
            state.error = null
        },
        loginFailed(state,action){
            state.loading = false
            state.isAuthenticated = false
            state.user = {}
            state.error = action.payload
        },
        loadUserRequest(state,action){
            state.loading = true;
            state.isAuthenticated = false
            state.user = {},
            state.error = null
        },
        loadUserSuccess(state,action){
            state.loading = false;
            state.isAuthenticated = true
            state.user = action.payload
            state.error = null
        },
        loadUserFailed(state,action){
            state.loading = false
            state.isAuthenticated = false
            state.user = {}
            state.error = action.payload
        },
        logoutSuccess(state,action){
            state.loading = false;
            state.isAuthenticated = false
            state.user = {},
            state.error = null
            state.message = action.payload
        },
        logoutFailed(state,action){
            state.loading = false
            state.isAuthenticated = state.isAuthenticated // ja ase tai thkbe
            state.user = state.user
            state.error = action.payload
        },
        //update pass
        updatePasswordRequest(state,action){
            state.loading = true;
            state.isUpdated = false
            state.message = null
            state.error = null
        },
        updatePasswordSuccess(state,action){
            state.loading = false;
            state.isUpdated = true
            state.message = action.payload
            state.error = null
        },
        updatePasswordFailed(state,action){
            state.loading = false;
            state.isUpdated = false
            state.message = null
            state.error = action.payload
        },
        //update profile
        updateUserRequest(state,action){
            state.loading = true;
            state.isUpdated = false
            state.message = null
            state.error = null
        },
        updateUserSuccess(state,action){
            state.loading = false;
            state.isUpdated = true
            state.message = action.payload
            state.error = null
        },
        updateUserFailed(state,action){
            state.loading = false;
            state.isUpdated = false
            state.message = null
            state.error = action.payload
        },
        //reset profile after update

        resetProfileAfterUpdate(state,action){
            state.error = null
            state.isUpdated = false
            state.message = null
        },
        clearAllError(state,action){
            state.error = null
            state.user = state.user
        }
    }
})

export const login = (email,password)=>async(dispatch)=>{
    dispatch(userSlice.actions.loginRequest());

    try {
        
        const {data} = await axios.post(
         "http://localhost:4000/api/v1/user/login", 
        {email,password}, 
        {withCredentials:true, headers:{"Content-Type": "application/json"}}
        );

        dispatch(userSlice.actions.loginSuccess(data.user||data));
        dispatch(userSlice.actions.clearAllError())
        return data;
    } catch (error) {
        dispatch(userSlice.actions.loginFailed(error?.response?.data?.message || "Login failed"));
    }
}
export const getUser = ()=>async(dispatch)=>{
    dispatch(userSlice.actions.loadUserRequest());

    try {
        
        const {data} = await axios.get(
         "http://localhost:4000/api/v1/user/me", 
       
        {withCredentials:true}
        );

        dispatch(userSlice.actions.loadUserSuccess(data.user||data));
        dispatch(userSlice.actions.clearAllError())
        return data;
    } catch (error) {
        dispatch(userSlice.actions.loadUserFailed(error?.response?.data?.message || "get user failed"));
    }
}
export const logout = ()=>async(dispatch)=>{
   

    try {
        
        const {data} = await axios.get(
         "http://localhost:4000/api/v1/user/logout", 
       
        {withCredentials:true}
        );

        dispatch(userSlice.actions.logoutSuccess(data.message||data));
        dispatch(userSlice.actions.clearAllError())
        return data;
    } catch (error) {
        dispatch(userSlice.actions.logoutFailed(error?.response?.data?.message || "logoutfailed"));
    }
}

export const updatePassword = (currentPassword, newPassword, confirmPassword)=>async(dispatch)=>{
    dispatch(userSlice.actions.updatePasswordRequest());

    try {
        
        const {data} = await axios.put(
            "http://localhost:4000/api/v1/user/update/password", 
        {currentPassword, newPassword, confirmPassword}, 
        { 
            withCredentials: true, 
            headers:{"Content-Type": "application/json"}
        })

        dispatch(userSlice.actions.updatePasswordSuccess(data.message || data))
        dispatch(userSlice.actions.clearAllError())
        return data;
    } catch (error) {
        dispatch(userSlice.actions.updatePasswordFailed(error?.response?.data?.message || "update password failed"));
    }
}

export const updateProfile = (data)=>async(dispatch)=>{
    dispatch(userSlice.actions.updateUserRequest());

    try {
        
        const {data} = await axios.put(
            "http://localhost:4000/api/v1/user/update/me", 
       data, 
        { 
            withCredentials: true, 
            headers:{"Content-Type": "application/json"}
        })

        dispatch(userSlice.actions.updateUserSuccess(data.message || data.user || data))
        dispatch(userSlice.actions.clearAllError())
        return data;
    } catch (error) {
        dispatch(userSlice.actions.updatePasswordFailed(error?.response?.data?.message || "update profile failed"));
    }
}

export const resetProfile = ()=>async(dispatch)=>{

    dispatch(userSlice.actions.resetProfileAfterUpdate())
}

export const clearAllErrors = ()=>(dispatch)=>{
    dispatch(userSlice.actions.clearAllError())
}
export default userSlice.reducer;