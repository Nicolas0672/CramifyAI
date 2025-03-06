"use client"
import { db } from '@/configs/db'
import { USER_TABLE } from '@/configs/schema'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import { eq } from 'drizzle-orm'
import React, { useEffect } from 'react'
import { ConvexProvider, ConvexReactClient } from "convex/react";

function Provider({ children }) {
  const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);
  const { user } = useUser()

  useEffect(() => {
    user && CheckIsNewUser()
  }, [user])

  const CheckIsNewUser = async () => {
    const result = await db.select().from(USER_TABLE)
      .where(eq(USER_TABLE.email, user?.primaryEmailAddress?.emailAddress))

    if (result?.length == 0) {
      const userResp = await db.insert(USER_TABLE).values({
        name: user?.fullName,
        email: user?.primaryEmailAddress?.emailAddress,
      }).returning({ id: USER_TABLE.id })
    }

    const resp = await axios.post('/api/create-user', { user: user })

  }
  return (
    <div>
      <ConvexProvider client={convex}>{children}</ConvexProvider>

    </div>
  )
}

export default Provider