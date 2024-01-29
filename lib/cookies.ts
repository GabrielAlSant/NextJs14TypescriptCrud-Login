'use server'
import axios from 'axios';
import { cookies, headers } from 'next/headers';

export async function setUserCookies(name:string, token:any){
    cookies().set(name, token,{ httpOnly: true, maxAge: 60 * 60 * 24 * 7,})
    return console.log('sucesso')
}


export async function getUserCookies(){
    const useCookies = cookies()
    const token = useCookies.get('user')   
    if (!token) {
        console.error("Cookie não encontrado.");
        return null;
      } 
      console.log(token.value)
      const response = await axios.post("http://localhost:3000/getuser", null, {
        headers: {
          'authorization': `Bearer ${token.value}`
        }
      });
    return response.data

}


export async function deleteUserCookies(){
    cookies().delete('user')
}

