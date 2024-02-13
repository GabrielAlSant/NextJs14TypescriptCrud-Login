'use client'
import Link from "next/link"
import { useUser } from '@/AuthContext/useContext';
import Image from "next/image";
import { useEffect } from "react";
import { getUserCookies } from "@/lib/cookies";
import img from '@/img/logout.png'
import logo from '@/app/assets/baiacu.png'
import {LogOut } from 'lucide-react'

export default function Header(){
    const { user } = useUser();
    const {logout} = useUser()
    const {login} = useUser()

    useEffect(() => {
      const fetchData = async () => {
        const userdatacookie = await getUserCookies();
        login(userdatacookie);
      };
      fetchData();
    }, []);

    return(
        <header className="flex justify-center bg-violet-950 text-violet-50 h-16 top-3">
           <Link href='/'><h2 className="flex font-semibold tracking-tight text-4xl mt-2 -ml-16"><Image className="-mt-1" src={logo} width={50} height={50} alt="Logo" /><span className="ml-1">Baiacu</span></h2></Link>
            <ul className="flex top-3 mx-32">
                
                <Link href='/Users'><li className="p-5">Usuarios</li></Link>
                <Link href='AddUser'><li className="p-5">Cadastrar</li></Link>  
                <Link href='Post'><li className="p-5">Posts</li></Link>         
                <Link href='AddPost'><li className="p-5">Add Posts</li></Link>         
            </ul>
            {user ? (
         <div className="flex min-w-0 gap-x-4 mt-2">
         <Image
           src={user.img as string}
           width={50}
           height={50}
           alt={user.name as string}
           className="h-12 w-12 flex-none rounded-full bg-gray-50"
         />
        <div className="min-w-0 flex-auto">
        <Link href='/UserPerfil'><p className="text-sm font-semibold leading-6 text-violet-50">{user.name}</p></Link>
        <div className="truncate  text-violet-500" onClick={logout}><LogOut /></div>
       </div>
      </div>
        
        
      ) : (
        <Link href='/Login'><div className="p-4">Login</div></Link>
      )}
        </header>
    )
}



