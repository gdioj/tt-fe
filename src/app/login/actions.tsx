'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/util/supabase/server'
import { logger } from "@/lib/logger";

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/account')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/account')
}

export async function logout() {
  const supabase = await createClient()

  // Sign out the user
  const { error } = await supabase.auth.signOut()

  if (error) {
    logger.error('Error during logout:', error.message);
    redirect('/error');
  }

  // Revalidate the layout to update any cached authentication state
  revalidatePath('/', 'layout')

  // Redirect to login page after successful logout
  redirect('/login')
}