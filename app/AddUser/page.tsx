"use client"
import { useState } from 'react';
import axios from 'axios';
import Header from '@/components/header';


const AddUser = () => {
  const [values, setValues] = useState<{ name?: string; email?: string; password?: string; img?: File }>({});


  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.type === 'file') {

      setValues((prevValue) => ({
        ...prevValue,
        [event.target.name]: event.target.files?.[0],
      }));
    } else {
      // Update other input values
      setValues((prevValue) => ({
        ...prevValue,
        [event.target.name]: event.target.value,
      }));
    }
  };

  const onSubmit = async () => {
    try {
    
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

      console.log(response.data);
    } catch (error) {
      console.error('Error creating user', error);
    }
  };


  return (
    <div>
     <Header />
      <div>
      <h4 className='nameatt'>
          Name
        </h4>
        <input
          type='text'
          name="name"
          id='name'
          onChange={handleInputChange}
          required
        />
        <h4 className='nameatt'>
          Password
        </h4>
        <input
          type='text'
          name="password"
          id='password'
          onChange={handleInputChange}
          required
        />
        <h4 className='nameatt'>
          Email
        </h4>
        <input
          type='text'
          name="email"
          id='email'
          onChange={handleInputChange}
          required
        />
        <h4 className='nameatt'>
          Número de telefone
        </h4>
        <input
          type='file'
          name="img"
          id='img'
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
  );
};

export default AddUser;
