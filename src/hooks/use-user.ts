import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export type UserProfile = {
  id: string
  name: string
  email: string
  role: 'student' | 'admin'
  avatarUrl?: string
}

export function useUser() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getUser() {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        
        if (!authUser) {
          setUser(null)
          return
        }

        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single()

        if (profile) {
          setUser({
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role as 'student' | 'admin',
          })
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(true)
        // We set loading false after we've tried everything
        setTimeout(() => setLoading(false), 0)
      }
    }

    getUser()
  }, [])

  return { user, loading }
}
