"use client"
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { isSignedIn, isLoading } = useUser(); // Check if the user is signed in
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  // Handle redirection logic
  useEffect(() => {
    if (isSignedIn) {
      setRedirecting(true);
      router.push('/dashboard'); // Redirect to dashboard if signed in
    }
  }, [isSignedIn, router]);

  // Redirect to the sign-in page if not signed in
  useEffect(() => {
    if (!isSignedIn && !isLoading) {
      router.push('/sign-in');
    }
  }, [isSignedIn, isLoading, router]);
}
