import axios from "axios"
import { UserProfileToken } from "../models/User";

const api = 'https://facturax.lat/api'

const loginAPI = async (email:string,password:string) =>{
    try {
        const data = await axios.post<UserProfileToken>(api+"/usuarios/login",{
            email:email,
            password:password
        })
    } catch (error) {
        console.log("Ocurrio un error: ",error);
        
    }
}

export default loginAPI