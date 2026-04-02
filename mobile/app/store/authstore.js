import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";

export const useAuthStore = create((set) => ({
    user:null,
    token:null,
    isAuthenticated:false,
    role:null,
    loading:false,
    error:null,
    
    register:async(name, email, password, role)=>{
        try{
            set({loading:true,error:null})
            const res=await api.post('/auth/signup',{name, email, password, role})
            await AsyncStorage.setItem('token',res.data.token)
            set({user:res.data.user,token:res.data.token,isAuthenticated:true,role:res.data.user.role})
            return {success:true}
        }catch(err){
            const errorMsg = err.response?.data?.message || err.message;
            set({error:errorMsg,loading:false})
            return {success:false,error:errorMsg}
        }
    },
    login:async(email,password)=>{
        try{
            set({loading:true,error:null})
            const res=await api.post('/auth/login',{email,password})
            await AsyncStorage.setItem('token',res.data.token)
            set({user:res.data.user,token:res.data.token,isAuthenticated:true,role:res.data.user.role,loading:false})
            return {success:true, role: res.data.user.role}
        }catch(err){
            const errorMsg = err.response?.data?.message || err.message;
            set({error:errorMsg,loading:false})
            return {success:false,error:errorMsg}
        }
    },
    logout:async()=>{
        await AsyncStorage.removeItem('token')
        set({user:null,token:null,isAuthenticated:false,role:null,loading:false,error:null})
    },
    loadUser:async()=>{
        try{
            set({loading:true,error:null})
            const token=await AsyncStorage.getItem('token')
            if(token){
                set({token,isAuthenticated:true})
            }
            set({loading:false})
        }catch(err){
            const errorMsg = err.response?.data?.message || err.message;
            set({error:errorMsg,loading:false})
            console.log(err)
        }
    }
    
}))