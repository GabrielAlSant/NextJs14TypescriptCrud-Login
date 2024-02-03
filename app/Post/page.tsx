"use client"

import Image from "next/image";
import { Key, useState } from "react";
import useSWR, { mutate } from "swr";
import Header from "@/components/header";
import moment from 'moment'
import 'moment/locale/pt'
import { useUser } from "@/AuthContext/useContext";
import axios from "axios";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Post() {
  const [values, setValues] = useState<{ text?: string; authorId?: string; postId?: string;}>({});
  const [filter, setFilter] = useState("");
  const {user} = useUser()

  const { data, error } = useSWR("http://localhost:3000/post", fetcher);

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
      const response = await axios.post("http://localhost:3000/comment", values); 
      console.log(response)
      mutate("http://localhost:3000/post");
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
      <div className="allusers">
        <h2>Post</h2>
        <input
          placeholder="Procurar"
          onChange={(e) => setFilter(e.target.value)}
        />
          <div>
          </div> {updatedFilteredData.length === 0 ? (
              <p>Nenhum post encontrado.</p>
            ) : (
              <>
          {updatedFilteredData.map(
            ({ id, title, content, author, img, postDate, commensts}: { id: number; title: string; content: string; author: any; img: string; postDate:string; commensts:any}) => (
              <div className="postcard" key={id}>
                <div>
                <div className="name">
                        <Image
                        style={{marginTop:'12px'}}
                          src={author.img}
                          width={50}
                          height={50}
                          alt={author.name}
                          className="imguser"
                        />
                        <span className="nameusertable">{author.name}<br/><span className="data">{moment(postDate).locale('pt').fromNow()}</span></span>
                        
                  </div>
                  
                  <h3 className="">{title}</h3>
                </div>
                <div className="email" style={{marginTop:'20px', marginBottom:'20px'}}>{content}</div>
               {img && 
              (<Image
                 src={img as string}
                 width={680}
                 height={600}
                 alt={title as string}
               />)
               }
            
               <div className="Comments" style={{marginBottom:"-30px"}}>
                <h4>Comentar</h4>
               <div className="name">
                        <Image
                        style={{marginTop:'12px'}}
                          src={user.img as string}
                          width={50}
                          height={50}
                          alt={user.name as string}
                          className="imguser"
                        />
                         <input
                         style={{width:'400px', marginLeft:"20px"}}
                id="text"
                name="text"
                data-author-id={user.id}
                data-post-id={id}
                value={values.text || ''}
                onChange={handleInputChange}
                ></input>
                 <button onClick={onSubmit} className="buttonComment">Comentar</button>
                        
                  </div>
               </div>
                <br/>
                <div className="Comments">
                <h4>Comentarios</h4>
                {commensts.length === 0 ? (
              <p>Sem Comentarios</p>
            ) : (
              <>
          {commensts.map(({id, text, author, postDate}:{id:number, text:string, author:any, postDate:any})=>(
                   <div key={id}>
                    <div className="commentfield">
                        <Image
                        style={{marginTop:'12px'}}
                          src={author.img}
                          width={50}
                          height={50}
                          alt={author.name}
                          className="imguser"
                        />
                        <span className="namecomment"><span className="weightbolder">{author.name}</span><span className="datacomment" style={{marginLeft:"10px"}}>{moment(postDate).locale('pt').fromNow()}</span>
                        <br/>
                        <span className="textcomment">{text}</span></span>
                             
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

