"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '@/components/header';
import { getUserCookies } from '@/lib/cookies';
import { useUser } from '@/AuthContext/useContext';
import { toast } from 'sonner';


const AddUser = () => {
  const [values, setValues] = useState<{ name?: string; email?: string; password?: string; img?: File }>({});
  const [error, setError] = useState(false)

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

      const response = await axios.post("http://localhost:3000/user", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if(response.data == 422){
        toast.success("O email já está sendo utilizado")
        setError(true)
      };
    } catch (error) {
      console.error('Error creating user', error);
    }
  };
  

  return (
    <div>
     <Header />
     <div className=''>
     <div>
      <h2 className=''>Criar Conta</h2>
      <div className=''>
      <div className=''>
          Nome: 
        </div>
        <input
          type='text'
          name="name"
          id='name'
          onChange={handleInputChange}
          required
        />
      </div>
        <div className=''>
        <div className=''>
          Email:
        </div>
       <div style={{marginTop:5}}>
       <input
          type='text'
          name="email"
          id='email'
          onChange={handleInputChange}
          required
        />
        {error && (<div >Este email já está sendo utilizado</div>)}
       </div>
        </div>
        <div className=''>
        <div className=''>
          Senha:
        </div>
        <input
          type=''
          name=""
          id=''
          onChange={handleInputChange}
          required
        />
        </div> 
       <div className=''>
       <div className=''>
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
      
      <div className=''>
        <a href='/'>
          <button className=''>Cancelar</button>
        </a>
        <button onClick={onSubmit} className="">Cadastrar</button>
      </div>
     </div>
     </div> 
    </div>
  );
};

export default AddUser;
