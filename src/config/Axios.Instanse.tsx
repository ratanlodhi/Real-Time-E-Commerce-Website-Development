import axios from "axios";

export const axiosInstanse=axios.create({baseURL:import.meta.env.VITE_BACKEND, withCredentials:true})