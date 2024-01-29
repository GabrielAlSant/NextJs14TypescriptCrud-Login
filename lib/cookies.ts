'use server'
import axios from 'axios';
import id from 'date-fns/locale/id';
import { cookies } from 'next/headers';

export async function setUserCookies(name:string, data:any){
    cookies().set(name, data,{ httpOnly: true, maxAge: 60 * 60 * 24 * 7,})
    return console.log('sucesso')
}


export async function getUserCookies(){
    const useCookies = cookies()
    const userId = useCookies.get('user')   
    if (!userId) {
        console.error("Cookie não encontrado.");
        return null;
      } 
    const response = await axios.post("http://localhost:3000/getuser", {id : userId!.value} );
    return response.data

}


export async function deleteUserCookies(){
    cookies().delete('user')
}

