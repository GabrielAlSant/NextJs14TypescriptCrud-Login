"use client"

import Image from "next/image";
import Header from "@/components/header";
import { useUser } from "@/AuthContext/useContext";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from "react";
import axios from "axios";
import PrivateRoute from "@/components/privateRoute";
import { toast } from "sonner";


export default function UserPage() {
  const [values, setValues] = useState<{ name?: string; email?: string; password?: string; lastPassword?:string; img?: File }>({});
  const [error, setError] = useState(false)
  const { user } = useUser()
  const { login } = useUser()
  const route = useRouter()


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
      formData.append('email', user!.email || '');
      formData.append('password', values.password || '');
      formData.append('lastPassword', values.lastPassword || '')
      formData.append('img', values.img || '');

      const response = await axios.put("http://localhost:3000/user", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if(response.data == 401){
        setError(true)
        toast.warning("A senha antiga está incorreta!")
      }else{
        toast.success("Conta atualizada com sucesso!")
        login(response.data)
      }
      
    } catch (error) {
      console.error('Error creating user', error);
    }
  };

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
   <PrivateRoute>
      <Header />
     <div className='max-w-5xl block m-auto bg-white my-10 rounded-md overflow-hidden'>
      <h2 className="flex justify-center p-5 text-xl font-semibold">Alterar Informações da Conta</h2>
      <div className="flex justify-center my-2">
          Foto de Perfil
      </div>
      <Image src={user.img as string} width={150} height={150} alt={user.name as string} style={{borderRadius:"50%", display:'block',margin:"auto"}}></Image>
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


     <div>
      <label className="max-w-xl flex justify-center -ml-[60px] my-2">
          Nome 
        </label>
        <input
          className="block m-auto max-w-xl rounded-md w-full p-2 bg-violet-100"
          type='text'
          name="name"
          id='name'
          defaultValue={user!.name}
          onChange={handleInputChange}
          required
        />
      </div>
      

        <div >
        <label className="max-w-xl flex justify-center -ml-[40px] my-2">
          Nova Senha:
        </label>
        <input
          className="block m-auto max-w-xl rounded-md w-full p-2 bg-violet-100"
          type='password'
          name="password"
          id='password'
          onChange={handleInputChange}
          required
        />
        </div> 
        <div >
        <label className="max-w-xl flex justify-center -ml-[35px] my-2">
          Antiga Senha:
        </label>
        {error && (<div style={{ color: 'red'}} className="max-w-xl flex justify-center ml-[20px] mb-2 -mt-1">A senha antiga está incorreta!</div>)}
        <input
          className="block m-auto max-w-xl rounded-md w-full p-2 bg-violet-100"
          type='password'
          name="lastPassword"
          id='lastPassword'
          onChange={handleInputChange}
          required
        />
        </div> 
      <div className='mt-10'>
        <a href='/'>
          <button className="w-1/2  bg-violet-400 text-white font-semibold p-2 hover:bg-violet-950">Voltar</button>
        </a>
        <button className="w-1/2   bg-violet-500 text-white font-semibold p-2 hover:bg-violet-950" onClick={onSubmit}>Atualizar</button>
      </div>
     </div>
   </PrivateRoute>
  );
}