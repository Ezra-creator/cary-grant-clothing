import React from 'react'

interface SwingTagProps {
  children: React.ReactNode
  variant?: 'default' | 'price' | 'new' | 'sold-out'
  className?: string
}

export default function SwingTag({
  children,
  variant = 'default',
  className = '',
}: SwingTagProps) {
  return (
    <span className={`swing-tag swing-tag--${variant} ${className}`}>
      {children}
    </span>
  )
}
