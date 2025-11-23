"use client"

import { useRouter } from "next/navigation";
import { createClient } from "../../../lib/supabse/client";
//import { useDispatch } from "react-redux";
//import { clearSession } from "../../store/authSlice";


export default function useAuthHook() {
  const supabase = createClient();
  const router = useRouter()
//const dispatch = useDispatch()
  async function login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.session; 
  }

  async function signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data.session; 
  }
  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    router.push("/auth")
    //dispatch(clearSession())
    return true;
  }

  return { login, signUp ,signOut };
}
