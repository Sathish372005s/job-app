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
    },
    getjobbyrecruiter:async(id)=>{
        try{
            set({loading:true,error:null})
            const res=await api.get(`/job/getjobbyrecruiter/${id}`)
            set({loading:false})
            return {success:true,jobs:res.data.jobs}
        }catch(err){
            const errorMsg = err.response?.data?.message || err.message;
            set({error:errorMsg,loading:false})
            return {success:false,error:errorMsg}
        }
    },

    deletejob : async(id)=>{
        try {
            set({loading:true,error:null})
            const res=await api.delete(`/job/deletejob/${id}`)
            console.log("this from recruiter store",res.data)
            set({loading:false})
            return {success:true,job:res.data.job}
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message;
            set({error:errorMsg,loading:false})
            return {success:false,error:errorMsg}
        }
    },
    logout : async()=>{
        try {
            set({loading:true,error:null})
            await AsyncStorage.removeItem("token")
            set({loading:false})
            return {success:true}
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message;
            set({error:errorMsg,loading:false})
            return {success:false,error:errorMsg}
        }
    },
    getapplicantbyjob:async(jobid)=>{
        try {
            set({loading:true,error:null})
            const res=await api.get(`/application/getapplicantbyjob/${jobid}`)
            set({loading:false})
            return {success:true,applicants:res.data.applicants}
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            set({error:errorMsg,loading:false})
            return {success:false,error:errorMsg}
        }
    }
}))