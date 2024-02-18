"use client"

import Image from "next/image";
import { Key, useState } from "react";
import useSWR, { mutate } from "swr";
import Header from "@/components/header";
import moment from 'moment'
import 'moment/locale/pt'
import { useUser } from "@/AuthContext/useContext";
import axios from "axios";
import AddPost from "@/components/newPost";


const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Post() {
  const [values, setValues] = useState<{ text?: string; authorId?: string; postId?: string;}>({});
  const [filter, setFilter] = useState("");
  const {user} = useUser()
 

  const { data, error } = useSWR(process.env.NEXT_PUBLIC_DB_URL+"/post", fetcher);

  const updatedFilteredData = data
    ? data.filter((user: { title: string, content:string }) =>
        user.title.toLowerCase().includes(filter.toLowerCase())||
        user.content.toLowerCase().includes(filter.toLowerCase())
      )
    : [];

  if (error) return <div>Error ao buscar dados</div>;

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
    <div>
      <Header />
      <div className="max-w-5xl block m-auto bg-white my-10 rounded-md p-5">

<h2 className="flex justify-center p-5 text-xl font-semibold text-violet-700">Publicações</h2>
      <AddPost />
        <input
        className="my-10 w-3/4 block mx-auto bg-violet-100 p-2 rounded-md tracking-tight"
          placeholder="Procurar Publicação"
          onChange={(e) => setFilter(e.target.value)}
        />
          <div>
          </div> {updatedFilteredData.length === 0 ? (
              <p>Nenhum post encontrado.</p>
            ) : (
              <>
          {updatedFilteredData.map(
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
          </>
          )}
      
      </div>
    </div>
  );
}

