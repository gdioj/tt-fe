'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/util/supabase/server'

export async function logout() {
  const supabase = await createClient()

  // Sign out the user
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Error during logout:', error.message)
    redirect('/error')
  }

  // Revalidate the layout to update any cached authentication state
  revalidatePath('/', 'layout')
  
  // Redirect to login page after successful logout
  redirect('/login')
}
