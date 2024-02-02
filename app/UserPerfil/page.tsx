"use client"
import './userperfil.css'
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
      }else{
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
     <div className='all'>
      <h2>Minha Conta</h2>
      <Image src={user.img as string} width={150} height={150} alt={user.name as string} style={{borderRadius:"50%", display:'block',margin:"auto"}}></Image>
     <div>
      <div className="field">
          Nome: 
        </div>
        <input
          className="inputatt"
          type='text'
          name="name"
          id='name'
          defaultValue={user!.name}
          onChange={handleInputChange}
          required
        />
      </div>
        <div  style={{display:'none'}}>
        <div className="field">
          Email:
        </div>
       <div>
       <input
       className="inputatt"
          value={user!.email}
          onChange={handleInputChange}
          readOnly={true}
        />
        
       </div>
        </div>
        <div >
        <div className="field">
          Nova Senha:
        </div>
        <input
        className="inputatt"
          type='password'
          name="password"
          id='password'
          onChange={handleInputChange}
          required
        />
        </div> 
        <div >
        <div className="field">
          Antiga Senha:
        </div>
        <input
        className="inputatt"
          type='password'
          name="lastPassword"
          id='lastPassword'
          onChange={handleInputChange}
          required
        />
        {error && (<div style={{ color: 'red', marginTop:"20px" ,textAlign:"start" }}>A senha está incorreta</div>)}
        </div> 
        <div>
        <div className="field">
          Foto de Perfil: 
        </div>
        <input
         style={{marginLeft:"20px"}}
          type='file'
          name="img"
          id='img'
          accept="image/png, image/jpeg"
          onChange={handleInputChange}
          required
        />
       </div>
      
      <div className='buttonatt'>
        <a href='/'>
          <button>Voltar</button>
        </a>
        <button onClick={onSubmit}>Atualizar</button>
      </div>
     </div>
   </PrivateRoute>
  );
}