import { useEffect, useRef, useState } from 'react';

export const useAudioMixer = () => {
  // All hooks must be declared at the top level in consistent order
  const rainAudioInstancesRef = useRef<HTMLAudioElement[]>([]);
  const thunderstormAudioRef = useRef<HTMLAudioElement | null>(null);
  const currentRainIndexRef = useRef(0);
  const isPlayingRef = useRef(false);
  const rainOverlapTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const thunderstormTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  

  // Configuration for overlapping
  const OVERLAP_DURATION = 5; // 5 seconds overlap
  const FADE_DURATION = 3; // 3 seconds fade
  const NUM_RAIN_INSTANCES = 4; // 4 instances for rain rotation
  const THUNDERSTORM_INTERVAL = 15000; // Play thunderstorm every 15 seconds
  const THUNDERSTORM_VOLUME = 0.4; // Lower volume for thunderstorm overlay

  const rainAudioFiles = [
    '/11L-medium_sound_raining-1752763639584.mp3',
    '/11L-medium_sound_raining-1752764780047.mp3'
  ];
  
  const thunderstormAudioFile = '/11L-prominant_high_quali-1752771174951.mp3';

  useEffect(() => {
    initializeAudioSystem();
    return cleanup;
  }, []);

  const initializeAudioSystem = async () => {
    console.log('Initializing rain + thunderstorm audio system...');
    
    // Create multiple instances of rain audio files
    rainAudioInstancesRef.current = [];
    
    for (let i = 0; i < NUM_RAIN_INSTANCES; i++) {
      const audio = new Audio(rainAudioFiles[i % rainAudioFiles.length]);
      
      // Critical settings for gapless playback
      audio.preload = 'auto';
      audio.volume = 0;
      audio.loop = false; // We handle looping manually
      
      // Ensure audio is ready
      await new Promise<void>((resolve) => {
        const onCanPlay = () => {
          audio.removeEventListener('canplaythrough', onCanPlay);
          resolve();
        };
        
        if (audio.readyState >= 4) {
          resolve();
        } else {
          audio.addEventListener('canplaythrough', onCanPlay);
        }
      });
      
      rainAudioInstancesRef.current.push(audio);
    }
    
    // Create thunderstorm audio instance
    thunderstormAudioRef.current = new Audio(thunderstormAudioFile);
    thunderstormAudioRef.current.preload = 'auto';
    thunderstormAudioRef.current.volume = 0;
    thunderstormAudioRef.current.loop = false;
    
    // Ensure thunderstorm audio is ready
    await new Promise<void>((resolve) => {
      const onCanPlay = () => {
        thunderstormAudioRef.current?.removeEventListener('canplaythrough', onCanPlay);
        resolve();
      };
      
      if (thunderstormAudioRef.current?.readyState >= 4) {
        resolve();
      } else {
        thunderstormAudioRef.current?.addEventListener('canplaythrough', onCanPlay);
      }
    });
    
    setIsLoaded(true);
    console.log(`${NUM_RAIN_INSTANCES} rain instances + 1 thunderstorm instance loaded and ready`);
    
    // Auto-start after brief delay
    setTimeout(() => {
      startAudioSystem();
    }, 500);
  };

  const startAudioSystem = () => {
    if (isPlayingRef.current) return;
    
    console.log('Starting rain + thunderstorm audio system...');
    isPlayingRef.current = true;
    setIsPlaying(true);
    currentRainIndexRef.current = 0;
    
    // Start rain audio loop
    playRainWithOverlap(0);
    
    // Start thunderstorm overlay system
    scheduleThunderstormOverlay();
  };

  const playRainWithOverlap = (instanceIndex: number) => {
    if (!isPlayingRef.current) return;
    
    const currentAudio = rainAudioInstancesRef.current[instanceIndex];
    if (!currentAudio) return;
    
    console.log(`Playing rain track ${instanceIndex}`);
    
    // Reset and start current track
    currentAudio.currentTime = 0;
    currentAudio.volume = 0;
    
    currentAudio.play().then(() => {
      // Fade in current track
      fadeIn(currentAudio, 0.7);
      
      // Calculate when to start next track (with overlap)
      const trackDuration = currentAudio.duration;
      const nextStartTime = (trackDuration - OVERLAP_DURATION) * 1000;
      
      console.log(`Rain track ${instanceIndex} duration: ${trackDuration}s, next starts in: ${nextStartTime/1000}s`);
      
      // Schedule next track to start with overlap
      rainOverlapTimeoutRef.current = setTimeout(() => {
        if (isPlayingRef.current) {
          const nextIndex = (instanceIndex + 1) % rainAudioInstancesRef.current.length;
          
          // Start next track overlapping with current
          startOverlappingRainTrack(nextIndex, currentAudio);
          
          // Continue the cycle
          playRainWithOverlap(nextIndex);
        }
      }, nextStartTime);
      
    }).catch((error) => {
      console.error(`Error playing rain track ${instanceIndex}:`, error);
      // Try next track if current fails
      const nextIndex = (instanceIndex + 1) % rainAudioInstancesRef.current.length;
      setTimeout(() => playRainWithOverlap(nextIndex), 100);
    });
  };

  const startOverlappingRainTrack = (nextIndex: number, currentAudio: HTMLAudioElement) => {
    const nextAudio = rainAudioInstancesRef.current[nextIndex];
    if (!nextAudio || !isPlayingRef.current) return;
    
    console.log(`Starting overlapping rain track ${nextIndex}`);
    
    // Start next track silently
    nextAudio.currentTime = 0;
    nextAudio.volume = 0;
    
    nextAudio.play().then(() => {
      // Crossfade: fade out current, fade in next
      crossfade(currentAudio, nextAudio, 0.7, 0.7);
    }).catch((error) => {
      console.error(`Error starting overlapping rain track ${nextIndex}:`, error);
    });
  };

  const scheduleThunderstormOverlay = () => {
    if (!isPlayingRef.current) return;
    
    // Random interval between 10-20 seconds for more natural thunderstorm timing
    const randomInterval = 10000 + Math.random() * 10000;
    
    thunderstormTimeoutRef.current = setTimeout(() => {
      if (isPlayingRef.current) {
        playThunderstormOverlay();
        scheduleThunderstormOverlay(); // Schedule next thunderstorm
      }
    }, randomInterval);
  };
  
  const playThunderstormOverlay = () => {
    if (!thunderstormAudioRef.current || !isPlayingRef.current) return;
    
    console.log('Playing thunderstorm overlay...');
    
    // Reset thunderstorm audio
    thunderstormAudioRef.current.currentTime = 0;
    thunderstormAudioRef.current.volume = 0;
    
    thunderstormAudioRef.current.play().then(() => {
      // Fade in thunderstorm over rain
      fadeIn(thunderstormAudioRef.current!, THUNDERSTORM_VOLUME);
      
      // Fade out thunderstorm after it plays (duration-based)
      const thunderDuration = thunderstormAudioRef.current!.duration;
      const fadeOutStart = Math.max(thunderDuration - FADE_DURATION, thunderDuration * 0.7);
      
      setTimeout(() => {
        if (thunderstormAudioRef.current && !thunderstormAudioRef.current.paused) {
          fadeOut(thunderstormAudioRef.current);
        }
      }, fadeOutStart * 1000);
      
    }).catch((error) => {
      console.error('Error playing thunderstorm overlay:', error);
    });
  };

  const fadeIn = (audio: HTMLAudioElement, targetVolume: number = 0.7) => {
    const steps = 60; // 60 steps for smooth fade
    const stepDuration = (FADE_DURATION * 1000) / steps;
    const volumeStep = targetVolume / steps;
    let currentStep = 0;
    
    const fadeInterval = setInterval(() => {
      if (!isPlayingRef.current || audio.paused) {
        clearInterval(fadeInterval);
        return;
      }
      
      currentStep++;
      audio.volume = Math.min(volumeStep * currentStep, targetVolume);
      
      if (currentStep >= steps) {
        clearInterval(fadeInterval);
        audio.volume = targetVolume;
      }
    }, stepDuration);
  };

  const fadeOut = (audio: HTMLAudioElement) => {
    const steps = 60;
    const stepDuration = (FADE_DURATION * 1000) / steps;
    const initialVolume = audio.volume;
    const volumeStep = initialVolume / steps;
    let currentStep = 0;
    
    const fadeInterval = setInterval(() => {
      if (audio.paused) {
        clearInterval(fadeInterval);
        return;
      }
      
      currentStep++;
      audio.volume = Math.max(initialVolume - (volumeStep * currentStep), 0);
      
      if (currentStep >= steps || audio.volume <= 0.01) {
        clearInterval(fadeInterval);
        audio.pause();
        audio.currentTime = 0;
        audio.volume = 0;
      }
    }, stepDuration);
  };

  const crossfade = (currentAudio: HTMLAudioElement, nextAudio: HTMLAudioElement, currentTargetVolume: number = 0.7, nextTargetVolume: number = 0.7) => {
    const steps = 60; // 60 steps for ultra-smooth crossfade
    const stepDuration = (FADE_DURATION * 1000) / steps;
    const currentVolumeStep = currentTargetVolume / steps;
    const nextVolumeStep = nextTargetVolume / steps;
    let currentStep = 0;
    
    console.log('Starting crossfade...');
    
    const crossfadeInterval = setInterval(() => {
      if (!isPlayingRef.current) {
        clearInterval(crossfadeInterval);
        return;
      }
      
      currentStep++;
      const progress = currentStep / steps;
      
      // Fade out current track
      if (!currentAudio.paused) {
        currentAudio.volume = Math.max(currentTargetVolume * (1 - progress), 0);
      }
      
      // Fade in next track
      if (!nextAudio.paused) {
        nextAudio.volume = Math.min(nextTargetVolume * progress, nextTargetVolume);
      }
      
      if (currentStep >= steps) {
        clearInterval(crossfadeInterval);
        
        // Stop and reset the previous track
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio.volume = 0;
        
        nextAudio.volume = nextTargetVolume;
        console.log('Crossfade completed');
      }
    }, stepDuration);
  };

  const stopAudioSystem = () => {
    console.log('Stopping rain + thunderstorm audio system...');
    isPlayingRef.current = false;
    setIsPlaying(false);
    
    // Clear any pending timeouts
    if (rainOverlapTimeoutRef.current) {
      clearTimeout(rainOverlapTimeoutRef.current);
      rainOverlapTimeoutRef.current = null;
    }
    
    if (thunderstormTimeoutRef.current) {
      clearTimeout(thunderstormTimeoutRef.current);
      thunderstormTimeoutRef.current = null;
    }
    
    // Stop all rain audio instances
    rainAudioInstancesRef.current.forEach((audio, index) => {
      if (!audio.paused) {
        console.log(`Stopping rain audio instance ${index}`);
        
        // Fade out quickly
        const fadeSteps = 20;
        const fadeInterval = 25;
        let step = 0;
        
        const quickFade = setInterval(() => {
          step++;
          audio.volume = Math.max(audio.volume * (1 - step / fadeSteps), 0);
          
          if (step >= fadeSteps || audio.volume <= 0.01) {
            clearInterval(quickFade);
            audio.pause();
            audio.currentTime = 0;
            audio.volume = 0;
          }
        }, fadeInterval);
      }
    });
    
    // Stop thunderstorm audio
    if (thunderstormAudioRef.current && !thunderstormAudioRef.current.paused) {
      console.log('Stopping thunderstorm audio');
      fadeOut(thunderstormAudioRef.current);
    }
  };

  const cleanup = () => {
    console.log('Cleaning up audio system...');
    stopAudioSystem();
    
    // Clean up all rain audio instances
    rainAudioInstancesRef.current.forEach((audio) => {
      audio.pause();
      audio.src = '';
      audio.load();
    });
    
    // Clean up thunderstorm audio
    if (thunderstormAudioRef.current) {
      thunderstormAudioRef.current.pause();
      thunderstormAudioRef.current.src = '';
      thunderstormAudioRef.current.load();
      thunderstormAudioRef.current = null;
    }
    
    rainAudioInstancesRef.current = [];
  };

  // Handle page visibility change to maintain playback
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('Page hidden - maintaining audio playback');
        // Keep playing even when tab is not visible
      } else {
        console.log('Page visible - ensuring audio continues');
        // Ensure audio is still playing when tab becomes visible
        if (isPlayingRef.current && rainAudioInstancesRef.current.length > 0) {
          const anyPlaying = rainAudioInstancesRef.current.some(audio => !audio.paused);
          if (!anyPlaying) {
            console.log('Restarting audio after visibility change');
            startAudioSystem();
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Handle page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log('Page unloading - stopping audio');
      stopAudioSystem();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return {
    isPlaying,
    isLoaded,
    startMixedPlayback: startAudioSystem,
    stopMixedPlayback: stopAudioSystem,
    config: {
      masterVolume: 0.7,
      thunderstormVolume: THUNDERSTORM_VOLUME,
      overlapDuration: OVERLAP_DURATION,
      fadeDuration: FADE_DURATION,
      thunderstormInterval: THUNDERSTORM_INTERVAL
    },
    currentRainTrack: currentRainIndexRef.current
  };
};