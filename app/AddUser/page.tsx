"use client"
import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from '../../AuthContext/useContext';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import { setUserCookies } from '@/lib/cookies';
import Link from 'next/link';
import logo from '@/app/assets/baiacu.png'
import Image from 'next/image';
import { toast } from 'sonner';

const Login = () => {
  const [values, setValues] = useState<{ name?: string; email?: string; password?: string; img?: File }>({});
  const [error, setError] = useState(false)

  const router = useRouter()
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.type === 'file') {

      setValues((prevValue) => ({
        ...prevValue,
        [event.target.name]: event.target.files?.[0],
      }));
    } else {
      setValues((prevValue) => ({
        ...prevValue,
        [event.target.name]: event.target.value,
      }));
    }
  };

  const onSubmit = async () => {
    try {
      setError(false)
      const formData = new FormData();
      formData.append('name', values.name || '');
      formData.append('email', values.email || '');
      formData.append('password', values.password || '');
      formData.append('img', values.img || '');

      const response = await axios.post(process.env.NEXT_PUBLIC_DB_URL+"/user", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if(response.data == 422){
        toast.warning("O email já está sendo utilizado")
        setError(true)
      }else{
        toast.success("Conta Criada com sucesso")
        router.push("/Login")
      }
    } catch (error) {
      console.error('Error creating user', error);
    }
  };

  return (
    <div>
      <Header />

 <div className="bg-violet-50 max-w-xl block m-auto mt-10 rounded-md">
 <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 ">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Image width={50} height={50} className="mx-auto" src={logo} alt="Logo" />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-violet-950">
            Bem vindo ao baiacu
          </h2>
        </div>

        

        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Nome
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  onChange={handleInputChange}
                  className="block w-full p-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Email
                </label>
                <div className="text-sm">
                  <p className="font-semibold mt-1">
                  {error && (<p style={{color:"red"}}>O email já está sendo utilizado!</p>)}
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  onChange={handleInputChange}
                  required
                  className="block w-full p-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Senha
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  onChange={handleInputChange}
                  required
                  className="block w-full p-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Foto
                </label>
             
              </div>
              <div className="mt-2">
              {values.img && <img className="block mx-auto w-[100px] h-[80] my-10" alt="img" src={URL.createObjectURL(values.img)} />}
              <input
         className="block my-2  text-sm text-slate-500
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
            </div>

            <div>
              <button
                onClick={onSubmit}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Criar Conta
              </button>
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-gray-500">
            Já tem conta?{' '}
            <Link href="/Login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Entre com ela!
            </Link>
          </p>
        </div>
      </div>
 </div>
      
      </div>  
  );
};



export default Login;