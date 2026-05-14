import { useEffect, useRef } from 'react';
import { Howl } from 'howler';

export function useAudio() {
  const bgMusic = useRef<Howl | null>(null);
  const gymMusic = useRef<Howl | null>(null);
  const sfx = useRef<{ [key: string]: Howl }>({});

  useEffect(() => {
    bgMusic.current = new Howl({
      src: ['https://dn721601.ca.archive.org/0/items/night-jazz-soothing-new-york-lounge-jazz-bar-classics-for-relax-work-sax-jazz-relaxing-music/Night%20Jazz%20Soothing%20New%20York%20Lounge%20%20Jazz%20Bar%20Classics%20for%20Relax%2C%20Work%20-%20Sax%20Jazz%20Relaxing%20Music.mp3'],
      loop: true,
      volume: 0.4,
      html5: true
    });

    gymMusic.current = new Howl({
      src: ['https://files.manuscdn.com/user_upload_by_module/session_file/310519663602259141/jDBNVkgWOcnlrgQD.mp3'],
      loop: true,
      volume: 0.5,
      html5: true
    });

    sfx.current = {
      click: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-modern-click-box-check-1120.mp3'], volume: 0.1 }),
      success: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3'], volume: 0.2 }),
      elevator: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-elevator-ding-sequence-705.mp3'], volume: 0.3 }),
      scan: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-scanning-sci-fi-interface-device-2396.mp3'], volume: 0.2 })
    };

    return () => {
      bgMusic.current?.unload();
      gymMusic.current?.unload();
    };
  }, []);

  const playBg = () => {
    if (!bgMusic.current?.playing()) bgMusic.current?.play();
  };

  const pauseBg = () => {
    bgMusic.current?.pause();
  };

  const playGym = () => {
    bgMusic.current?.fade(0.4, 0, 1000);
    setTimeout(() => {
      bgMusic.current?.pause();
      gymMusic.current?.play();
    }, 1000);
  };

  const stopGym = () => {
    gymMusic.current?.fade(0.5, 0, 1000);
    setTimeout(() => {
      gymMusic.current?.stop();
      bgMusic.current?.play();
      bgMusic.current?.fade(0, 0.4, 1000);
    }, 1000);
  };

  const playSfx = (name: string) => {
    sfx.current[name]?.play();
  };

  return { playBg, pauseBg, playGym, stopGym, playSfx };
}
