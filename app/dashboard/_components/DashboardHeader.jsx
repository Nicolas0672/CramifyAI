import { UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

function DashboardHeader() {
  return (
    <div className='p-5 gap-5 shadow-md flex justify-end items-center w-full  bg-white'>
    
      {/* User Profile Button */}
      <UserButton />
    </div>
  );
}

export default DashboardHeader;
