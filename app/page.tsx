'use client'
import Image from "next/image";
import styles from "./page.module.css";
import Header from "@/components/header";
import { getUserCookies, setUserCookies } from "@/lib/cookies";
import { useEffect } from "react";
import { useUser } from "@/AuthContext/useContext";
import PrivateRoute from "@/components/privateRoute";


export default function Home() {
 
  return (
    <PrivateRoute >
     <Header/>
    
    </PrivateRoute>
  );
}
