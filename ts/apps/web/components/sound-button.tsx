"use client";

import { Volume1 } from "lucide-react";
import { Button } from "./ui/button";
// import { useRef } from "react";

let currentAudio: HTMLAudioElement;

export function SoundButton({ filename }: { filename: string }) {
  //   let audioRef = useRef<HTMLAudioElement>(null);

  //   const play = async () => {
  //     console.log(`play ${filename}`);
  //     await audioRef.current?.play();
  //   };
  const play = async () => {
    console.log(`play ${filename}`);
    if (currentAudio) currentAudio.pause();
    currentAudio = new Audio(`/sounds/${filename}`);
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
