"use client"
import Image from "next/image";
import { Key } from "react";
import { useUser } from '../../AuthContext/useContext';
import Header from "@/components/header";

export default async function Home() {
    const { user } = useUser();
    const data = await getData()
  return (
    <div>
      <Header />
      <h1>Usuarios</h1>
      <ul>
        {data.map(({id, name, email ,password, img}: {id: Key; name:string; email:string; password:string; img:string}) => (
          <li key={id}>
            <h2>{name}</h2>
            <h2>{email}</h2>
            <p>{password}</p>
            <Image src={img} width={250} height={250} alt={name}/>
          </li>
        ))}
      </ul>
    </div>
  );
}
async function getData() {
    const res = await fetch('http://localhost:3000/user', { next: { revalidate: 1 } })
    if (!res.ok) {
        throw new Error('Failed to fetch data')
      }
     
      return res.json()
}