import React from 'react';

export type PandaMood = 'happy' | 'talking' | 'cheering' | 'waving' | 'thinking';

interface PandaAvatarProps {
  mood?: PandaMood;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const PandaAvatar: React.FC<PandaAvatarProps> = ({
  mood = 'happy',
  size = 'md',
  className = ''
}) => {
  const pixelSizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${pixelSizes[size]} ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md overflow-visible">
        {/* Left Ear */}
        <circle cx="24" cy="24" r="14" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
        <circle cx="24" cy="24" r="7" fill="#334155" opacity="0.6" />

        {/* Right Ear */}
        <circle cx="76" cy="24" r="14" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
        <circle cx="76" cy="24" r="7" fill="#334155" opacity="0.6" />

        {/* Head Base */}
        <ellipse cx="50" cy="54" rx="42" ry="38" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />

        {/* Left Eye Black Patch */}
        <ellipse cx="33" cy="50" rx="11" ry="14" transform="rotate(-15 33 50)" fill="#1E293B" />
        {/* Right Eye Black Patch */}
        <ellipse cx="67" cy="50" rx="11" ry="14" transform="rotate(15 67 50)" fill="#1E293B" />

        {/* Eyes & Expressions */}
        {mood === 'cheering' ? (
          <>
            {/* Sparkly Star Eyes */}
            <path d="M 33 44 L 35 48 L 39 49 L 36 52 L 37 56 L 33 53 L 29 56 L 30 52 L 27 49 L 31 48 Z" fill="#FBBF24" />
            <path d="M 67 44 L 69 48 L 73 49 L 70 52 L 71 56 L 67 53 L 63 56 L 64 52 L 61 49 L 65 48 Z" fill="#FBBF24" />
          </>
        ) : (
          <>
            {/* Left Eye Eyeball */}
            <circle cx="34" cy="50" r="5" fill="#FFFFFF" />
            <circle cx="35" cy="50" r="3" fill="#0F172A" />
            <circle cx="36" cy="49" r="1.2" fill="#FFFFFF" />

            {/* Right Eye Eyeball */}
            <circle cx="66" cy="50" r="5" fill="#FFFFFF" />
            <circle cx="65" cy="50" r="3" fill="#0F172A" />
            <circle cx="64" cy="49" r="1.2" fill="#FFFFFF" />
          </>
        )}

        {/* Rosy Pink Cheeks */}
        <ellipse cx="23" cy="62" rx="7" ry="4" fill="#FDA4AF" opacity="0.8" />
        <ellipse cx="77" cy="62" rx="7" ry="4" fill="#FDA4AF" opacity="0.8" />

        {/* Cute Nose */}
        <ellipse cx="50" cy="59" rx="5.5" ry="4" fill="#1E293B" />
        <ellipse cx="49" cy="58" rx="1.5" ry="0.8" fill="#94A3B8" />

        {/* Mouth */}
        {mood === 'talking' ? (
          // Open talking mouth
          <path d="M 45 66 Q 50 74 55 66 Z" fill="#F43F5E" stroke="#1E293B" strokeWidth="1.5" />
        ) : (
          // Sweet gentle smile
          <path d="M 44 65 Q 50 71 56 65" fill="none" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />
        )}

        {/* Little accessory: cute green bamboo leaf or bow on head */}
        <path d="M 50 18 C 45 10, 36 12, 38 20 C 42 21, 48 20, 50 18 Z" fill="#10B981" />
        <path d="M 50 18 C 55 10, 64 12, 62 20 C 58 21, 52 20, 50 18 Z" fill="#059669" />
      </svg>
    </div>
  );
};
