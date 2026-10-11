import React from 'react'
import { useAppState } from '../../app/app-state'
import './ui.css'

export interface SkipLinkProps {
  targetId?: string
}

export const SkipLink: React.FC<SkipLinkProps> = ({ targetId = 'main-content' }) => {
  const { locale } = useAppState()
  const label = locale === 'ar' ? 'تخطي إلى المحتوى الرئيسي' : 'Skip to main content'

  return (
    <a href={`#${targetId}`} className="sanctuary-skip-link">
      {label}
    </a>
  )
}
