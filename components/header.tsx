'use client'
import Link from "next/link"
import { useUser } from '@/AuthContext/useContext';
import Image from "next/image";

export default function Header(){
    const { user } = useUser();
    return(
        <header>
           <Link href='/'><div>Bem-Vindo</div></Link>
            {user ? (
        <div>
        <p>Usuário logado: {user.name}</p>
        <Image src={user.img as string} width={50} height={50} alt={user.name as string}></Image>
        </div>
        
      ) : (
        <p>Nenhum usuário logado.</p>
      )}
            <ul>
                <Link href='/Login'><li>Login</li></Link>
                <Link href='/Users'><li>Usuarios</li></Link>
                <Link href='AddUser'><li>Cadastrar</li></Link>
            </ul>
        </header>
    )
}