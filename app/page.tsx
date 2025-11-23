"use client";

import { useEffect, useState } from "react";
import { createClient } from "../lib/supabse/client";
//import useAuthHook from "./components/authHook/page";
import AvatarPage from "./components/avatar/page";
import toast from "react-hot-toast";

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
          setUsers((prev) => [...prev, payload.new]);
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
    
    <h4 className="text-center text-purple-800 font-semibold mb-2 text-sm sm:text-base md:text-lg">
  تعداد حاضرین: {users.length}
</h4>

    <div className="flex flex-col gap-2">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-center bg-white gap-2 px-4 py-1  rounded-2xl shadow-md transition-transform transform hover:scale-105 hover:shadow-xl flex-row-reverse w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33%-0.5rem)]"
        >
          {/* Online indicator */}
          <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-md"></span>

          {/* Avatar */}
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-200 shadow-sm">
            <AvatarPage name={user.name} />
          </div>

          {/* Name */}
          <p className="text-sm sm:text-base md:text-lg font-medium text-purple-700 truncate text-right">
            {user.name} {user.LastName}
          </p>
        </div>
      ))}
    </div>
</div>

  
  

  );
}
