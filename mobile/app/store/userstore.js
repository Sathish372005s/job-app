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
    myapplications:[],
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
            const {singlejob}=get();
            return {success:true}
        } catch (error) {
            
        }
    },
    applyjob: async(jobId,userid,resume) =>{
        try {
            set({ loading: true, error: null });
            
            const formData = new FormData();
            formData.append("jobId", jobId);
            formData.append("userid", userid);
            
            if (resume && resume.uri) {
                // Determine file type from URI or fallback to pdf
                const ext = resume.name ? resume.name.split('.').pop() : 'pdf';
                const fileType = resume.mimeType || `application/${ext}`;
                
                formData.append("resume", {
                    uri: resume.uri,
                    name: resume.name || `resume.${ext}`,
                    type: fileType
                });
            }
            const res = await api.post("/application/apply", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            
            set({ loading: false });
            return {success:true}
        } catch (error) {
            console.error("Apply job error detail:", typeof error === 'object' ? JSON.stringify(error?.response || error) : error);
            set({ error: error?.message, loading: false });
            return {success:false, message: error?.response?.data?.message || "Something went wrong. Please check your connection or file size."}
        }
    },
    getmyapplications: async() =>{
        try {
            console.log("Fetching my applications...");
            set({ loading: true, error: null });
            const result = await api.get("/application/my")
            console.log("Applications Response:", result.data.applications);
            set({ myapplications: result.data.applications, loading: false });
            console.log("Updated state:", get().myapplications);
            return { success: true };
        } catch (error) {
            set({ error: error.message, loading: false });
            return { success: false };
        }
    }
}))