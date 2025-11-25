"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createClient } from "../../lib/supabse/client";
import AvatarPage from "../components/avatar/page";
import Lottie from "lottie-react";
import child from "../../public/child robot.json";


interface UserProfile {
  id: string;
  name: string;
  LastName: string;
}

export default function Home() {
  const supabase = createClient();
  //const { signOut } = useAuthHook();
  const [users, setUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    // 1️⃣ گرفتن کاربران فعلی
    async function fetchUsers() {
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) {
        toast.error("خطا در دریافت کاربران");
        console.error(error);
        return;
      }
      setUsers(data);
    }
    fetchUsers();

    // 2️⃣ ایجاد subscription برای Realtime
    const subscription = supabase
      .channel("public:profiles")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "profiles" },
        (payload) => {
          // وقتی یک کاربر جدید اضافه شد، به لیست اضافه کن
          setUsers((prev) => [...prev, payload.new as UserProfile]);

        }
      )
      .subscribe();

    // 3️⃣ cleanup هنگام unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
<div className="flex flex-col gap-3 w-full p-7  bg-linear-to-br from-blue-100 via-cyan-400 to-pink-400 h-screen overflow-y-auto">
    
 <div className="bg-white rounded-4xl">
            <h1 className="text-center relative text-purple-800 text-xl font-bold mt-20 animate-pulse mb-2">
    👋 حضور شما ثبت گردید ممنون 
    
</h1>
 <div className="flex justify-center h-[400px]  ">
            <Lottie animationData={child} loop className="w-60"  />
          </div>
 </div>
  
</div>

  
  

  );
}
