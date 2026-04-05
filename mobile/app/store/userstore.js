import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";

export const useUserStore = create((set, get) => ({    
    loading:false,
    error:null,
    jobs:[],
    singleid : "",
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
    singlejob : null,
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
    setsingleid :(id)=>{
        set({singleid:id})
    },
    getalljobs :async()=>{
       try {
        set({ loading: true, error: null });
        const { filters } = get();
        const queryparams=new URLSearchParams(filters).toString();
        console.log("Query Params:", queryparams);
        const res = await api.get(`/job/filter?${queryparams}`);
        set({ jobs: res.data.jobs, loading: false });
         return { success: true };
       } catch (error) {
        set({ error: error.message, loading: false });
        return { success: false };
       }
    },
    getjobbyid: async(id) =>{
        try {
            console.log(id)
            set({ loading: true, error: null });
            const res =await api.get(`/job/getbyid/${id}`)
            set({ singlejob:res.data.job ,loading: false });
            const {singlejob}=get()
            console.log(singlejob);
            return {success:true}
        } catch (error) {
            
        }
    }
}))