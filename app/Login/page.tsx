"use client"
import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from '../../AuthContext/useContext';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';

const Login = () => {
 const { user } = useUser();
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
      setError(false)
      const response = await axios.post("http://localhost:3000/user/login", values);

      if (response.data) {
        login(response.data);
        console.log("Sucesso");
        router.push('/Users')
        
      }else if(response.data == false){
        setError(true);
        setErrormsg("Este email não está cadastrado em nosso banco")
      } 
      else if( response.data == null) {
        setError(true);
        setErrormsg("Senha incorreta");
      }
    } catch (err) {
      console.error('Erro ao validar login', err);
    }
  };

  return (
    <div>
      <Header />
      <div>
      {error && (<p style={{ color: 'red' }}>{errormsg}</p>)}
        <h4 className='nameatt'>Email</h4>
        <input
          type='text'
          name='email'
          id='email'
          onChange={handleInputChange}
          required
        />
        <h4 className='nameatt'>Password</h4>
        <input
          type='password' 
          name='password'
          id='password'
          onChange={handleInputChange}
          required
        />
      </div>
      <div className='buttonscad'>
        <a href='/'>
          <button className='but can'>Cancelar</button>
        </a>
        <button onClick={onSubmit} className='but cad'>Login</button>
      </div>
      </div>  
  );
};

export default Login;