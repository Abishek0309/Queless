import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'rounded' | 'circular';
  dark?: boolean;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = 'h-4 w-full',
  variant = 'rounded',
  dark = false,
  style,
}) => {
  const variantStyles = {
    rectangular: 'rounded-none',
    rounded: 'rounded-xl',
    circular: 'rounded-full',
  }[variant];

  return (
    <div
      style={style}
      className={`${variantStyles} ${dark ? 'animate-shimmer-dark' : 'animate-shimmer'} ${className}`}
    />
  );
};
