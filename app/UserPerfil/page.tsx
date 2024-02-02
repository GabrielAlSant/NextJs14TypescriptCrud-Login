"use client"
import Image from "next/image";
import Header from "@/components/header";
import { useUser } from "@/AuthContext/useContext";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from "react";
import axios from "axios";
import PrivateRoute from "@/components/privateRoute";


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
      }
      login(response.data)
      route.push('/Post')
    } catch (error) {
      console.error('Error creating user', error);
    }
  };

  if (!user) {
    return <div>Carregando...</div>;
  }
  return (
   <PrivateRoute>
     <div>
      <Header />
    
      <div className='field'>
      <div className='nameatt'>
          Nome: 
        </div>
        <input
          type='text'
          name="name"
          id='name'
          defaultValue={user!.name}
          onChange={handleInputChange}
          required
        />
      </div>
        <div className='field'>
        <div className='nameatt'>
          Email:
        </div>
       <div>
       <input
          value={user!.email}
          onChange={handleInputChange}
          readOnly={true}
        />
        
       </div>
        </div>
        <div className='field'>
        <div className='nameatt'>
          Nova Senha:
        </div>
        <input
          type='password'
          name="password"
          id='password'
          onChange={handleInputChange}
          required
        />
        </div> 
        <div className='field'>
        <div className='nameatt'>
          Antiga Senha:
        </div>
        <input
          type='password'
          name="lastPassword"
          id='lastPassword'
          onChange={handleInputChange}
          required
        />
        {error && (<div style={{ color: 'red', marginTop:"20px" ,textAlign:"start" }}>A senha está incorreta</div>)}
        </div> 
        
        
       <div className='field'>
       <div className='nameatt'>
          Foto de Perfil: 
        </div>
        <input
          type='file'
          name="img"
          id='img'
          accept="image/png, image/jpeg"
          onChange={handleInputChange}
          required
        />
       </div>
      
      <div className='buttonscad'>
        <a href='/'>
          <button className='but can'>Cancelar</button>
        </a>
        <button onClick={onSubmit} className="but cad">Cadastrar</button>
      </div>
     </div>
   </PrivateRoute>
  );
}