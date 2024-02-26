'use client'
import Image from "next/image";
import Header from "@/components/header";
import { getUserCookies, setUserCookies } from "@/lib/cookies";
import { useEffect } from "react";
import { useUser } from "@/AuthContext/useContext";
import PrivateRoute from "@/components/privateRoute";
import useSWR, { mutate } from "swr";
import { toast } from "sonner";
import Link from 'next/link';
import axios from "axios";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const { user, logout } = useUser()

  let key = null;
  if (user) {
  key = `${process.env.NEXT_PUBLIC_DB_URL}/getinvite/${user.id}`;
   }

  const { data, error } = useSWR(key, fetcher);
  
  console.log(data)
  if (error) return <div>Error ao buscar dados</div>;

  if (!user) {
    return (
     <div>
       <div className='loader'>
      <div className="c-loader"></div>
      </div>
      </div>
      );
   }

   const onSubmit = async (event: any) => {
    try {
      await axios.post(process.env.NEXT_PUBLIC_DB_URL+"/friend", {
        inviteId:event.target.dataset.inviteId,
        userEnvId: event.target.dataset.userenvId,
        invitedUserId: event.target.dataset.inviteduserId
      });
      mutate(`${process.env.NEXT_PUBLIC_DB_URL}/getinvite/${user.id}`);
      toast.success("Convite Enviado")
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <PrivateRoute >
     <Header/>
    <div className="w-full text-center p-5">
      <h2>Convites de amizades</h2>
      <ul role="list" className="divide-y divide-violet-50 max-w-4xl block m-auto bg-violet-50 p-5">
       {data && data.map(({id, userSend}:{id:number; userSend:any})=>(
        <li key={id} className="flex justify-between gap-x-6 py-5">
        <div className="flex min-w-0 gap-x-4">
           <Image
             src={userSend.img as string}
             width={50}
             height={50}
             alt={userSend.name as string}
             className="h-12 w-12 flex-none rounded-full bg-gray-50"
           />
          <div className="min-w-0 flex-auto">
          <p className="text-sm font-semibold leading-6 text-gray-900">{userSend.name}</p>
          <p className="mt-1 truncate text-xs leading-5 text-gray-500">{userSend.name}</p>
         </div>
        </div>
       
      
      <button className="text-xs leading-5 text-gray-500" data-invite-id={id} data-userenv-id={userSend.id}
   data-inviteduser-id={user.id} onClick={onSubmit} >Aceitar Convite</button>                           
       </li>
       ))}
       </ul>
    </div>
    </PrivateRoute>
  );
}
