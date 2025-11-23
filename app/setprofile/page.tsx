"use client";

import { useState, useEffect } from "react";
import AvatarPage from "../components/avatar/page";
import { useForm } from "react-hook-form";
import { createClient } from "../../lib/supabse/client";
import { useRouter } from "next/navigation";

type ProfileForm = {
  name: string;
  LastName: string;
};

export default function SetProfilePage() {
  const { register, handleSubmit } = useForm<ProfileForm>();
  const [name, setName] = useState("");   
  const [tempName, setTempName] = useState("");
  const supabase = createClient();
  const router = useRouter()

  useEffect(() => {
    if (!tempName) return;

    const timeout = setTimeout(() => {
      setName(tempName);
    }, 500);

    return () => clearTimeout(timeout);
  }, [tempName]);

  async function onSubmit(data: ProfileForm) {
    //console.log("DATA:", data);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert("لطفاً وارد شوید");
      return;
    }

   
    const { error } = await supabase.from("profiles").insert({
      user_id: user.id,
      name: data.name,
      LastName: Number(data.LastName),
    });

    if (error) {
      console.log(error);
      alert("مشکلی پیش اومد");
    } else {
      alert(" Profile Updated ")
      router.push("/")

    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br dark:from-gray-900 dark:to-gray-800">
        <div className="pt-10 flex flex-col text-center w-[600px] mt-20 min-h-screen rounded-xl">

          <div className="flex justify-center">
            <AvatarPage name={name} />
          </div>

          <div className="grid grid-cols-2 gap-2 w-full">

            <input
              {...register("name", { required: true })}
              type="text"
              className="mt-3 block px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-600 dark:text-white"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder="Enter Your Name"
            />

            <input
              {...register("LastName", { required: true })}
              type="number"
              className="mt-3 block px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-600 dark:text-white"
              placeholder="Your LastName?"
            />

          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="mt-4 bg-pink-600 w-2/3 text-white py-2 px-4 rounded-xl shadow-md hover:bg-red-600 transition"
            >
              Save Profile
            </button>
          </div>

        </div>
      </div>
    </form>
  );
}
