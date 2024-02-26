'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import useSWR from 'swr';
import Header from '@/components/header';
import FriendList from '@/components/friend';
import { useUser } from '@/AuthContext/useContext';
import { toast } from 'sonner';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Friends() {
  const { user } = useUser();
  const [filter, setFilter] = useState('');

  const { data, error } = useSWR(user ? `${process.env.NEXT_PUBLIC_DB_URL}/getfriends/${user.id}` : null, fetcher);

  const updatedFilteredData = data
  ? data.filter(({ userEnv, invitedUser }: { userEnv: any; invitedUser: any }) =>
      (userEnv && userEnv.name.toLowerCase().includes(filter.toLowerCase())) ||
      (invitedUser && invitedUser.name.toLowerCase().includes(filter.toLowerCase()))
    )
  : [];

  if (error) toast.warning('Erro ao buscar dados');

  if (!user) {
    return (
      <div>
        <Header />
        <div className='loader'>
          <div className='c-loader'></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className=' inline w-60 '>
        <input
          placeholder='Procurar'
          className='max-w-5xl block mx-auto w-full  p-4 mt-10 mb-10 text-xl font-semibold tracking-tight outline-none placeholder:text-state-500  '
          onChange={(e) => setFilter(e.target.value)}
        />
        <h1 className='text-center my-5'>Amigos</h1>
        <ul role='list' className='divide-y divide-violet-50 max-w-4xl block m-auto bg-violet-50 p-5'>
          {updatedFilteredData.length === 0 ? (
            <p>Nenhum Amigo encontrado.</p>
          ) : (
            <>
              {updatedFilteredData.map(({ id, chat, userEnv, invitedUser }: { id: number; chat: any; userEnv: any; invitedUser: any }) => (
                <div key={id}>
                  {user.id !== userEnv.id ? (
                    <FriendList friend={userEnv} chatId={chat[0].id}  />
                  ) : (
                    <FriendList friend={invitedUser} chatId={chat[0].id} />
                  )}
                </div>
              ))}
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
