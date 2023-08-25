"use client";

import { Volume1 } from "lucide-react";
import { Button } from "./ui/button";
import { env } from "@/lib/env";
// import { useRef } from "react";

let currentAudio: HTMLAudioElement;

export function SoundButton({ filename }: { filename: string }) {
  //   let audioRef = useRef<HTMLAudioElement>(null);

  //   const play = async () => {
  //     console.log(`play ${filename}`);
  //     await audioRef.current?.play();
  //   };
  const play = async () => {
    if (currentAudio) currentAudio.pause();

    currentAudio = new Audio(
      `https://${env.NEXT_PUBLIC_BUCKET_NAME}.s3.eu-west-1.amazonaws.com/sounds/${filename}`,
    );
    currentAudio.play();
  };
  return (
    <div>
      <Button
        variant="ghost"
        className="text-muted-foreground"
        size="icon"
        onClick={play}
      >
        <Volume1 />
      </Button>
      {/* <audio ref={audioRef} src={`/sounds/${filename}`} /> */}
    </div>
  );
}
