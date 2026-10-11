import React from 'react'
import './ui.css'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  ariaLabel?: string
  fullWidth?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      children,
      ariaLabel,
      fullWidth = false,
      className = '',
      type = 'button',
      disabled,
      ...props
    },
    ref
  ) => {
    const classNames = [
      'sanctuary-button',
      `sanctuary-button--${variant}`,
      `sanctuary-button--${size}`,
      fullWidth ? 'sanctuary-button--full' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <button
        ref={ref}
        type={type}
        className={classNames}
        aria-label={ariaLabel}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
