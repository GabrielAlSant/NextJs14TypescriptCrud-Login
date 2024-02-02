"use client"

import Image from "next/image";
import { Key, useState } from "react";
import useSWR from "swr";
import Header from "@/components/header";
import moment from 'moment'
import 'moment/locale/pt'

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Post() {
  const [filter, setFilter] = useState("");
  const { data, error } = useSWR("http://localhost:3000/post", fetcher);

  const updatedFilteredData = data
    ? data.filter((user: { title: string, content:string }) =>
        user.title.toLowerCase().includes(filter.toLowerCase())||
        user.content.toLowerCase().includes(filter.toLowerCase())
      )
    : [];

  if (error) return <div>Error ao buscar dados</div>;

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
            ({ id, title, content, author, img, postDate}: { id: Key; title: string; content: string; author: any; img: string; postDate:string}) => (
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
                 src={img}
                 width={680}
                 height={600}
                 alt={title}
               />)
               }
              </div>
            )
          )}
          </>
          )}
      
      </div>
    </div>
  );
}