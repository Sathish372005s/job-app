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
            await AsyncStorage.setItem('user',JSON.stringify(res.data.user))
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
            await AsyncStorage.setItem('user',JSON.stringify(res.data.user))
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
        await AsyncStorage.removeItem('user')
        set({user:null,token:null,isAuthenticated:false,role:null,loading:false,error:null})
    },
    loadUser:async()=>{
        try{
            set({loading:true,error:null})
            const token=await AsyncStorage.getItem('token')
            const userStr=await AsyncStorage.getItem('user')
            if(token && userStr){
                const user = JSON.parse(userStr)
                set({token, user, role: user.role, isAuthenticated:true})
            }
            set({loading:false})
        }catch(err){
            const errorMsg = err.response?.data?.message || err.message;
            set({error:errorMsg,loading:false})
            console.log(err)
        }
    },
    updateprofile:async(profileData)=>{
        try {
          set({loading:true,error:null})
          const res = await api.put('/auth/updateprofile', profileData)
          await AsyncStorage.setItem('user',JSON.stringify(res.data.user))
          set({user:res.data.user,loading:false})
          return {success:true}  
        } catch (error) {
          const errorMsg = error.response?.data?.message || error.message;
          set({error:errorMsg,loading:false})
          return {success:false,error:errorMsg}
        }
    }
}))