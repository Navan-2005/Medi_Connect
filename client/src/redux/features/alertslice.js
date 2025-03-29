import {createSlice} from '@reduxjs/toolkit';

export const alertslice=createSlice({
    name:'alert',
    initialState:{
        loading:false
    },
    reducers:{
        showLoading:(state)=>{
            state.loading=true
        },
        hideLoading:(state)=>{
            state.loading=false;
        }
    }
})

export const {showLoading,hideLoading}=alertslice.actions

export default alertslice.reducer