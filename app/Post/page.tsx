"use client"

import Image from "next/image";
import { Key, useState } from "react";
import useSWR from "swr";
import Header from "@/components/header";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const [filter, setFilter] = useState("");

  const { data, error } = useSWR("http://localhost:3000/post", fetcher);

  const updatedFilteredData = data
    ? data.filter((user: { title: string, content:string }) =>
        user.title.toLowerCase().includes(filter.toLowerCase())||
        user.content.toLowerCase().includes(filter.toLowerCase())
      )
    : [];

  if (error) return <div>Error ao buscar dados</div>;

  return (
    <div>
      <Header />
      <div className="allusers">
        <h2>Usuarios</h2>
        <input
          placeholder="Procurar"
          onChange={(e) => setFilter(e.target.value)}
        />
        <table>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Senha</th>
          </tr>
          {updatedFilteredData.map(
            ({ id, title, content, authorId, img }: { id: Key; title: string; content: string; authorId: string; img: string }) => (
              <tr key={id}>
                <td className="name">
                  <Image
                    src={img}
                    width={50}
                    height={50}
                    alt={title}
                    className="imguser"
                  />
                  <span className="nameusertable">{title}</span>
                </td>
                <td className="email">{content}</td>
                <td className="password">{authorId}</td>
              </tr>
            )
          )}
        </table>
      </div>
    </div>
  );
}