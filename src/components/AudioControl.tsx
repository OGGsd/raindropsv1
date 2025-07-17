import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useAudioMixer } from '../hooks/useAudioMixer';

export const AudioControl: React.FC = () => {
  const { isPlaying, isLoaded, startMixedPlayback, stopMixedPlayback } = useAudioMixer();
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const handlePlayToggle = () => {
    if (!userHasInteracted) {
      setUserHasInteracted(true);
    }
    
    if (isPlaying) {
      stopMixedPlayback();
    } else {
      startMixedPlayback();
    }
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    // You could implement actual muting logic here if needed
  };

  if (!isLoaded) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed bottom-6 right-6 bg-black/20 backdrop-blur-sm rounded-full p-4 border border-white/10"
      >
        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 right-6 flex items-center gap-3 bg-black/30 backdrop-blur-md rounded-full p-3 border border-white/20 shadow-lg"
    >
      {!userHasInteracted && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-white/80 text-sm font-medium mr-2"
        >
          Click to enable audio
        </motion.div>
      )}
      
      <motion.button
        onClick={handlePlayToggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center justify-center w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full transition-colors duration-200"
      >
        {isPlaying ? (
          <Pause className="w-5 h-5 text-white" />
        ) : (
          <Play className="w-5 h-5 text-white ml-0.5" />
        )}
      </motion.button>

      <motion.button
        onClick={handleMuteToggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full transition-colors duration-200"
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4 text-white" />
        ) : (
          <Volume2 className="w-4 h-4 text-white" />
        )}
      </motion.button>

      {/* Audio status indicator */}
      <div className="flex items-center gap-1">
        <motion.div
          animate={{
            opacity: isPlaying ? [0.3, 1, 0.3] : 0.3,
            scale: isPlaying ? [1, 1.2, 1] : 1,
          }}
          transition={{
            duration: 1.5,
            repeat: isPlaying ? Infinity : 0,
            ease: "easeInOut"
          }}
          className="w-2 h-2 bg-green-400 rounded-full"
        />
      </div>
    </motion.div>
  );
};