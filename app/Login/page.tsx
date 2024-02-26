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
  const { login } = useUser();
  const [values, setValues] = useState({ email: '', password: '' });
  const [error, setError] = useState(false);
  const [errormsg, setErrormsg] = useState("");

  const router = useRouter();

  const handleInputChange = (event:any) => {
    setValues((prevValue) => ({
      ...prevValue,
      [event.target.name]: event.target.value,
    }));
  };

  const onSubmit = async () => {
    try {
      setError(false);
      const response = await axios.post(process.env.NEXT_PUBLIC_DB_URL+"/user/login", values); 
        if (response.data.status === 401) {
          setError(true);
          setErrormsg("Senha incorreta");
        } else if (response.data.status === 404) {
          setError(true);
          setErrormsg("Usuário não encontrado");
        } else {
          toast.success("Bem-Vindo " + response.data.data.name)
          login(response.data.data);
          setUserCookies('user', response.data.token)
          console.log("Sucesso");
          router.push('/Post');
        }
    } catch (err) {
      console.error('Erro ao validar login', err);
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

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  onChange={handleInputChange}
                  className="block w-full p-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Senha
                </label>
                <div className="text-sm">
                  <p className="font-semibold mt-1">
                  {error && (<p style={{color:"red"}}>{errormsg}</p>)}
                  </p>
                </div>
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
              <button
                onClick={onSubmit}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Entrar
              </button>
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-gray-500">
            Não tem conta?{' '}
            <Link href="/AddUser" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Crie uma!
            </Link>
          </p>
        </div>
      </div>
 </div>
      
      </div>  
  );
};



export default Login;