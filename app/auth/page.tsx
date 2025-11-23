"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { createClient } from "../../lib/supabse/client";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import school from "../../public/school.json"; // ⬅ انیمیشن لوتی را همینجا بذار
import toast from "react-hot-toast";

type ProfileForm = {
  name: string;
  LastName: string;
};

export default function SetProfilePage() {
  const { register, handleSubmit } = useForm<ProfileForm>();
  //const [name, setName] = useState("");
  const [tempName, setTempName] = useState("");
  const router = useRouter();
  const supabase = createClient();

  // useEffect(() => {
  //   if (!tempName) return;

  //   const timeout = setTimeout(() => setName(tempName), 500);
  //   return () => clearTimeout(timeout);
  // }, [tempName]);

  async function onSubmit(data: ProfileForm) {
    // const {
    //   data: { user },
    //   error: userError,
    // } = await supabase.auth.getUser();
  
    // if (userError || !user) {
    //   alert("لطفاً وارد شوید");
    //   return;
    // }
  
    const { error } = await supabase.from("profiles").insert({
      //user_id: user.id,
      name: data.name,
      LastName: data.LastName,
    });
  
    if (error) {
      console.log(error);
      toast.error("مشکلی پیش اومد");
    } else {
      toast.success(`${data.name} ${data.LastName} وارد شد`);
      router.push("/"); // می‌تونی صفحه بعدی یا پروفایل کاربر بروی
    }
  }
  

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="min-h-screen flex font-sans flex-col items-center justify-center bg-linear-to-br from-blue-200 to-cyan-200 p-6">

        {/* لوتی */}
        

        <div className="bg-white shadow-lg rounded-3xl p-8 w-full max-w-lg text-center border-4 border-blue-400">
          <h1 className="text-2xl font-extrabold text-blue-600  bg-linear-to-r mb-3 ">
            حضور و غیاب کلاس دوم
          </h1>

          {/* اواتار بزرگ‌تر */}
          <div className="flex justify-center">

          <Lottie animationData={school} loop className="w-60"  />
          </div>

          <p className="mt-4 text-gray-600 font-medium">
            اسم و فامیلیتو وارد کن تا  وارد بشی✨
          </p>

          <div className="grid grid-cols-1 gap-4 mt-6">
            
          <input
              {...register("name")}
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder="نام"
              className="px-4 py-3 rounded-xl border text-black border-green-400 text-lg bg-green-50 "
            />
            <input
              {...register("LastName")}
              type="text"
              placeholder="نام خانوادگی"
              className="px-4 py-3 rounded-xl border text-black border-blue-400 text-lg bg-blue-50  "
            />

          </div>

          <button
            type="submit"
            className="mt-6 w-full py-3 rounded-2xl bg-linear-to-r from-pink-500 to-red-500 text-white text-xl font-bold shadow-lg hover:scale-105 transition"
          >
            ورود 🚀
          </button>
        </div>
      </div>
    </form>
  );
}
