import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";

export const useRecruiterStore = create((set)=>({    
    loading:false,
    error:null,
    createjob:async(title,description,location,salary,jobtype,experience,skills,company,status)=>{
        try{
            set({loading:true,error:null})
            const res=await api.post('/job/createjob',{title,description,location,salary,jobtype,experience,skills,company,status})
            set({loading:false})
            return {success:true,job:res.data.job}
        }catch(err){
            const errorMsg = err.response?.data?.message || err.message;
            set({error:errorMsg,loading:false})
            return {success:false,error:errorMsg}
        }
    }
}))