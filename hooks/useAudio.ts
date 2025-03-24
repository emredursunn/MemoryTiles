// useAudio.ts
import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';

export default function useAudio() {
  const [bubbleSound, setBubbleSound] = useState<Audio.Sound | null>(null);
  const [failSound, setFailSound] = useState<Audio.Sound | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Ses dosyalarını yükle
  useEffect(() => {
    async function loadSounds() {
      try {
        const { sound: bubble } = await Audio.Sound.createAsync(
          require('../assets/audio/bubble-sound.mp3'),
        );
        const { sound: fail } = await Audio.Sound.createAsync(
          require('../assets/audio/fail-sound.mp3'),
        );

        setBubbleSound(bubble);
        setFailSound(fail);
        setIsLoaded(true);

        // Hata yönetimi için boş bir fonksiyon
        bubble.setOnPlaybackStatusUpdate(() => {});
        fail.setOnPlaybackStatusUpdate(() => {});
      } catch (error) {
        console.error('Ses yüklenirken hata:', error);
      }
    }

    loadSounds();

    return () => {
      // Bileşen unmount olduğunda sesleri temizle
      if (bubbleSound) {
        bubbleSound.unloadAsync();
      }
      if (failSound) {
        failSound.unloadAsync();
      }
    };
  }, []);

  const playBubbleSound = async () => {
    if (!isLoaded || !bubbleSound) return;
    
    try {
      // Önceki oynatmayı durdur ve yeniden başlat
      await bubbleSound.stopAsync();
      await bubbleSound.setPositionAsync(0);
      await bubbleSound.playAsync();
    } catch (error) {
      console.error('Bubble sesi çalınamadı:', error);
    }
  };

  const playFailSound = async () => {
    if (!isLoaded || !failSound || !bubbleSound) return;
    
    try {
      // Önce tüm bubble seslerini durdur
      await bubbleSound.stopAsync();
      
      // Fail sesini çal
      await failSound.replayAsync();
    } catch (error) {
      console.error('Fail sesi çalınamadı:', error);
    }
  };

  return {
    playBubbleSound,
    playFailSound,
    isAudioLoaded: isLoaded,
  };
}