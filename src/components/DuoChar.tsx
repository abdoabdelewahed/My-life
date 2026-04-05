import React from 'react';
import { motion } from 'motion/react';

// الحالات الممكنة للشخصية
export type CharacterState = 'idle' | 'happy' | 'sad' | 'angry' | 'celebrate' | 'sleepy' | 'surprised';

export function DuoChar({ state }: { state: CharacterState }) {
  return (
    <motion.svg 
      width="100%" 
      height="100%" 
      viewBox="0 0 200 200" 
      className="overflow-visible"
      initial={false}
      animate={state}
    >
      <motion.g style={{ scale: 1.2, transformOrigin: 'center' }}>
        {/* Main Body Group */}
        <motion.g variants={{
        idle: { 
          y: [0, -5, 0, -2, 0], 
          rotate: [0, -1, 1, -1, 0],
          transition: { 
            repeat: Infinity, 
            duration: 4, 
            ease: "easeInOut",
            times: [0, 0.2, 0.5, 0.8, 1]
          } 
        },
        happy: { y: [0, -20, 0], transition: { repeat: Infinity, duration: 0.6, ease: "easeOut" } },
        sad: { y: 10, scaleY: 0.95, transition: { duration: 0.3 } },
        angry: { x: [-2, 2, -2], transition: { repeat: Infinity, duration: 0.1 } },
        celebrate: { y: [0, -25, 0], rotate: [-5, 5, -5], transition: { repeat: Infinity, duration: 0.5, ease: "easeOut" } },
        sleepy: { y: [2, 6, 2], scaleY: [0.98, 0.94, 0.98], scaleX: [1, 1.02, 1], transition: { repeat: Infinity, duration: 3, ease: "easeInOut" } },
        surprised: { y: -15, scaleY: 1.1, transition: { type: "spring", stiffness: 300, damping: 10 } }
      }}>
        
        {/* Left Foot */}
        <motion.path 
          d="M 70 160 C 70 150, 90 150, 90 160 C 90 170, 70 170, 70 160 Z" 
          fill="#ff9600" 
          variants={{
            idle: {
              y: [0, -2, 0],
              transition: { repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.5 }
            },
            happy: { y: [0, -5, 0], transition: { repeat: Infinity, duration: 0.6, delay: 0.1 } },
            celebrate: { y: [0, -10, 0], transition: { repeat: Infinity, duration: 0.5, delay: 0.1 } },
            surprised: { y: -5 }
          }}
        />
        {/* Right Foot */}
        <motion.path 
          d="M 110 160 C 110 150, 130 150, 130 160 C 130 170, 110 170, 110 160 Z" 
          fill="#ff9600" 
          variants={{
            idle: {
              y: [0, -2, 0],
              transition: { repeat: Infinity, duration: 2, ease: "easeInOut" }
            },
            happy: { y: [0, -5, 0], transition: { repeat: Infinity, duration: 0.6, delay: 0.2 } },
            celebrate: { y: [0, -10, 0], transition: { repeat: Infinity, duration: 0.5, delay: 0.2 } },
            surprised: { y: -5 }
          }}
        />

        {/* Left Wing */}
        <motion.path 
          d="M 45 90 C 5 90, 5 130, 35 140 C 45 144, 50 130, 50 130 Z" 
          fill="#58cc02" 
          variants={{
            idle: { 
              rotate: [0, -5, 0], 
              originX: 0.9, 
              originY: 0.1,
              transition: { repeat: Infinity, duration: 2, ease: "easeInOut" }
            },
            happy: { rotate: -40, originX: 0.9, originY: 0.1 },
            sad: { rotate: 20, originX: 0.9, originY: 0.1 },
            angry: { rotate: -30, originX: 0.9, originY: 0.1 },
            celebrate: { rotate: [-20, -70, -20], originX: 0.9, originY: 0.1, transition: { repeat: Infinity, duration: 0.3 } },
            sleepy: { rotate: 10, originX: 0.9, originY: 0.1 },
            surprised: { rotate: -60, originX: 0.9, originY: 0.1 }
          }}
        />
        
        {/* Right Wing */}
        <motion.path 
          d="M 155 90 C 195 90, 195 130, 165 140 C 155 144, 150 130, 150 130 Z" 
          fill="#58cc02" 
          variants={{
            idle: { 
              rotate: [0, 5, 0], 
              originX: 0.1, 
              originY: 0.1,
              transition: { repeat: Infinity, duration: 2, ease: "easeInOut" }
            },
            happy: { rotate: 40, originX: 0.1, originY: 0.1 },
            sad: { rotate: -20, originX: 0.1, originY: 0.1 },
            angry: { rotate: 30, originX: 0.1, originY: 0.1 },
            celebrate: { rotate: [20, 70, 20], originX: 0.1, originY: 0.1, transition: { repeat: Infinity, duration: 0.3 } },
            sleepy: { rotate: -10, originX: 0.1, originY: 0.1 },
            surprised: { rotate: 60, originX: 0.1, originY: 0.1 }
          }}
        />

        {/* Body */}
        <path d="M 45 75 C 45 25, 75 25, 85 45 C 95 60, 105 60, 115 45 C 125 25, 155 25, 155 75 L 155 130 C 155 165, 135 165, 100 165 C 65 165, 45 165, 45 130 Z" fill="#58cc02" />

        {/* Belly */}
        <path d="M 60 115 Q 100 105 140 115 Q 135 155 100 155 Q 65 155 60 115 Z" fill="#89e219" />
        
        {/* Belly Scales */}
        <path d="M 85 125 Q 90 130 95 125" fill="none" stroke="#78c800" strokeWidth="3" strokeLinecap="round" />
        <path d="M 105 125 Q 110 130 115 125" fill="none" stroke="#78c800" strokeWidth="3" strokeLinecap="round" />
        <path d="M 95 135 Q 100 140 105 135" fill="none" stroke="#78c800" strokeWidth="3" strokeLinecap="round" />

        {/* Eye Mask */}
        <path d="M 55 75 C 55 40, 95 40, 100 65 C 105 40, 145 40, 145 75 C 145 110, 105 115, 100 95 C 95 115, 55 110, 55 75 Z" fill="#89e219" />

        {/* Eyes Group */}
        <motion.g variants={{
          idle: { opacity: 1 },
          happy: { opacity: 0 },
          sad: { opacity: 1 },
          angry: { opacity: 1 },
          celebrate: { opacity: 0 },
          sleepy: { opacity: 0 },
          surprised: { opacity: 1 }
        }}>
          {/* Left Eye */}
          <clipPath id="left-eye-clip">
            <ellipse cx="80" cy="75" rx="14" ry="18" />
          </clipPath>
          <g clipPath="url(#left-eye-clip)">
            <ellipse cx="80" cy="75" rx="14" ry="18" fill="#ffffff" />
            <motion.g variants={{
              idle: { x: 0, y: 0, scale: 1 },
              sad: { x: 1, y: 5, scale: 1 },
              angry: { x: 2, y: -2, scale: 1 },
              sleepy: { opacity: 0 },
              surprised: { x: 0, y: 0, scale: 0.6, originX: 0.5, originY: 0.5 }
            }}>
              <ellipse cx="84" cy="75" rx="6" ry="9" fill="#4b4b4b" />
              <circle cx="86" cy="71" r="2.5" fill="#ffffff" />
            </motion.g>
            {/* Left Eyelid */}
            <motion.rect 
              x="60" y="40" width="40" height="40" fill="#89e219"
              variants={{
                idle: { 
                  y: [-45, -45, -45, 0, -45], 
                  rotate: 0,
                  transition: {
                    repeat: Infinity,
                    duration: 4,
                    times: [0, 0.8, 0.85, 0.9, 1]
                  }
                },
                sad: { y: -20, rotate: -15, originX: 0.5, originY: 0.5 },
                angry: { y: -10, rotate: 25, originX: 0.5, originY: 0.5 },
                sleepy: { y: 0, rotate: 0 },
                surprised: { y: -50, rotate: 0 }
              }}
            />
          </g>

          {/* Right Eye */}
          <clipPath id="right-eye-clip">
            <ellipse cx="120" cy="75" rx="14" ry="18" />
          </clipPath>
          <g clipPath="url(#right-eye-clip)">
            <ellipse cx="120" cy="75" rx="14" ry="18" fill="#ffffff" />
            <motion.g variants={{
              idle: { x: 0, y: 0, scale: 1 },
              sad: { x: -1, y: 5, scale: 1 },
              angry: { x: -2, y: -2, scale: 1 },
              sleepy: { opacity: 0 },
              surprised: { x: 0, y: 0, scale: 0.6, originX: 0.5, originY: 0.5 }
            }}>
              <ellipse cx="116" cy="75" rx="6" ry="9" fill="#4b4b4b" />
              <circle cx="118" cy="71" r="2.5" fill="#ffffff" />
            </motion.g>
            {/* Right Eyelid */}
            <motion.rect 
              x="100" y="40" width="40" height="40" fill="#89e219"
              variants={{
                idle: { 
                  y: [-45, -45, -45, 0, -45], 
                  rotate: 0,
                  transition: {
                    repeat: Infinity,
                    duration: 4,
                    times: [0, 0.8, 0.85, 0.9, 1]
                  }
                },
                sad: { y: -20, rotate: 15, originX: 0.5, originY: 0.5 },
                angry: { y: -10, rotate: -25, originX: 0.5, originY: 0.5 },
                sleepy: { y: 0, rotate: 0 },
                surprised: { y: -50, rotate: 0 }
              }}
            />
          </g>
        </motion.g>

        {/* Happy Eyes (Curves) */}
        <motion.g variants={{
          idle: { opacity: 0 },
          happy: { opacity: 1 },
          sad: { opacity: 0 },
          angry: { opacity: 0 },
          celebrate: { opacity: 1 },
          sleepy: { opacity: 0 },
          surprised: { opacity: 0 }
        }}>
          <path d="M 70 75 Q 80 60 90 75" fill="none" stroke="#4b4b4b" strokeWidth="4" strokeLinecap="round" />
          <path d="M 110 75 Q 120 60 130 75" fill="none" stroke="#4b4b4b" strokeWidth="4" strokeLinecap="round" />
        </motion.g>

        {/* Sleepy Eyes (Closed Curves) */}
        <motion.g variants={{
          idle: { opacity: 0 },
          happy: { opacity: 0 },
          sad: { opacity: 0 },
          angry: { opacity: 0 },
          celebrate: { opacity: 0 },
          sleepy: { opacity: 1 },
          surprised: { opacity: 0 }
        }}>
          <path d="M 70 75 Q 80 85 90 75" fill="none" stroke="#4b4b4b" strokeWidth="4" strokeLinecap="round" />
          <path d="M 110 75 Q 120 85 130 75" fill="none" stroke="#4b4b4b" strokeWidth="4" strokeLinecap="round" />
        </motion.g>

        {/* Beak */}
        <motion.g variants={{
          idle: { y: 0, scaleY: 1 },
          happy: { y: -2, scaleY: 1 },
          sad: { y: 2, scaleY: 1 },
          angry: { y: 0, scaleY: 1 },
          celebrate: { y: -2, scaleY: [1, 1.2, 1], transition: { repeat: Infinity, duration: 0.5 } },
          sleepy: { y: 2, scaleY: 0.9 },
          surprised: { y: 5, scaleY: 1.5, originY: 0 }
        }}>
          <path d="M 90 88 Q 100 85 110 88 Q 100 105 90 88 Z" fill="#ff9600" />
          <path d="M 92 89 Q 100 87 108 89 Q 100 100 92 89 Z" fill="#ffc800" />
        </motion.g>

        {/* Tears */}
        <motion.g variants={{ sad: { opacity: 1 }, default: { opacity: 0 } }} initial="default" animate={state === 'sad' ? 'sad' : 'default'}>
          <motion.path d="M 75 95 Q 75 105 70 110 Q 65 105 65 95 Q 70 90 75 95 Z" fill="#00bbf9"
            animate={state === 'sad' ? { y: [0, 30], opacity: [0, 1, 0] } : {}} transition={{ repeat: Infinity, duration: 1.2 }} />
          <motion.path d="M 135 95 Q 135 105 130 110 Q 125 105 125 95 Q 130 90 135 95 Z" fill="#00bbf9"
            animate={state === 'sad' ? { y: [0, 30], opacity: [0, 1, 0] } : {}} transition={{ repeat: Infinity, duration: 1.2, delay: 0.6 }} />
        </motion.g>

      </motion.g>

      {/* Extras */}
      {/* Sleepy Zzz */}
      <motion.g variants={{ sleepy: { opacity: 1 }, default: { opacity: 0 } }} initial="default" animate={state === 'sleepy' ? 'sleepy' : 'default'}>
        <motion.text x="120" y="50" fontSize="18" fill="#8b5cf6" fontWeight="bold"
          animate={state === 'sleepy' ? { y: [0, -15], x: [0, 10], opacity: [0, 1, 0], scale: [0.5, 1] } : {}} transition={{ repeat: Infinity, duration: 2.5, ease: "easeOut" }} >Z</motion.text>
        <motion.text x="140" y="30" fontSize="24" fill="#8b5cf6" fontWeight="bold"
          animate={state === 'sleepy' ? { y: [0, -15], x: [0, 10], opacity: [0, 1, 0], scale: [0.5, 1] } : {}} transition={{ repeat: Infinity, duration: 2.5, delay: 0.8, ease: "easeOut" }} >Z</motion.text>
        <motion.text x="165" y="5" fontSize="32" fill="#8b5cf6" fontWeight="bold"
          animate={state === 'sleepy' ? { y: [0, -15], x: [0, 10], opacity: [0, 1, 0], scale: [0.5, 1] } : {}} transition={{ repeat: Infinity, duration: 2.5, delay: 1.6, ease: "easeOut" }} >Z</motion.text>
      </motion.g>

      {/* Surprised Exclamation */}
      <motion.g variants={{ surprised: { opacity: 1 }, default: { opacity: 0 } }} initial="default" animate={state === 'surprised' ? 'surprised' : 'default'}>
        <motion.path d="M 100 15 L 100 -15 M 100 -25 L 100 -30" stroke="#ffc800" strokeWidth="6" strokeLinecap="round"
          animate={state === 'surprised' ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 15 }} style={{ originX: '100px', originY: '15px' }} />
      </motion.g>

      {/* Steam */}
      <motion.g variants={{ angry: { opacity: 1 }, default: { opacity: 0 } }} initial="default" animate={state === 'angry' ? 'angry' : 'default'}>
        <motion.path d="M 100 35 Q 90 20 105 10 Q 120 0 100 -15" fill="none" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round"
          animate={state === 'angry' ? { y: [0, -15], opacity: [0, 1, 0] } : {}} transition={{ repeat: Infinity, duration: 1 }} />
        <motion.path d="M 80 40 Q 70 25 85 15 Q 100 5 80 -10" fill="none" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round"
          animate={state === 'angry' ? { y: [0, -15], opacity: [0, 1, 0] } : {}} transition={{ repeat: Infinity, duration: 1, delay: 0.3 }} />
      </motion.g>

      {/* Sparkles */}
      <motion.g variants={{ happy: { opacity: 1 }, celebrate: { opacity: 1 }, default: { opacity: 0 } }} initial="default" animate={['happy', 'celebrate'].includes(state) ? 'happy' : 'default'}>
        <motion.path d="M 30 50 L 33 42 L 41 39 L 33 36 L 30 28 L 27 36 L 19 39 L 27 42 Z" fill="#ffc800"
          animate={['happy', 'celebrate'].includes(state) ? { scale: [0, 1, 0], rotate: [0, 90, 180] } : {}} transition={{ repeat: Infinity, duration: 1.5 }} />
        <motion.path d="M 170 60 L 173 52 L 181 49 L 173 46 L 170 38 L 167 46 L 159 49 L 167 52 Z" fill="#ffc800"
          animate={['happy', 'celebrate'].includes(state) ? { scale: [0, 1.2, 0], rotate: [0, -90, -180] } : {}} transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }} />
        <motion.path d="M 40 130 L 42 125 L 47 123 L 42 121 L 40 116 L 38 121 L 33 123 L 38 125 Z" fill="#ffc800"
          animate={['happy', 'celebrate'].includes(state) ? { scale: [0, 0.8, 0], rotate: [0, 45, 90] } : {}} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} />
      </motion.g>

      {/* Music Notes */}
      <motion.g variants={{ celebrate: { opacity: 1 }, default: { opacity: 0 } }} initial="default" animate={state === 'celebrate' ? 'celebrate' : 'default'}>
        <motion.path d="M 160 30 L 160 50 A 5 5 0 1 1 150 50 A 5 5 0 0 1 160 45 L 160 35 L 170 38 L 170 33 Z" fill="#00bbf9"
          animate={state === 'celebrate' ? { y: [0, -20], x: [0, 10], opacity: [0, 1, 0] } : {}} transition={{ repeat: Infinity, duration: 1.5 }} />
        <motion.path d="M 40 20 L 40 40 A 5 5 0 1 1 30 40 A 5 5 0 0 1 40 35 L 40 25 L 50 28 L 50 23 Z" fill="#ff0054"
          animate={state === 'celebrate' ? { y: [0, -20], x: [0, -10], opacity: [0, 1, 0] } : {}} transition={{ repeat: Infinity, duration: 1.5, delay: 0.7 }} />
      </motion.g>

      </motion.g>
    </motion.svg>
  );
}
