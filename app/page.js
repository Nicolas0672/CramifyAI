"use client"
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSidebar } from "./SidebarContext";

export default function Home() {
  const { isSignedIn, isLoading } = useUser(); // Check if the user is signed in
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);
  const{setIsSidebarVisible} = useSidebar()

  // Handle redirection logic
  useEffect(() => {
    if (isSignedIn) {
      setIsSidebarVisible(true)
      setRedirecting(true);
      
      router.push('/dashboard'); // Redirect to dashboard if signed in
    }
  }, [isSignedIn, router]);

  
  // Redirect to the sign-in page if not signed in
  useEffect(() => {
    if (!isSignedIn && !isLoading) {
      setIsSidebarVisible(false)
      router.push('/home');
    }
  }, [isSignedIn, isLoading, router]);
}