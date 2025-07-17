import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAudioMixer } from './hooks/useAudioMixer';
import { EnhancedAnimations, FloatingParticles, AdvancedRipples } from './components/EnhancedAnimations';
import { AdvancedLighting, StreetLamps } from './components/AdvancedLighting';
import './RaindropBackground.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

function App() {
  const { isPlaying, isLoaded } = useAudioMixer();

  useEffect(() => {
    AOS.init({
      duration: 1200,
      easing: 'ease-in-out-cubic',
      once: false,
      mirror: true
    });
  }, []);

  // Enhanced raindrop generation with better performance
  const createRaindrops = (count: number, className: string, duration: [number, number]) => {
    return Array.from({ length: count }, (_, i) => (
      <motion.div
        key={`${className}-${i}`}
        className={`raindrop ${className}`}
        initial={{ opacity: 0, y: -50, scaleY: 0.6 }}
        animate={{ 
          opacity: [0, 0.8, 0.6, 0],
          y: '110vh',
          x: [0, Math.random() * 20 - 10, Math.random() * 30 - 15],
          scaleY: [0.6, 1, 1.2, 1.4]
        }}
        transition={{
          duration: duration[0] + Math.random() * duration[1],
          delay: Math.random() * 10,
          repeat: Infinity,
          ease: "linear",
          times: [0, 0.1, 0.8, 1]
        }}
        style={{
          left: `${Math.random() * 100}%`,
          willChange: 'transform, opacity'
        }}
      />
    ));
  };

  const lightRaindrops = createRaindrops(35, 'light', [3, 2]);
  const mediumRaindrops = createRaindrops(25, 'medium', [2.5, 1.5]);
  const heavyRaindrops = createRaindrops(18, 'heavy', [2, 1]);
  const splashDrops = createRaindrops(12, 'splash', [1.5, 0.8]);

  return (
    <EnhancedAnimations>
      <div className="rain-container">
        {/* Enhanced background with breathing effect */}
        <motion.div 
          className="rain-background"
          animate={{
            opacity: [0.8, 0.95, 0.85, 0.9],
            scale: [1, 1.02, 0.99, 1.01]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Advanced lighting system */}
        <AdvancedLighting />
        
        {/* Enhanced lightning with multiple flashes */}
        <motion.div 
          className="lightning-layer"
          animate={{
            opacity: [0, 0, 0, 0.4, 0, 0.7, 0, 0.3, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            times: [0, 0.88, 0.89, 0.9, 0.91, 0.92, 0.93, 0.94, 1]
          }}
        />
        
        {/* Enhanced city skyline with AOS animations */}
        <motion.div 
          className="city-skyline"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 3, delay: 0.5, ease: "easeOut" }}
          data-aos="fade-up"
          data-aos-duration="2000"
        >
          {Array.from({ length: 10 }, (_, i) => (
            <motion.div
              key={`building-${i + 1}`}
              className={`building building-${i + 1}`}
              initial={{ y: 100, opacity: 0, scaleY: 0 }}
              animate={{ 
                y: 0, 
                opacity: 1, 
                scaleY: 1,
                rotateX: [0, 0.5, 0]
              }}
              transition={{ 
                duration: 2, 
                delay: 0.8 + i * 0.1,
                ease: "easeOut"
              }}
              whileHover={{ scale: 1.02 }}
              data-aos="slide-up"
              data-aos-delay={i * 100}
            />
          ))}
          
          {/* Enhanced building lights with more variety */}
          <div className="city-lights">
            {Array.from({ length: 40 }, (_, i) => (
              <motion.div
                key={`light-${i}`}
                className="window-light"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0.4, 1, 0.7, 0.9],
                  scale: [1, 1.1, 0.9, 1.05]
                }}
                transition={{
                  duration: 8 + Math.random() * 4,
                  delay: Math.random() * 20,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  left: `${15 + Math.random() * 70}%`,
                  top: `${30 + Math.random() * 40}%`,
                  background: `rgba(${255}, ${220 + Math.random() * 35}, ${120 + Math.random() * 80}, 0.8)`
                }}
              />
            ))}
          </div>
        </motion.div>
        
        {/* Street lamps */}
        <StreetLamps />
        
        {/* Axie Studio backdrop */}
        <motion.div 
          className="axie-studio-backdrop"
          initial={{ opacity: 0, y: 30, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            scale: 1,
            rotateX: [0, 0.5, 0, -0.3, 0]
          }}
          transition={{ 
            duration: 3, 
            delay: 2,
            ease: "easeOut"
          }}
          data-aos="zoom-in"
          data-aos-delay="2000"
        >
          <motion.div 
            className="studio-sign"
            animate={{
              boxShadow: [
                '0 0 30px rgba(255, 100, 150, 0.6), 0 0 60px rgba(100, 200, 255, 0.4)',
                '0 0 40px rgba(255, 100, 150, 0.8), 0 0 80px rgba(100, 200, 255, 0.6)',
                '0 0 35px rgba(255, 100, 150, 0.7), 0 0 70px rgba(100, 200, 255, 0.5)'
              ]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.h1 
              className="studio-text"
              animate={{
                textShadow: [
                  '0 0 20px rgba(255, 100, 150, 0.8), 0 0 40px rgba(100, 200, 255, 0.6)',
                  '0 0 30px rgba(255, 100, 150, 1), 0 0 60px rgba(100, 200, 255, 0.8)',
                  '0 0 25px rgba(255, 100, 150, 0.9), 0 0 50px rgba(100, 200, 255, 0.7)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              AXIE STUDIO
            </motion.h1>
            
            {/* Neon tube effects */}
            <div className="neon-tubes">
              {Array.from({ length: 8 }, (_, i) => (
                <motion.div
                  key={`tube-${i}`}
                  className="neon-tube"
                  animate={{
                    opacity: [0.6, 1, 0.8, 1],
                    scale: [1, 1.02, 0.98, 1]
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    delay: i * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{
                    left: `${10 + i * 10}%`,
                    background: i % 2 === 0 ? 
                      'linear-gradient(90deg, rgba(255, 100, 150, 0.8), rgba(255, 150, 200, 0.6))' :
                      'linear-gradient(90deg, rgba(100, 200, 255, 0.8), rgba(150, 220, 255, 0.6))'
                  }}
                />
              ))}
            </div>
            
            {/* Electric sparks */}
            <div className="electric-sparks">
              {Array.from({ length: 12 }, (_, i) => (
                <motion.div
                  key={`spark-${i}`}
                  className="electric-spark"
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0.5, 1.2, 0.8],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 0.5 + Math.random() * 0.8,
                    delay: Math.random() * 4,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`
                  }}
                />
              ))}
            </div>
          </motion.div>
          
          {/* Studio backdrop frame */}
          <div className="studio-frame">
            <div className="frame-corner frame-top-left" />
            <div className="frame-corner frame-top-right" />
            <div className="frame-corner frame-bottom-left" />
            <div className="frame-corner frame-bottom-right" />
          </div>
        </motion.div>
        
        {/* Enhanced street and car */}
        <motion.div 
          className="street"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 2, delay: 1.2 }}
          data-aos="fade-up"
          data-aos-delay="1200"
        >
          <motion.div 
            className="road"
            animate={{
              boxShadow: [
                'inset 0 0 50px rgba(0,0,0,0.5)',
                'inset 0 0 80px rgba(0,0,0,0.7)',
                'inset 0 0 60px rgba(0,0,0,0.6)'
              ]
            }}
            transition={{ duration: 15, repeat: Infinity }}
          />
          
          <motion.div 
            className="car moving-car"
            animate={{
              x: ['-180px', '90vw', '75vw', '50vw', '30vw', '15vw', '-180px'],
              scale: [0.7, 0.85, 0.95, 1.1, 1.05, 0.9, 0.7],
              rotateY: [0, 2, 0, -1, 0, 1, 0]
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.15, 0.3, 0.5, 0.7, 0.85, 1]
            }}
          >
            <motion.div 
              className="car-body"
              animate={{
                boxShadow: [
                  '0 4px 15px rgba(0,0,0,0.6)',
                  '0 6px 25px rgba(0,0,0,0.8)',
                  '0 4px 15px rgba(0,0,0,0.6)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <div className="car-roof" />
            <div className="car-windshield" />
            
            {/* Enhanced wheels with better rotation */}
            <motion.div 
              className="car-wheel car-wheel-front"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.4, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
              className="car-wheel car-wheel-rear"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.4, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Enhanced headlights */}
            <motion.div 
              className="headlight headlight-left"
              animate={{ 
                opacity: [0.8, 1, 0.9, 1],
                boxShadow: [
                  '0 0 20px rgba(255,255,200,0.9)',
                  '0 0 30px rgba(255,255,200,1)',
                  '0 0 25px rgba(255,255,200,0.95)'
                ]
              }}
              transition={{ duration: 0.3, repeat: Infinity }}
            />
            <motion.div 
              className="headlight headlight-right"
              animate={{ 
                opacity: [0.9, 1, 0.8, 1],
                boxShadow: [
                  '0 0 20px rgba(255,255,200,0.9)',
                  '0 0 30px rgba(255,255,200,1)',
                  '0 0 25px rgba(255,255,200,0.95)'
                ]
              }}
              transition={{ duration: 0.3, repeat: Infinity, delay: 0.1 }}
            />
            
            <div className="taillight taillight-left" />
            <div className="taillight taillight-right" />
          </motion.div>
          
          {/* Enhanced street reflections */}
          <div className="street-reflections">
            <motion.div 
              className="reflection car-reflection"
              animate={{
                x: ['-180px', '90vw', '75vw', '50vw', '30vw', '15vw', '-180px'],
                opacity: [0.1, 0.2, 0.25, 0.3, 0.25, 0.2, 0.1],
                scaleY: [0.5, 0.6, 0.7, 0.8, 0.7, 0.6, 0.5]
              }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </motion.div>
        
        {/* Enhanced cloud system */}
        <div className="clouds">
          {Array.from({ length: 4 }, (_, i) => (
            <motion.div
              key={`cloud-${i + 1}`}
              className={`cloud cloud-${i + 1}`}
              initial={{ x: -250, opacity: 0 }}
              animate={{ 
                x: 'calc(100vw + 200px)',
                opacity: [0, 0.4, 0.5, 0.3, 0],
                scale: [0.8, 1, 1.1, 0.9, 0.8]
              }}
              transition={{
                duration: 70 + i * 20,
                delay: -25 * i,
                repeat: Infinity,
                ease: "linear"
              }}
              data-aos="fade-in"
              data-aos-duration="3000"
            />
          ))}
        </div>
        
        {/* Floating particles */}
        <FloatingParticles />
        
        {/* Enhanced rain layers */}
        <div className="rain-layer background-rain">
          {lightRaindrops}
        </div>
        
        <div className="rain-layer medium-rain">
          {mediumRaindrops}
        </div>
        
        <div className="rain-layer foreground-rain">
          {heavyRaindrops}
        </div>
        
        <div className="rain-layer splash-rain">
          {splashDrops}
        </div>
        
        {/* Enhanced atmospheric effects */}
        <motion.div 
          className="mist-layer"
          animate={{
            opacity: [0.3, 0.6, 0.4, 0.7],
            transform: [
              'translateX(0px) scale(1)',
              'translateX(15px) scale(1.05)',
              'translateX(-10px) scale(0.98)',
              'translateX(20px) scale(1.02)'
            ]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Advanced ripple effects */}
        <AdvancedRipples />
        
        {/* Enhanced puddle effects */}
        <div className="puddle-effects">
          {Array.from({ length: 12 }, (_, i) => (
            <motion.div
              key={`ripple-${i}`}
              className="rain-ripple"
              initial={{ scale: 0, opacity: 1 }}
              animate={{ 
                scale: [0, 1.5, 3],
                opacity: [0.9, 0.5, 0],
                borderWidth: ['3px', '2px', '1px']
              }}
              transition={{
                duration: 5,
                delay: Math.random() * 6,
                repeat: Infinity,
                ease: "easeOut"
              }}
              style={{
                left: `${Math.random() * 100}%`,
                borderColor: `rgba(173, 216, 230, ${0.3 + Math.random() * 0.3})`
              }}
            />
          ))}
        </div>
        
        {/* Audio status indicator (subtle) */}
        {isLoaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isPlaying ? 0.3 : 0.1 }}
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: isPlaying ? 'rgba(0, 255, 0, 0.5)' : 'rgba(255, 255, 0, 0.5)',
              zIndex: 1000
            }}
          />
        )}
      </div>
    </EnhancedAnimations>
  );
}

export default App;