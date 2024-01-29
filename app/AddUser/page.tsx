"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '@/components/header';
import { getUserCookies } from '@/lib/cookies';
import { useUser } from '@/AuthContext/useContext';


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
        setError(true)
      };
    } catch (error) {
      console.error('Error creating user', error);
    }
  };
  

  return (
    <div>
     <Header />
     <div className='AddUser'>
     <div>
      <h2 className='addusertitle'>Criar Conta</h2>
      <div className='field'>
      <div className='nameatt'>
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
        <div className='field'>
        <div className='nameatt'>
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
        {error && (<div style={{ color: 'red', marginTop:"20px" ,textAlign:"start" }}>Este email já está sendo utilizado</div>)}
       </div>
        </div>
        <div className='field'>
        <div className='nameatt'>
          Senha:
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
     </div> 
    </div>
  );
};

export default AddUser;
