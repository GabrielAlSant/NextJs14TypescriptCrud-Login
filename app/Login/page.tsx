"use client"
import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from '../../AuthContext/useContext';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import { setUserCookies } from '@/lib/cookies';

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
      const response = await axios.post("http://localhost:3000/user/login", values); 
        if (response.data.status === 401) {
          setError(true);
          setErrormsg("Senha incorreta");
        } else if (response.data.status === 404) {
          setError(true);
          setErrormsg("Usuário não encontrado");
        } else {
          login(response.data.data);
          setUserCookies('user', response.data.data.id)
          console.log("Sucesso");
          router.push('/Users');
        }
    } catch (err) {
      console.error('Erro ao validar login', err);
    }
  };

  return (
    <div>
      <Header />
      <div className='loginfield'>
        <h2>Login</h2>
        <input
          type='text'
          name='email'
          placeholder="Email"
          id='email'
          onChange={handleInputChange}
          required
        />
      
        <input
          type='password' 
          name='password'
          id='password'
          placeholder="Senha"
          onChange={handleInputChange}
          required
        />
        {error && (<div style={{ color: 'red', marginBottom:"20px", marginLeft:"20px" ,textAlign:"start" }}>{errormsg}</div>)}
        <div className='buttonscad'>
        <button onClick={onSubmit} className='butlogin'>Entrar</button>
      </div>
      </div>
      
      
      </div>  
  );
};

export default Login;