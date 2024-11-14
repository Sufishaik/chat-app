import { HOST } from "@/utlis/constant"
import axios from "axios"
export const apiClient = axios.create({
    baseURL: HOST
}) 