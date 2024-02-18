"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '@/components/header';
import { getUserCookies } from '@/lib/cookies';
import { useUser } from '@/AuthContext/useContext';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { mutate } from "swr";

const AddPost = () => {
  const {user} = useUser()
  const [values, setValues] = useState<{ title?: string; content?: string; authorId?: string; img?: File }>({});

const router= useRouter();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    if (event.target.type === 'file') {

      const input = event.target as HTMLInputElement;
      setValues((prevValue) => ({
        ...prevValue,
        [event.target.name]: input.files?.[0],
      }));
    } else {
      setValues((prevValue) => ({
        ...prevValue,
        [event.target.name]: event.target.value,
      }));
    }
  };

  if (!user) {
    return (
     <div>
       <div className='loader'>
      <div className="c-loader"></div>
      </div>
      </div>
      );
   }

  const onSubmit = async () => {
    try {
      values.authorId = user.id as unknown as string
      
      const formData = new FormData();
      formData.append('title', values.title || '');
      formData.append('content', values.content || '');
      formData.append('authorId', values.authorId || '');
      formData.append('img', values.img || '');

      const response = await axios.post(process.env.NEXT_PUBLIC_DB_URL+"/post", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success("Publicado!")
      setValues({})
      mutate(process.env.NEXT_PUBLIC_DB_URL+"/post");

    } catch (error) {
      console.error('Error creating user', error);
    }
  };
  

  return (
  <div className="max-w-3xl block m-auto bg-white my-10 rounded-md p-5 border-violet-950 border-2">
     <div>
      <div className=''>
        <input
        className='w-full p-2 outline-none'
          type='text'
          name="title"
          id='title'
          value={values.title || ''}
          placeholder='Título da postagem...'
          onChange={handleInputChange}
          required
        />
        <div className="h-px bg-violet-700 w-full" />
      </div>
        <div >
        <textarea
         className='w-full p-2 resize-none flex-1 leading-6 outline-none'
          name="content"
          id='content'
          placeholder='Texto...'
          value={values.content || ''}
          onChange={handleInputChange}
          required
        />
        <div className="h-px bg-violet-700 w-full" />
        </div>
  
        
       <div className=''>
        {values.img && <img className="block mx-auto w-[100px] h-[80] my-10" alt="img" src={URL.createObjectURL(values.img)} />}
        <input
         className="block my-2 mx-auto text-sm text-slate-500
         file:mr-4 file:py-2 file:px-4
         file:rounded-full file:border-0
         file:text-sm file:font-semibold
         file:bg-violet-50 file:text-violet-700
         hover:file:bg-violet-100"
          type='file'
          name="img"
          id='img'
          accept="image/png, image/jpeg"
          onChange={handleInputChange}
          required
        />
       </div>
      
      <div className=''>
        <button onClick={onSubmit} className=" w-full mx-auto bg-violet-700 p-2 text-white hover:bg-violet-900">Postar</button>
      </div>
     </div>
    </div>
  );
};

export default AddPost;
