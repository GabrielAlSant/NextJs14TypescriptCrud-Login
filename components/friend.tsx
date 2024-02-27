'use client'
import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import useSWR, { Key, mutate } from 'swr';
import { useUser } from '@/AuthContext/useContext';
import axios from 'axios';
import { toast } from 'sonner';
import { io, Socket } from 'socket.io-client';
import {v4 as uuidv4} from "uuid"

interface Friend {
  friend: {
    id: number;
    name: string;
    img: string;
    email: string;
  };
  chatId: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function FriendList({ friend, chatId }: Friend) {
  const [values, setValues] = useState<{ chatId?: string; content?: string; img?: File; senderId?: string; to?:string;}>({});
  const [msgs, setMsgs] = useState<any>(null)
  const [scroll, setScroll] = useState<any>(false)
  const { user } = useUser();
  const socket = useRef<Socket>();
  let scrollRef = useRef<any>()

  let key = null;
  if (user) {
    key = `${process.env.NEXT_PUBLIC_DB_URL}/chat/${user.id}`;
  }

  const{data, error} = (useSWR(key, fetcher));
  
  useEffect(()=>{
    setMsgs(data)
  },[data])

  useEffect(() => {
    if (user) {
      socket.current = io(process.env.NEXT_PUBLIC_DB_URL as string);
      socket.current?.emit('add-user', user?.id);
    }
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.type === 'file') {
      setValues((prevValue: any) => ({
        ...prevValue,
        [event.target.name]: event.target.files?.[0],
      }));
    } else {
      setValues((prevValue: any) => ({
        ...prevValue,
        [event.target.name]: event.target.value,
        to: event.target.dataset.to,
      }));
    }
  };

  const onSubmit = async () => {
    try {
      const formData = new FormData();
      values.senderId = user?.id as unknown as string;
      values.chatId = chatId;

      formData.append('chatId', values.chatId || '');
      formData.append('content', values.content || '');
      formData.append('senderId', values.senderId || '');
      formData.append('to', values.to || '');
      formData.append('img', values.img || '');

      let response;
      if (!values.img) {
        response = await axios.post(`${process.env.NEXT_PUBLIC_DB_URL}/messages`, values);
      } else {
        response = await axios.post(`${process.env.NEXT_PUBLIC_DB_URL}/messages`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      socket?.current?.emit("send-msg", {
        values
      })
      toast.success('Mensagem Enviada!');
      setValues({});
     mutate(`${process.env.NEXT_PUBLIC_DB_URL}/chat/${user?.id}`)
    } catch (error) {
      console.error('Error creating user', error);
    }
  };



  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        if(msg){
          mutate(`${process.env.NEXT_PUBLIC_DB_URL}/chat/${user?.id}`)
        }
      })
    }
  }, []);


  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data]);

  
  return (
    <>
    <li key={friend.id as unknown as number} className="flex justify-between gap-x-6 py-5">
      <div className="flex min-w-0 gap-x-4">
        <Image
          src={`${friend.img}&alt=media`}
          width={50}
          height={50}
          alt={friend.name}
          className="h-12 w-12 flex-none rounded-full bg-gray-50"
        />
        <div className="min-w-0 flex-auto">
          <p className="text-sm font-semibold leading-6 text-gray-900">{friend.name}</p>
          <p className="mt-1 truncate text-xs leading-5 text-gray-500">{friend.email}{chatId}</p>
        </div>
      </div>
      <Dialog.Root>
        <Dialog.Trigger>
          <div className="text-xs leading-5 bg-violet-950 w-[150px] p-3 text-white" >
            Conversar com {friend.name}
          </div>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="" />
          <Dialog.Content className="fixed right-2 bottom-0 border-2 border-violet-950 p-2 bg-white w-[350px] h-[320px]">
            <Dialog.Close className="absolute right-0 top-0 bg-violet-800 p-1.5 text-slate-400 hover:text-slate-100">
              <X className="size-5" />
            </Dialog.Close>
            <div className="h-[250px] overflow-y-auto">
              <div className="flex min-w-0 p-1 gap-x-4 mb-5 fixed bg-white w-[306px]">
                <Image
                  src={`${friend.img}&alt=media`}
                  width={50}
                  height={50}
                  alt={friend.name}
                  className="h-12 w-12 flex-none rounded-full bg-gray-50"
                />
                <p className="text-sm font-semibold leading-6 mt-2 text-gray-900">{friend.name}</p>
              </div>

              <div className="block mx-4">
              {msgs?.map(({ id, chat }: { id: number; chat: any }) => (
                    <div key={id} className="mt-16">
                      {chat?.map(({ id, messages }: { id: number; messages: any }) => (
                        <div key={id}>
                          {id as unknown as string == chatId &&
                            messages?.map(({ id, content, senderId }: { id: number; content: string; senderId: number }) => (
                              <div key={id} className={user?.id === senderId ? 'text-end' : 'text-start'} >
                                <div 
                                  className={`text-black ${
                                    user?.id === senderId ? 'float-right bg-violet-300' : 'float-left bg-violet-500'
                                  } ml-2 p-2 max-w-[250px] rounded-md my-1`}
                                  style={{ display: 'block', clear: 'both' }}
                                  ref={scrollRef}        
                                >
                                  {content}
                                </div>
                              </div>
                            ))}
                        </div>
                      ))}
                    </div>
                  ))}
              </div>
            </div>

            <input onChange={handleInputChange} data-to={friend.id} id="content" value={values.content || ''} name="content" className="fixed w-[330px] p-1 my-3 rounded-md border-2 border-violet-950 bottom-0 right-4" />
            <button className="fixed right-6 bottom-5" onClick={onSubmit}>
              Enviar
            </button>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </li></>
  );
}


