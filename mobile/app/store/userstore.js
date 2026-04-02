import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";

export const useUserStore = create((set) => ({    
    loading:false,
    error:null,
    getalljobs :async()=>{
        try{
            set({loading:true,error:null})
            const res=await api.get('/job/getalljobs')
            set({loading:false})
            return {success:true,jobs:res.data.jobs}
        }catch(err){
            const errorMsg = err.response?.data?.message || err.message;
            set({error:errorMsg,loading:false})
            return {success:false,error:errorMsg}
        }
    }
}))