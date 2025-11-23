"use client";

import { createAvatar } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";
import { useEffect, useState } from "react";
import { defualtAvatar, femaleAvatarStyle, maleAvatarStyle } from "./AvatarStyle";

interface AvatarProps {
  name: string;
}

export default function AvatarPage({ name }: AvatarProps) {
  const [svg, setSvg] = useState<string | null>(null);
  
  useEffect(() => {
    const saved = localStorage.getItem("user_avatar_svg");

    if (saved) {
      setTimeout(() => {
        setSvg(saved);
      }, 0);
      return;
    }

    async function buildAvatar() {
      try {
        const res = await fetch(`https://api.genderize.io?name=${name}`);
        const data = await res.json();

        const gender = data.gender === "female" ? "female" : "male";

        const style =
          gender === "female"
            ? femaleAvatarStyle
            : gender === "male"
            ? maleAvatarStyle
            : maleAvatarStyle

        const avatarSvg = createAvatar(avataaars, {
          ...style,
          size: 40,
        }).toString();

        localStorage.setItem("user_avatar_svg", avatarSvg);

        setSvg(avatarSvg);
      } catch (err) {
        console.error(err);
      }
    }

    buildAvatar();
  }, [name]);

  if (!svg) return <div className="w-full h-full border bg-indigo-700 border-pink-400 rounded-full  " />;

  return (
    <div
      className="w-full h-full flex justify-center items-center"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
