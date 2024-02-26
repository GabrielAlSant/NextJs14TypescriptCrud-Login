"use client"

import Image from "next/image";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import Header from "@/components/header";
import moment from 'moment'
import 'moment/locale/pt'
import { useUser } from "@/AuthContext/useContext";
import axios from "axios";
import AddPost from "@/components/newPost";


const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Chat() {
 const {user} = useUser()
 
 let key = null;
  if (user) {
  key = `${process.env.NEXT_PUBLIC_DB_URL}/chat/${user.id}`;
   }


  const { data, error } = useSWR(key, fetcher);

console.log(data)
 

  
  if (!user) {
    return (
     <div>
      <Header />
       <div className='loader'>
      <div className="c-loader"></div>
      </div>
      </div>
      );
  }

  return (
    <div>
        <Header />
   {data && data.map(({ id, chat}: { id: number; chat:any }) => (
    <div key={id}>
      <div>{chat.map(({id, messages}:{id:number;messages:any})=>(
        <div key={id}>{id}
        {messages.content}
        <div>
        {messages && messages.map(({id, content, senderId}:{id:number; content: string; senderId:number})=>(
          <div>
            {user.id == senderId ?(
              <div key={id} style={{color:'red'}}>
              {content}
            </div>
            ):(
            <div key={id} style={{color:'blue'}}>
              {content}
            </div>
            )}
          </div>
        ))}
        </div>
          
          </div>
      ))}</div>
    </div>
))}

    </div>
  );
}

