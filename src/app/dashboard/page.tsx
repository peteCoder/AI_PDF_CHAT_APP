import React from 'react'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import Dashboard from '@/components/Dashboard';

const DashboardPage = async () => {
  const { getUser } = getKindeServerSession();

  const user = getUser();
  console.log()

  if (!user || !user.id) {
    return redirect("/auth-callback?origin=dashboard");
  }

  const dbUser = await db.user.findFirst({
    where: {
      id: user.id,
    }
  });

  if (!dbUser) redirect("/auth-callback?origin=dashboard");
  
  return (
    <Dashboard />
  )
}

export default DashboardPage;