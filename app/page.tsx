"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import school from "../public/school.json";
import toast from "react-hot-toast";
import { createClient } from "../lib/supabse/client";

// --------------------------
// 🔐 Zod Schema Validation
// --------------------------
const profileSchema = z.object({
  name: z
    .string()
    .min(2, "نام باید حداقل ۲ حرف باشد")
    .regex(/^[\u0600-\u06FF\s]+$/, "فقط حروف فارسی مجاز است"),

  LastName: z
    .string()
    .min(2, "نام خانوادگی باید حداقل ۲ حرف باشد")
    .regex(/^[\u0600-\u06FF\s]+$/, "فقط حروف فارسی مجاز است"),
});

// TypeScript type از Zod
type ProfileForm = z.infer<typeof profileSchema>;

export default function SetProfilePage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);

  // ------------------------------------
  // 🎯 React Hook Form + ZodResolver
  // ------------------------------------
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

  async function onSubmit(data: ProfileForm) {
    try {
      setLoading(true);

      const { error } = await supabase.from("profiles").insert({
        name: data.name,
        LastName: data.LastName,
      });

      if (error) {
        toast.error("مشکلی پیش اومد");
        console.log(error);
        return;
      }

      toast.success(`${data.name} ${data.LastName} وارد شد`);
      router.push("/auth");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="min-h-screen flex font-sans flex-col items-center justify-start pt-10 bg-linear-to-br from-blue-200 to-cyan-200 p-3">


        <div className="bg-white shadow-lg rounded-3xl p-8 w-full max-w-lg text-center border-4 border-blue-400">
          <h1 className="text-2xl font-extrabold text-blue-600 mb-3">
            حضور و غیاب کلاس دوم
          </h1>

          <div className="flex justify-center">
            <Lottie animationData={school} loop className="w-60" />
          </div>

          <p className="mt-4 text-gray-600 font-medium">
            اسم و فامیلیتو وارد کن تا حضورت ثبت بشه ✨
          </p>

          <div className="grid grid-cols-1 gap-4 mt-6">

            {/* 🔵 فیلد نام */}
            <div>
              <input
                {...register("name")}
                type="text"
                placeholder="نام"
                className={`px-4 py-3 rounded-xl border text-black border-green-400 text-lg bg-green-50 w-full ${
                  errors.name ? "border-red-500 bg-red-50" : ""
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* 🔵 فیلد نام خانوادگی */}
            <div>
              <input
                {...register("LastName")}
                type="text"
                placeholder="نام خانوادگی"
                className={`px-4 py-3 rounded-xl border text-black border-blue-400 text-lg bg-blue-50 w-full ${
                  errors.LastName ? "border-red-500 bg-red-50" : ""
                }`}
              />
              {errors.LastName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.LastName.message}
                </p>
              )}
            </div>

          </div>

          {/* 🔴 دکمه Submit با حالت Loading */}
          <button
            type="submit"
            disabled={loading}
            className={`mt-6 w-full py-3 rounded-2xl text-white text-xl font-bold shadow-lg transition
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-linear-to-r from-pink-500 to-red-500 hover:scale-105"
              }
            `}
          >
            {loading ? "در حال ثبت..." : "ورود 🚀"}
          </button>

        </div>
      </div>
    </form>
  );
}
