'use server'
import axios from 'axios';
import { redirect } from 'next/navigation';
import { cookies, headers } from 'next/headers';

export async function setUserCookies(name:string, token:any){
    cookies().set(name, token,{ httpOnly: true, maxAge: 60 * 60 * 24 * 7,})
    return console.log('sucesso')
}


export async function getUserCookies(){
    const useCookies = cookies()
    const token = useCookies.get('user')   
    if (!token) {
        return null;
      } 
      const response = await axios.post("http://localhost:3000/getuser", {token:token.value}, {
        headers: {
          'authorization': `Bearer ${token.value}`
        }
      });
      
    if (response.data == 401) {
    deleteUserCookies()
    console.error("Token Invalido ou expirado.")
    return  redirect('/Login')
    }

    return response.data
    
}


export async function deleteUserCookies(){
    cookies().delete('user')
}

