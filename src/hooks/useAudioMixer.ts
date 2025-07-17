import { useEffect, useRef, useState } from 'react';

export const useAudioMixer = () => {
  const audioInstancesRef = useRef<HTMLAudioElement[]>([]);
  const currentIndexRef = useRef(0);
  const isPlayingRef = useRef(false);
  const overlapTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Configuration for overlapping
  const OVERLAP_DURATION = 5; // 5 seconds overlap
  const FADE_DURATION = 3; // 3 seconds fade
  const NUM_INSTANCES = 6; // 6 instances for smooth rotation

  const audioFiles = [
    '/11L-medium_sound_raining-1752763639584.mp3',
    '/11L-medium_sound_raining-1752764780047.mp3',
    '/11L-prominant_high_quali-1752771174951.mp3'
  ];

  useEffect(() => {
    initializeOverlappingAudio();
    return cleanup;
  }, []);

  const initializeOverlappingAudio = async () => {
    console.log('Initializing overlapping audio system...');
    
    // Create multiple instances of each audio file
    audioInstancesRef.current = [];
    
    for (let i = 0; i < NUM_INSTANCES; i++) {
      const audio = new Audio(audioFiles[i % audioFiles.length]);
      
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
      
      audioInstancesRef.current.push(audio);
    }
    
    setIsLoaded(true);
    console.log(`${NUM_INSTANCES} audio instances loaded and ready`);
    
    // Auto-start after brief delay
    setTimeout(() => {
      startOverlappingPlayback();
    }, 500);
  };

  const startOverlappingPlayback = () => {
    if (isPlayingRef.current) return;
    
    console.log('Starting overlapping audio playback...');
    isPlayingRef.current = true;
    setIsPlaying(true);
    currentIndexRef.current = 0;
    
    // Start first track
    playTrackWithOverlap(0);
  };

  const playTrackWithOverlap = (instanceIndex: number) => {
    if (!isPlayingRef.current) return;
    
    const currentAudio = audioInstancesRef.current[instanceIndex];
    if (!currentAudio) return;
    
    console.log(`Playing track ${instanceIndex}`);
    
    // Reset and start current track
    currentAudio.currentTime = 0;
    currentAudio.volume = 0;
    
    currentAudio.play().then(() => {
      // Fade in current track
      fadeIn(currentAudio);
      
      // Calculate when to start next track (with overlap)
      const trackDuration = currentAudio.duration;
      const nextStartTime = (trackDuration - OVERLAP_DURATION) * 1000;
      
      console.log(`Track ${instanceIndex} duration: ${trackDuration}s, next starts in: ${nextStartTime/1000}s`);
      
      // Schedule next track to start with overlap
      overlapTimeoutRef.current = setTimeout(() => {
        if (isPlayingRef.current) {
          const nextIndex = (instanceIndex + 1) % audioInstancesRef.current.length;
          
          // Start next track overlapping with current
          startOverlappingTrack(nextIndex, currentAudio);
          
          // Continue the cycle
          playTrackWithOverlap(nextIndex);
        }
      }, nextStartTime);
      
    }).catch((error) => {
      console.error(`Error playing track ${instanceIndex}:`, error);
      // Try next track if current fails
      const nextIndex = (instanceIndex + 1) % audioInstancesRef.current.length;
      setTimeout(() => playTrackWithOverlap(nextIndex), 100);
    });
  };

  const startOverlappingTrack = (nextIndex: number, currentAudio: HTMLAudioElement) => {
    const nextAudio = audioInstancesRef.current[nextIndex];
    if (!nextAudio || !isPlayingRef.current) return;
    
    console.log(`Starting overlapping track ${nextIndex}`);
    
    // Start next track silently
    nextAudio.currentTime = 0;
    nextAudio.volume = 0;
    
    nextAudio.play().then(() => {
      // Crossfade: fade out current, fade in next
      crossfade(currentAudio, nextAudio);
    }).catch((error) => {
      console.error(`Error starting overlapping track ${nextIndex}:`, error);
    });
  };

  const fadeIn = (audio: HTMLAudioElement) => {
    const steps = 60; // 60 steps for smooth fade
    const stepDuration = (FADE_DURATION * 1000) / steps;
    const volumeStep = 0.7 / steps; // Target volume 0.7
    let currentStep = 0;
    
    const fadeInterval = setInterval(() => {
      if (!isPlayingRef.current || audio.paused) {
        clearInterval(fadeInterval);
        return;
      }
      
      currentStep++;
      audio.volume = Math.min(volumeStep * currentStep, 0.7);
      
      if (currentStep >= steps) {
        clearInterval(fadeInterval);
        audio.volume = 0.7;
      }
    }, stepDuration);
  };

  const crossfade = (currentAudio: HTMLAudioElement, nextAudio: HTMLAudioElement) => {
    const steps = 60; // 60 steps for ultra-smooth crossfade
    const stepDuration = (FADE_DURATION * 1000) / steps;
    const volumeStep = 0.7 / steps;
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
        currentAudio.volume = Math.max(0.7 * (1 - progress), 0);
      }
      
      // Fade in next track
      if (!nextAudio.paused) {
        nextAudio.volume = Math.min(0.7 * progress, 0.7);
      }
      
      if (currentStep >= steps) {
        clearInterval(crossfadeInterval);
        
        // Stop and reset the previous track
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio.volume = 0;
        
        nextAudio.volume = 0.7;
        console.log('Crossfade completed');
      }
    }, stepDuration);
  };

  const stopOverlappingPlayback = () => {
    console.log('Stopping overlapping audio playback...');
    isPlayingRef.current = false;
    setIsPlaying(false);
    
    // Clear any pending timeouts
    if (overlapTimeoutRef.current) {
      clearTimeout(overlapTimeoutRef.current);
      overlapTimeoutRef.current = null;
    }
    
    // Stop all audio instances
    audioInstancesRef.current.forEach((audio, index) => {
      if (!audio.paused) {
        console.log(`Stopping audio instance ${index}`);
        
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
  };

  const cleanup = () => {
    console.log('Cleaning up audio system...');
    stopOverlappingPlayback();
    
    // Clean up all audio instances
    audioInstancesRef.current.forEach((audio) => {
      audio.pause();
      audio.src = '';
      audio.load();
    });
    
    audioInstancesRef.current = [];
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
        if (isPlayingRef.current && audioInstancesRef.current.length > 0) {
          const anyPlaying = audioInstancesRef.current.some(audio => !audio.paused);
          if (!anyPlaying) {
            console.log('Restarting audio after visibility change');
            startOverlappingPlayback();
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
      stopOverlappingPlayback();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return {
    isPlaying,
    isLoaded,
    startMixedPlayback: startOverlappingPlayback,
    stopMixedPlayback: stopOverlappingPlayback,
    config: {
      masterVolume: 0.7,
      overlapDuration: OVERLAP_DURATION,
      fadeDuration: FADE_DURATION
    },
    currentTrack: currentIndexRef.current
  };
};