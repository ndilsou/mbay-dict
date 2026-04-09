import { Icon } from '@iconify/react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

let currentAudio: HTMLAudioElement | null = null

export function SoundButton({
  filename,
  bucketName,
}: {
  filename: string
  bucketName: string
}) {
  const [playing, setPlaying] = useState(false)

  const play = () => {
    if (currentAudio) {
      currentAudio.pause()
      currentAudio = null
    }
    const audio = new Audio(
      `https://${bucketName}.s3.eu-west-1.amazonaws.com/sounds/${filename}`,
    )
    currentAudio = audio
    setPlaying(true)
    audio.play()
    audio.addEventListener('ended', () => setPlaying(false))
    audio.addEventListener('error', () => setPlaying(false))
  }

  return (
    <button
      type="button"
      onClick={play}
      className={cn(
        'relative inline-flex items-center justify-center size-8 rounded-full transition-all',
        'text-muted-foreground hover:text-primary hover:bg-primary/10',
        'active:scale-90',
        playing && 'text-primary',
      )}
      title="Play pronunciation"
    >
      {playing && (
        <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
      )}
      <Icon
        icon={playing ? 'solar:soundwave-bold-duotone' : 'solar:volume-loud-bold-duotone'}
        className="size-5 relative"
      />
    </button>
  )
}
