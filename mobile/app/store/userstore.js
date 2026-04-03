import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";

export const useUserStore = create((set) => ({    
    loading:false,
    error:null,
    jobs:[],
      filters: {
        keyword: "",
        location: "",
        minSalary: "",
        maxSalary: "",
        experience: "",
        jobType: "",
        page: 1,
        limit: 5,
        sort: "latest",
    },
    setfilters :(newfilters) =>{
        set((state)=>({
            filters:{...state.filters,...newfilters}
        }))
    },
    resetfilter :()=>{
        set({
            filters:{
                keyword: "",
                location: "",
                minSalary: "",
                maxSalary: "",
                experience: "",
                jobType: "",
                page: 1,
                limit: 5,
                sort: "latest",
            }
        })
    },

    getalljobs :async()=>{
        try{
            set({loading:true,error:null})
            const res=await api.get('/job/getalljobs')
            set({loading:false,jobs:res.data.jobs})
            return {success:true,jobs:res.data.jobs}
        }catch(err){
            const errorMsg = err.response?.data?.message || err.message;
            set({error:errorMsg,loading:false})
            return {success:false,error:errorMsg}
        }
    },
}))