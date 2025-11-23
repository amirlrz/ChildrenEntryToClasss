"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../../lib/supabse/client";
import AvatarPage from "../avatar/page";

export default function ProfileNav() {
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [ShowNav, setShowNav] = useState<boolean>(false);

  useEffect(() => {
    async function fetchProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
  
      if (!user) return;
  
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
  
      if (!error) setProfile(data);
    }
  
    fetchProfile(); 
  }, []);
  

  return (
    <div >
{
    ShowNav ===false &&
<div className="" 
onClick={()=>setShowNav(true)}>

        <AvatarPage name={profile?.name} />
</div>
}
      {ShowNav && profile && (
          <>
   <div className="min-h-screen bg-amber-50 flex  w-32 flex-col items-center pt-10">
          <button
          onClick={()=>setShowNav(false)}
           className="top-0 right-0 mb-4">✖️</button>
          <p className="mt-4 text-xl text-orange-500 font-bold">{profile.name}</p>
          <p className="text-gray-700">Age: {profile.age}</p>
        </div>
        </>
      )}
    </div>
  );
}
