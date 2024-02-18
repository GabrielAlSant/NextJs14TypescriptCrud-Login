"use client"

import Image from "next/image";
import Header from "@/components/header";
import { useUser } from "@/AuthContext/useContext";
import { useRouter } from 'next/navigation';
import useSWR, { mutate } from "swr";
import { useState, useEffect } from "react";
import axios from "axios";
import PrivateRoute from "@/components/privateRoute";
import { toast } from "sonner";
import 'moment/locale/pt'
import moment from "moment";
import { X } from "lucide-react";
import * as Dialog from '@radix-ui/react-dialog';


const fetcher = (url: string) => fetch(url).then((res) => res.json());


export default function UserPage() {
  const [values, setValues] = useState<{ text?: string; authorId?: string; postId?: string;}>({});
  
  const { user, logout } = useUser()
  const router = useRouter()
  
  let key = null;
  if (user) {
  key = `${process.env.NEXT_PUBLIC_DB_URL}/postuser/${user.id}`;
   }

  const { data, error } = useSWR(key, fetcher);

  if (error) return <div>Error ao buscar dados</div>;

  if (!user) {
    return (
     <div>
       <div className='loader'>
      <div className="c-loader"></div>
      </div>
      </div>
      );
   }

  const handleInputChange = (event: any) => {
    setValues((prevValue) => ({
      ...prevValue,
      [event.target.name]: event.target.value,
      authorId: event.target.dataset.authorId,
      postId: event.target.dataset.postId,
    }));
  };


 

  const onSubmit = async ()=>{
    try {  
      const response = await axios.post(process.env.NEXT_PUBLIC_DB_URL+"/comment", values); 
      console.log(response)
      mutate(process.env.NEXT_PUBLIC_DB_URL+"/post");
      setValues({})

    } catch (error) {
      
    }
  }
  


  const handleDelete = async () => {
    try {

      const response = await axios.delete(process.env.NEXT_PUBLIC_DB_URL+`/user/${user.id}`);

      if(response.data){
        toast.success("A conta foi Excluida!")
        logout()
      }
    } catch (error) {
      console.error('Error creating user', error);
    }
  };


  return (
   <PrivateRoute>
   <Header/>
   <div className='max-w-5xl block m-auto bg-white my-10 rounded-md overflow-hidden p-5'>
      <h2 className="flex justify-center p-5 text-xl font-semibold">Olá {user.name}</h2>

    <Image src={user.img as string} width={150} height={150} alt={user.name as string} style={{borderRadius:"50%", display:'block',margin:"auto"}}></Image>
    
    <Dialog.Root>
      <Dialog.Trigger className="w-full">
        <button className="text-center p-2 bg-violet-700 text-white rounded-md mx-auto my-4">Configurações</button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50" />
        <Dialog.Content className="fixed overflow-hidden text-white inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[440px] w-full md:h-[30vh] bg-violet-700 md:rounded-md flex flex-col outline-none">
          <Dialog.Close className="absolute right-0 top-0 bg-violet-800 p-1.5 text-slate-400 hover:text-slate-100">
            <X className="size-5" />
          </Dialog.Close>
<div className="text-xl p-5">Configurações</div>
<div className="text-md my-2.5 p-5 bg-violet-800 hover:text-violet-300 bg-violet-900"><a href="UpdateUser"><button>Alterar Informações da conta</button></a></div>
<div className="text-md p-5 bg-violet-800 hover:text-violet-300 bg-violet-900"><button onClick={handleDelete}><span className="text-semibold">Excluir</span> Conta</button></div>

          </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>


    <h2 className="flex justify-center mt-4 p-5 text-xl">Publicações</h2>
          {data && data.map(
            ({ id, title, content, author, img, postDate, commensts}: { id: number; title: string; content: string; author: any; img: string; postDate:string; commensts:any}) => (
              <div className="max-w-3xl block mx-auto border-2 border-violet-950 my-10 rounded-md p-3" key={id}>
                <div>
                <div className="flex min-w-0 gap-x-4">
                        <Image
                          src={author.img as string}
                          width={50}
                          height={50}
                          alt={author.name as string}
                          className="h-12 w-12 flex-none rounded-full bg-gray-50"
                        />
                       <div className="min-w-0 flex-auto">
                       <p className="text-sm font-semibold leading-6 text-gray-900">{author.name}</p>
                       <p className="-mt-1 truncate text-xs leading-5 text-gray-500">{moment(postDate).locale('pt').fromNow()}</p>
                      </div>
                     </div>   
                  
                  <h2 className="text-semibold text-md ml-2 my-2">{title}</h2>
                </div>
                <div className="text-md ml-2 my-2" >{content}</div>
               {img && 
              (<Image
                 className="block mx-auto mb-2"
                 src={img as string}
                 width={480}
                 height={400}
                 alt={title as string}
               />)
               }
                <div className="h-px bg-violet-950 w-full" />
             <h2 className="text-bold text-md ml-2 my-2">Comentários</h2>
            {user && (
                 <div className="Comments" style={{marginBottom:"-30px"}}>
                <div className="flex min-w-0 gap-x-4 my-5">
                <Image
                          src={user.img as string}
                          width={50}
                          height={50}
                          alt={user.name as string}
                          className="h-12 w-12 flex-none rounded-full bg-gray-50"
                        />
                        <div className="min-w-0 flex-auto">
                       <input
                         className="p-1.5 mt-2 w-3/4 outline-none"
                         id="text"
                         name="text"
                         placeholder="Digite seu comentário"
                        data-author-id={user.id}
                        data-post-id={id}
                        onChange={handleInputChange}
                 ></input>
                <button onClick={onSubmit} className="bg-violet-600 text-semibold p-1 text-white hover:bg-violet-950 ml-5">Comentar</button>
                  <div className="h-px bg-violet-700 w-9/12" />

                      </div> 
               
   
                   </div>
                </div>
              )}
            
                <br/>
                <div className="Comments">
                {commensts.length === 0 ? (
              <p>Sem Comentarios</p>
            ) : (
              <>
          {commensts.map(({id, text, author, postDate}:{id:number, text:string, author:any, postDate:any})=>(
                   <div key={id} className="my-2">
                  <div className="flex min-w-0 gap-x-4">
                        <Image
                          src={author.img}
                          width={50}
                          height={50}
                          alt={author.name as string}
                          className="h-12 w-12 flex-none rounded-full bg-gray-50"
                        />
                       <div className="min-w-0 flex-auto">
                       <p className="text-sm font-semibold leading-6 text-gray-900">{author.name}{' '}<span className="-mt-1 truncate text-xs leading-5 text-gray-500">{moment(postDate).locale('pt').fromNow()}</span></p>
                       <p className="-mt-1 truncate text-md leading-5">{text}</p>
                      </div>
                     </div>  
  
                             
                 </div>
                ))}
                </>
                )}
               </div>
              </div>
            )
          )}
          {data && data.length === 0 && <div>Não Possui publicações</div>}
     </div>
    <button onClick={handleDelete}>Excluir Conta</button>
   </PrivateRoute>
  );
}