'use client'
import Link from "next/link"
import { useUser } from '@/AuthContext/useContext';
import Image from "next/image";
import { useEffect } from "react";
import { getUserCookies } from "@/lib/cookies";
import img from '@/img/logout.png'

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
        <header>
           <Link href='/'><h2>Bem-Vindo</h2></Link>
            <ul>
                
                <Link href='/Users'><li>Usuarios</li></Link>
                <Link href='AddUser'><li>Cadastrar</li></Link>  
                <Link href='Post'><li>Posts</li></Link>         
                <Link href='AddPost'><li>Add Posts</li></Link>         
            </ul>
            {user ? (
        <div>
        <Image src={user.img as string} width={50} height={50} className="profileImage" alt={user.name as string}></Image>
        <p className="nameuser">{user.name}</p>  
        {''}
        <Image src={img} width={30} height={30} onClick={logout} alt={""} /> 
        </div>
        
        
      ) : (
        <Link href='/Login'><div className="login">Login</div></Link>
      )}
        </header>
    )
}