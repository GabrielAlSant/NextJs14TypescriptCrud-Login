"use client"

import Image from "next/image";
import { Key, useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import Header from "@/components/header";
import { useUser } from "@/AuthContext/useContext";
import { useRouter } from 'next/navigation';
import PrivateRoute from "@/components/privateRoute";
import axios from "axios";

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

    const onSubmit = async (event: any) => {
      try {
        await axios.post("http://localhost:3000/invite", {
          userSend: event.target.dataset.userId,
          userInvited: event.target.dataset.userinvId
        });
        mutate("http://localhost:3000/user");
      } catch (error) {
        console.error(error);
      }
    };

if (error) alert("Erro ao buscar dados");

if (!user) {
  return (
   <div>
    <Header  />
     <div className='loader'>
    <div className="c-loader"></div>
    </div>
    </div>
    );
}
  return (
   <PrivateRoute>
     <div>
      <Header />
        <div className=" inline w-60 ">
        <input
          placeholder="Procurar"
          className="max-w-5xl block mx-auto w-full  p-4 mt-10 mb-10 text-xl font-semibold tracking-tight outline-none placeholder:text-state-500  "
          onChange={(e) => setFilter(e.target.value)}
        />
     <ul role="list" className="divide-y divide-violet-50 max-w-4xl block m-auto bg-violet-50 p-5">
            {updatedFilteredData.length === 0 ? (
              <p>Nenhum usuário encontrado.</p>
            ) : (
              <>
                {updatedFilteredData.map(
                  ({ id, name, email, password, img }: { id: Key; name: string; email: string; password: string; img: string }) => (
                    <li key={id} className="flex justify-between gap-x-6 py-5">
                     <div className="flex min-w-0 gap-x-4">
                        <Image
                          src={`${img}&alt=media`}
                          width={50}
                          height={50}
                          alt={name}
                          className="h-12 w-12 flex-none rounded-full bg-gray-50"
                        />
                       <div className="min-w-0 flex-auto">
                       <p className="text-sm font-semibold leading-6 text-gray-900">{name}</p>
                       <p className="mt-1 truncate text-xs leading-5 text-gray-500">{email}</p>
                      </div>
                     </div>
                    
                   
                   <button className="text-xs leading-5 text-gray-500" data-user-id={user.id}
                data-userinv-id={id}
                onClick={onSubmit}>Enviar Convite</button>                           
                    </li>
                  )
                )}
              </>
            )}
       </ul>
        </div>
    </div>
   </PrivateRoute>
  );
}