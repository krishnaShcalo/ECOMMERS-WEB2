import React from 'react';
import { DEFAULT_AVATAR } from '../../config/assets';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt = 'User avatar',
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  return (
    <img
      src={src || DEFAULT_AVATAR}
      alt={alt}
      className={`rounded-full ${sizeClasses[size]} ${className}`}
    />
  );
};

export default Avatar; 