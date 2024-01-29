"use client"

import Image from "next/image";
import { Key, useEffect, useState } from "react";
import useSWR from "swr";
import Header from "@/components/header";
import { VerifyUser } from "@/lib/verifyUser";
import { useUser } from "@/AuthContext/useContext";
import { useRouter } from 'next/navigation';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const [filter, setFilter] = useState("");
  const { user } = useUser()
  const route = useRouter()

  const { data, error } = useSWR("http://localhost:3000/user", fetcher);

  const updatedFilteredData = data
    ? data.filter((user: { name: string, email: string }) =>
      user.name.toLowerCase().includes(filter.toLowerCase()) ||
      user.email.toLowerCase().includes(filter.toLowerCase())
    )
    : [];

  if (error) return <div>Error ao buscar dados</div>;

  if (!user) {
    VerifyUser(user, route);
    return null; 
  }
  return (
    <div>
      <Header />
      <div className="allusers">
        <h2>Usuários</h2>
        <input
          placeholder="Procurar"
          onChange={(e) => setFilter(e.target.value)}
        />
        <div className="bordertable">
          <table>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Senha</th>
            </tr>
            {updatedFilteredData.length === 0 ? (
              <p>Nenhum usuário encontrado.</p>
            ) : (
              <>
                {updatedFilteredData.map(
                  ({ id, name, email, password, img }: { id: Key; name: string; email: string; password: string; img: string }) => (
                    <tr key={id}>
                      <td className="name">
                        <Image
                          src={img}
                          width={50}
                          height={50}
                          alt={name}
                          className="imguser"
                        />
                        <span className="nameusertable">{name}</span>
                      </td>
                      <td className="email">{email}</td>
                      <td className="password">{password.substring(0,8)}...</td>
                    </tr>
                  )
                )}
              </>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}