"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

type UserRole = 'admin' | 'client' | null | undefined;

export function useUserRole() {
  const [role, setRole] = useState<UserRole>(undefined)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchUserRole = async () => {
      setLoading(true)
      const { data: { user }, error: userError } = await supabase.auth.getUser()

      if (userError || !user) {
        setRole(null)
        setLoading(false)
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      if (profileError) {
        console.error("Error fetching user role:", profileError)
        setRole(null) // Em caso de erro, assume-se que o papel não pode ser determinado
      } else if (profile) {
        setRole(profile.role as UserRole)
      } else {
        setRole(null) // Se não houver perfil, assume-se que o papel não pode ser determinado
      }
      setLoading(false)
    }

    fetchUserRole()
  }, [])

  return { role, loading }
}