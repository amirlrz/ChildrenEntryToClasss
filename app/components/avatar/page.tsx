"use client";

import { createAvatar } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";

export default function AvatarPage() {
  const avatarSvg = createAvatar(avataaars, {
    seed: "Jameson",
    eyes: ["side"],
    mouth: ["tongue"],
    skinColor: ["fd9841"],
    size: 40,
  }).toString();

  return (
    <div
      className="w-full h-full flex justify-center items-center"
      dangerouslySetInnerHTML={{ __html: avatarSvg }}
    />
  );
}
