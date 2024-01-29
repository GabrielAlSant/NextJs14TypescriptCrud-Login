"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '@/components/header';
import { getUserCookies } from '@/lib/cookies';
import { useUser } from '@/AuthContext/useContext';


const AddPost = () => {
  const [values, setValues] = useState<{ title?: string; content?: string; authorId?: string; img?: File }>({});


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
    
      const formData = new FormData();
      formData.append('title', values.title || '');
      formData.append('content', values.content || '');
      formData.append('authorId', values.authorId || '');
      formData.append('img', values.img || '');

      const response = await axios.post("http://localhost:3000/post", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);
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
          name="title"
          id='title'
          onChange={handleInputChange}
          required
        />
      </div>
        <div className='field'>
        <div className='nameatt'>
          Email:
        </div>
        <input
          type='text'
          name="content"
          id='content'
          onChange={handleInputChange}
          required
        />
        </div>
        <div className='field'>
        <div className='nameatt'>
          Senha:
        </div>
        <input
          type=''
          name="authorId"
          id='authorId'
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

export default AddPost;
