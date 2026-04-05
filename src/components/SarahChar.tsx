import React from 'react';
import { motion } from 'motion/react';

// الحالات الممكنة للشخصية
export type CharacterState = 'idle' | 'happy' | 'sad' | 'angry' | 'celebrate' | 'sleepy' | 'surprised';

export function SarahChar({ state }: { state: CharacterState }) {
  // Animation variants
  const faceVariants = {
    idle: { 
      y: [0, -4, 0],
      transition: { repeat: Infinity, duration: 4, ease: "easeInOut" }
    },
    happy: { y: [0, -8, 0], transition: { repeat: Infinity, duration: 2 } },
    sad: { y: 2 },
    angry: { x: [-2, 2, -2, 2, 0], transition: { repeat: Infinity, duration: 0.5 } },
    celebrate: { y: [0, -20, 0], transition: { repeat: Infinity, duration: 0.6 } },
    sleepy: { y: [0, 3, 0], transition: { repeat: Infinity, duration: 3 } },
    surprised: { y: -8 },
  };

  const blinkVariants = {
    idle: {
      scaleY: [1, 1, 1, 1, 0, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatDelay: 2,
        times: [0, 0.9, 0.92, 0.95, 0.97, 1]
      }
    },
    happy: { 
      scaleY: [1, 1, 1, 1, 0, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatDelay: 3,
        times: [0, 0.9, 0.92, 0.95, 0.97, 1]
      }
    },
    sad: { 
      scaleY: [1, 1, 1, 1, 0, 1],
      transition: {
        duration: 4,
        repeat: Infinity,
        repeatDelay: 4,
        times: [0, 0.9, 0.92, 0.95, 0.97, 1]
      }
    },
    angry: { scaleY: 1 },
    celebrate: { 
      scaleY: [1, 1, 1, 1, 0, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatDelay: 1,
        times: [0, 0.9, 0.92, 0.95, 0.97, 1]
      }
    },
    sleepy: { scaleY: [0.3, 0.4, 0.3], transition: { repeat: Infinity, duration: 3 } },
    surprised: { scaleY: 1.2 },
  };

  const pupilVariants = {
    idle: {
      x: [0, 2, -2, 0],
      y: [0, -1, 1, 0],
      transition: {
        duration: 10,
        repeat: Infinity,
        times: [0, 0.2, 0.5, 1],
        ease: "easeInOut"
      }
    }
  };

  const mouthVariants = {
    idle: { d: "M 85 135 Q 100 145 115 135" }, // Slight smile
    happy: { d: "M 80 135 Q 100 160 120 135 Z" }, // Big smile
    sad: { d: "M 85 145 Q 100 135 115 145" }, // Frown
    angry: { d: "M 85 140 Q 100 135 115 140" }, // Angry mouth
    celebrate: { d: "M 80 135 Q 100 160 120 135 Z" }, // Big smile
    sleepy: { d: "M 90 135 Q 100 155 110 135 Z" }, // Yawn
    surprised: { d: "M 95 135 Q 100 145 105 135 Z" }, // O shape
  };

  const leftEyebrowVariants = {
    idle: { d: "M 60 95 Q 70 90 80 95", y: 0, rotate: 0 },
    happy: { d: "M 60 90 Q 70 85 80 90", y: -5, rotate: 0 },
    sad: { d: "M 60 95 Q 70 90 80 95", y: 0, rotate: -15 },
    angry: { d: "M 60 85 L 80 95", y: -2, rotate: 0 },
    celebrate: { d: "M 60 90 Q 70 85 80 90", y: -10, rotate: 0 },
    sleepy: { d: "M 60 95 Q 70 90 80 95", y: 5, rotate: 0 },
    surprised: { d: "M 60 85 Q 70 80 80 85", y: -10, rotate: 0 },
  };

  const rightEyebrowVariants = {
    idle: { d: "M 120 95 Q 130 90 140 95", y: 0, rotate: 0 },
    happy: { d: "M 120 90 Q 130 85 140 90", y: -5, rotate: 0 },
    sad: { d: "M 120 95 Q 130 90 140 95", y: 0, rotate: 15 },
    angry: { d: "M 140 85 L 120 95", y: -2, rotate: 0 },
    celebrate: { d: "M 120 90 Q 130 85 140 90", y: -10, rotate: 0 },
    sleepy: { d: "M 120 95 Q 130 90 140 95", y: 5, rotate: 0 },
    surprised: { d: "M 120 85 Q 130 80 140 85", y: -10, rotate: 0 },
  };

  const isHappy = state === 'happy' || state === 'celebrate';
  const isSad = state === 'sad';
  const isAngry = state === 'angry';
  const isSleepy = state === 'sleepy';
  const isSurprised = state === 'surprised';
  const isCelebrate = state === 'celebrate';

  return (
    <motion.svg
      viewBox="0 0 200 200"
      className="w-full h-full drop-shadow-xl"
      initial={state}
      animate={state}
    >
      <motion.g variants={faceVariants}>
        {/* Back Hair (Medium-Long, Rounded Bottom) */}
        <path d="M 50 50 C 20 60, 15 120, 25 170 C 50 185, 150 185, 175 170 C 185 120, 180 60, 150 50 Z" fill="#4A2E1B" />

        {/* Ears */}
        <path d="M 50 110 C 30 110, 30 135, 50 135 Z" fill="#F5B59E" />
        <path d="M 150 110 C 170 110, 170 135, 150 135 Z" fill="#F5B59E" />

        {/* Earrings */}
        <circle cx="38" cy="128" r="8" fill="none" stroke="#E5B15D" strokeWidth="4" />
        <circle cx="162" cy="128" r="8" fill="none" stroke="#E5B15D" strokeWidth="4" />

        {/* Face Base (More beautiful shape) */}
        <path d="M 50 80 L 150 80 L 150 120 C 150 160, 50 160, 50 120 Z" fill="#F5B59E" />

        {/* Cheeks */}
        <motion.circle cx="70" cy="125" r="12" fill="#FF9B9B" animate={{ opacity: isHappy ? 0.6 : 0.2 }} initial={false} />
        <motion.circle cx="130" cy="125" r="12" fill="#FF9B9B" animate={{ opacity: isHappy ? 0.6 : 0.2 }} initial={false} />

        {/* Nose (Cuter) */}
        <path d="M 96 122 Q 100 126 104 122" fill="none" stroke="#C08B73" strokeWidth="2.5" strokeLinecap="round" />

        {/* --- EYES --- */}
        <g>
          {/* Left Eye */}
          {isHappy && !isCelebrate ? (
            <path d="M 58 105 Q 70 95 82 105" fill="none" stroke="#2C3E50" strokeWidth="4" strokeLinecap="round" />
          ) : (
            <g>
              <motion.g 
                variants={blinkVariants} 
                animate={state} 
                initial={false}
                style={{ transformOrigin: "50% 50%", transformBox: "fill-box" }}
              >
                {/* Sclera (White part) */}
                <circle cx="70" cy="105" r="14" fill="#FFFFFF" />
                
                {/* Pupil */}
                <motion.circle 
                  cx="70" cy="105" 
                  r={isSurprised ? 5 : isCelebrate ? 11 : 9} 
                  fill="#2C3E50" 
                  variants={pupilVariants}
                  animate={state === 'idle' ? 'idle' : ''}
                  initial={false}
                />
                
                {/* Sparkles */}
                {isCelebrate ? (
                  <g>
                    <path d="M 70 94 Q 70 100 64 100 Q 70 100 70 106 Q 70 100 76 100 Q 70 100 70 94 Z" fill="#FFFFFF" />
                    <path d="M 76 106 Q 76 110 72 110 Q 76 110 76 114 Q 76 110 80 110 Q 76 110 76 106 Z" fill="#FFFFFF" />
                  </g>
                ) : isSurprised ? null : (
                  <motion.circle 
                    cx="67" cy="102" r="3" fill="#FFFFFF" 
                    variants={pupilVariants}
                    animate={state === 'idle' ? 'idle' : ''}
                    initial={false}
                  />
                )}

                {/* Sad Tears inside eye */}
                {isSad && (
                  <path d="M 56 105 A 14 14 0 0 0 84 105 Q 70 102 56 105 Z" fill="#74B9FF" opacity="0.8" />
                )}

                {/* Sleepy Eyelid */}
                {isSleepy && (
                  <g>
                    <path d="M 56 105 A 14 14 0 0 1 84 105 Z" fill="#E08B7B" />
                    <path d="M 56 105 L 84 105" stroke="#2C3E50" strokeWidth="2" strokeLinecap="round" />
                  </g>
                )}

                {/* Angry Eyelid */}
                {isAngry && (
                  <g>
                    <path d="M 54 95 L 86 105 L 86 85 L 54 85 Z" fill="#F5B59E" />
                    <path d="M 54 95 L 86 105" stroke="#2C3E50" strokeWidth="3" strokeLinecap="round" />
                  </g>
                )}
              </motion.g>

              {/* Eyelashes (Outside scaling group to stay stable) */}
              <path d="M 54 105 C 54 90, 86 90, 86 105" fill="none" stroke="#2C3E50" strokeWidth="3" strokeLinecap="round" />
              <path d="M 54 105 Q 48 102 46 98" fill="none" stroke="#2C3E50" strokeWidth="3" strokeLinecap="round" />
            </g>
          )}

          {/* Right Eye */}
          {isHappy && !isCelebrate ? (
            <path d="M 118 105 Q 130 95 142 105" fill="none" stroke="#2C3E50" strokeWidth="4" strokeLinecap="round" />
          ) : (
            <g>
              <motion.g 
                variants={blinkVariants} 
                animate={state} 
                initial={false}
                style={{ transformOrigin: "50% 50%", transformBox: "fill-box" }}
              >
                {/* Sclera (White part) */}
                <circle cx="130" cy="105" r="14" fill="#FFFFFF" />
                
                {/* Pupil */}
                <motion.circle 
                  cx="130" cy="105" 
                  r={isSurprised ? 5 : isCelebrate ? 11 : 9} 
                  fill="#2C3E50" 
                  variants={pupilVariants}
                  animate={state === 'idle' ? 'idle' : ''}
                  initial={false}
                />
                
                {/* Sparkles */}
                {isCelebrate ? (
                  <g>
                    <path d="M 130 94 Q 130 100 124 100 Q 130 100 130 106 Q 130 100 136 100 Q 130 100 130 94 Z" fill="#FFFFFF" />
                    <path d="M 136 106 Q 136 110 132 110 Q 136 110 136 114 Q 136 110 140 110 Q 136 110 136 106 Z" fill="#FFFFFF" />
                  </g>
                ) : isSurprised ? null : (
                  <motion.circle 
                    cx="127" cy="102" r="3" fill="#FFFFFF" 
                    variants={pupilVariants}
                    animate={state === 'idle' ? 'idle' : ''}
                    initial={false}
                  />
                )}

                {/* Sad Tears inside eye */}
                {isSad && (
                  <path d="M 116 105 A 14 14 0 0 0 144 105 Q 130 102 116 105 Z" fill="#74B9FF" opacity="0.8" />
                )}

                {/* Sleepy Eyelid */}
                {isSleepy && (
                  <g>
                    <path d="M 116 105 A 14 14 0 0 1 144 105 Z" fill="#E08B7B" />
                    <path d="M 116 105 L 144 105" stroke="#2C3E50" strokeWidth="2" strokeLinecap="round" />
                  </g>
                )}

                {/* Angry Eyelid */}
                {isAngry && (
                  <g>
                    <path d="M 146 95 L 114 105 L 114 85 L 146 85 Z" fill="#F5B59E" />
                    <path d="M 146 95 L 114 105" stroke="#2C3E50" strokeWidth="3" strokeLinecap="round" />
                  </g>
                )}
              </motion.g>

              {/* Eyelashes (Outside scaling group to stay stable) */}
              <path d="M 114 105 C 114 90, 146 90, 146 105" fill="none" stroke="#2C3E50" strokeWidth="3" strokeLinecap="round" />
              <path d="M 146 105 Q 152 102 154 98" fill="none" stroke="#2C3E50" strokeWidth="3" strokeLinecap="round" />
            </g>
          )}
        </g>

        {/* Eyebrows */}
        <motion.path
          variants={leftEyebrowVariants}
          animate={state}
          initial={false}
          fill="none"
          stroke="#2C3E50"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <motion.path
          variants={rightEyebrowVariants}
          animate={state}
          initial={false}
          fill="none"
          stroke="#2C3E50"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Mouth */}
        <motion.path
          variants={mouthVariants}
          animate={state}
          initial={false}
          fill={isHappy || isCelebrate ? "#FFFFFF" : isSleepy || isSurprised ? "#8B2B2B" : "none"}
          stroke="#2C3E50"
          strokeWidth={isHappy || isCelebrate || isSleepy || isSurprised ? 0 : 3}
          strokeLinecap="round"
        />
        
        {/* Teeth/Tongue for Celebrate */}
        {isCelebrate && (
          <path d="M 90 145 Q 100 150 110 145 Z" fill="#FF7675" />
        )}

        {/* Front Hair (Drawn AFTER eyes so it layers correctly, shaped to frame face) */}
        {/* Top Bangs */}
        <path d="M 40 85 C 40 30, 100 20, 100 55 C 100 20, 160 30, 160 85 C 140 60, 110 60, 100 70 C 90 60, 60 60, 40 85 Z" fill="#5A3A29" />
        
        {/* Left Side Lock (Shorter, Rounded) */}
        <path d="M 40 80 C 30 120, 32 160, 36 172 C 38 180, 48 180, 50 172 C 55 140, 55 110, 50 80 Z" fill="#5A3A29" />
        
        {/* Right Side Lock (Shorter, Rounded) */}
        <path d="M 160 80 C 170 120, 168 160, 164 172 C 162 180, 152 180, 150 172 C 145 140, 145 110, 150 80 Z" fill="#5A3A29" />

        {/* Tear for Sad */}
        {isSad && (
          <motion.path
            d="M 135 120 Q 140 135 135 140 Q 130 135 135 120 Z"
            fill="#74B9FF"
            animate={{ y: [0, 5, 0], opacity: [0, 1, 0] }}
            initial={false}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        )}

        {/* Steam for Angry */}
        {isAngry && (
          <motion.path
            d="M 160 70 Q 170 60 160 50"
            fill="none"
            stroke="#CBD5E1"
            strokeWidth="3"
            strokeLinecap="round"
            animate={{ y: [0, -10], opacity: [1, 0] }}
            initial={false}
            transition={{ repeat: Infinity, duration: 1 }}
          />
        )}

        {/* Zzz for Sleepy */}
        {isSleepy && (
          <g>
            <motion.text
              x="140" y="70" fill="#2C3E50" fontSize="16" fontWeight="bold"
              animate={{ y: [0, -10], opacity: [0, 1, 0], x: [0, 5] }}
              initial={false}
              transition={{ repeat: Infinity, duration: 2, delay: 0 }}
            >
              Z
            </motion.text>
            <motion.text
              x="155" y="55" fill="#2C3E50" fontSize="12" fontWeight="bold"
              animate={{ y: [0, -10], opacity: [0, 1, 0], x: [0, 5] }}
              initial={false}
              transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
            >
              z
            </motion.text>
          </g>
        )}
      </motion.g>
    </motion.svg>
  );
}
