"use client";
import { useSidebar } from "@/app/SidebarContext";
import { Button } from "@/components/ui/button";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Profile() {
  const { signOut } = useClerk();
  const router = useRouter();
  const { hideSidebar, setIsSidebarVisible } = useSidebar(); // Get the hideSidebar function from context

  // Handle sign-out logic
  const handleSignOut = async () => {
    try {
        setIsSidebarVisible(false)
      await signOut({ redirectUrl: '/home' }); // Wait for sign-out to complete
      router.push('/home'); // Ensure redirection happens after sign-out
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  };

  return (
    <div>
      <h2>Your Profile</h2>
      {/* Add user details here, e.g., name, email */}
      <Button onClick={handleSignOut}>Sign out</Button>
    </div>
  );
}
