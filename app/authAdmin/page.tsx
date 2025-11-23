"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createClient } from "../../lib/supabse/client";
import AvatarPage from "../components/avatar/page";
import { useRouter } from "next/navigation";

interface UserProfile {
  id: string;
  name: string;
  LastName: string;
}

export default function Home() {
  const supabase = createClient();
  const [users, setUsers] = useState<UserProfile[]>([]);
const router =useRouter()
  useEffect(() => {
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

    const subscription = supabase
      .channel("public:profiles")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "profiles" },
        (payload) => {
          setUsers((prev) => [...prev, payload.new as UserProfile]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  // تابع پاک کردن همه کاربران
  async function handleDeleteAll() {
    const { error } = await supabase.rpc("truncate_profiles");
    if (error) {
      toast.error("خطا در پاک کردن کاربران");
      console.error(error);
    } else {
      toast.success("همه کاربران پاک شدند");
      router.push("/");
      setUsers([]);
    }
  }
  
  
  

  return (
    <div className="flex flex-col gap-3 w-full p-7 bg-linear-to-br from-blue-100 via-cyan-400 to-pink-400 h-screen overflow-y-auto">
      
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-purple-800 font-semibold text-sm sm:text-base md:text-lg">
          تعداد حاضرین: {users.length}
        </h4>

        <button
          onClick={handleDeleteAll}
          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-md shadow-sm transition"
        >
          پاک کردن همه
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center bg-white gap-2 px-4 py-1 rounded-2xl shadow-md transition-transform transform hover:scale-105 hover:shadow-xl flex-row-reverse w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33%-0.5rem)]"
          >
            <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-md"></span>

            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-200 shadow-sm">
              <AvatarPage />
            </div>

            <p className="text-sm sm:text-base md:text-lg font-medium text-purple-700 truncate text-right">
              {user.name} {user.LastName}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
