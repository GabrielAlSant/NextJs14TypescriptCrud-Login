// friend.tsx
import React from 'react';
import Image from 'next/image';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

interface Friend {
  user: {
    id: number;
    name: string;
    img: string;
    email: string;
  };
}

export default function FriendList({ user }: Friend) {
  return (
    <li key={user.id} className='flex justify-between gap-x-6 py-5'>
      <div className='flex min-w-0 gap-x-4'>
        <Image
          src={`${user.img}&alt=media`}
          width={50}
          height={50}
          alt={user.name}
          className='h-12 w-12 flex-none rounded-full bg-gray-50'
        />
        <div className='min-w-0 flex-auto'>
          <p className='text-sm font-semibold leading-6 text-gray-900'>{user.name}</p>
          <p className='mt-1 truncate text-xs leading-5 text-gray-500'>{user.email}</p>
        </div>
      </div>
      <Dialog.Root>
        <Dialog.Trigger>
          <button className='text-xs leading-5 bg-violet-950 w-[150px] p-3 text-white' data-id={user.id}>
            Conversar com {user.name}
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className='' />
          <Dialog.Content className='fixed right-2 bottom-0 border-2 border-violet-950 p-2 bg-white w-[350px] h-[300px]'>
            <Dialog.Close className='absolute right-0 top-0 bg-violet-800 p-1.5 text-slate-400 hover:text-slate-100'>
              <X className='size-5' />
            </Dialog.Close>
            <div className='h-[250px] overflow-y-auto'>
              <div className='flex min-w-0 p-1 gap-x-4 mb-5 fixed bg-white w-[306px]'>
                <Image
                  src={`${user.img}&alt=media`}
                  width={50}
                  height={50}
                  alt={user.name}
                  className='h-12 w-12 flex-none rounded-full bg-gray-50'
                />
                <p className='text-sm font-semibold leading-6 mt-2 text-gray-900'>{user.name}</p>
              </div>

              <div className='block mx-4'>
                <div className='text-start text-black float-left bg-violet-500 ml-2 p-2 max-w-[250px] rounded-md my-2'>
                  {' '}
                  sabe como e ne a gente vaai tentado
                </div>
                <div className='text-end text-black float-right bg-violet-300 p-2 max-w-[250px] rounded-md my-2'>
                  {' '}
                  ta foda em pae
                </div>
                <div className='text-start text-black float-left bg-violet-500 ml-2 p-2 max-w-[250px] rounded-md my-2'>
                  {' '}
                  sabe como e ne a gente vaai tentado
                </div>
                <div className='text-end text-black float-right bg-violet-300 p-2 max-w-[250px] rounded-md my-2'>
                  {' '}
                  ta foda em pae
                </div>
                <div className='text-start text-black float-left bg-violet-500 ml-2 p-2 max-w-[250px] rounded-md my-2'>
                  {' '}
                  sabe como e ne a gente vaai tentado
                </div>
                <div className='text-end text-black float-right bg-violet-300 p-2 max-w-[250px] rounded-md my-2'>
                  {' '}
                  ta foda em pae
                </div>
              </div>
            </div>

            <input className='fixed w-[330px] p-1 my-3 rounded-md border-2 border-violet-950 bottom-0 right-4' />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </li>
  );
}
