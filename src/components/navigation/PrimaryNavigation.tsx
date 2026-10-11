import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHouse,
  faBookOpen,
  faMagnifyingGlass,
  faBookmark,
  faSun,
  faMoon,
} from '@fortawesome/free-solid-svg-icons'
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import type { AppRoute, NavigationTarget } from '../../app/routes'
import { useAppState } from '../../app/app-state'
import './navigation.css'

export interface PrimaryNavigationProps {
  currentRoute: AppRoute
  onNavigate: (target: NavigationTarget) => void
}

interface NavItem {
  id: AppRoute
  en: string
  ar: string
  icon: IconDefinition
  deferred?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', en: 'Home', ar: 'الرئيسية', icon: faHouse },
  { id: 'browse', en: 'Quran', ar: 'المصحف', icon: faBookOpen },
  { id: 'search', en: 'Search', ar: 'البحث', icon: faMagnifyingGlass },
  { id: 'bookmarks', en: 'Bookmarks', ar: 'الإشارات', icon: faBookmark },
]

export const PrimaryNavigation: React.FC<PrimaryNavigationProps> = ({
  currentRoute,
  onNavigate,
}) => {
  const { locale, setLocale, resolvedTheme, setTheme, announceStatus } = useAppState()
  const isArabic = locale === 'ar'

  const handleNavClick = (item: NavItem) => {
    if (item.deferred) {
      announceStatus(
        isArabic
          ? `${item.ar} ميزة قادمة في التحديث القادم بإذن الله`
          : `${item.en} is an upcoming feature coming soon`
      )
      return
    }

    onNavigate({ route: item.id })
  }

  const toggleLanguage = () => {
    const nextLocale = locale === 'ar' ? 'en' : 'ar'
    setLocale(nextLocale)
    announceStatus(nextLocale === 'ar' ? 'تم تغيير اللغة إلى العربية' : 'Language switched to English')
  }

  const toggleTheme = () => {
    const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    announceStatus(nextTheme === 'dark' ? 'Dark theme active' : 'Light theme active')
  }

  return (
    <header className="primary-nav-header">
      <nav
        className="primary-nav-inner"
        role="navigation"
        aria-label={isArabic ? 'التنقل الرئيسي' : 'Primary Navigation'}
      >
        <button
          type="button"
          className="primary-nav-brand button-header"
          onClick={() => onNavigate({ route: 'home' })}
          aria-label={isArabic ? 'الصفحة الرئيسية للقرآن' : 'Quran Sanctuary Home'}
        >
          <FontAwesomeIcon icon={faBookOpen} aria-hidden="true" style={{ marginInlineEnd: '0.5rem' }} />
          <span>{isArabic ? 'المصحف الشريف' : 'Quran Sanctuary'}</span>
        </button>

        <ul className="primary-nav-links" role="menubar">
          {NAV_ITEMS.map((item) => {
            const isActive = currentRoute === item.id
            return (
              <li key={item.id} className="primary-nav-item" role="none">
                <button
                  type="button"
                  role="menuitem"
                  className={`primary-nav-link ${
                    isActive ? 'primary-nav-link--active' : ''
                  }`}
                  onClick={() => handleNavClick(item)}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={isArabic ? item.ar : item.en}
                >
                  <FontAwesomeIcon icon={item.icon} aria-hidden="true" style={{ marginInlineEnd: '0.4rem' }} />
                  <span>{isArabic ? item.ar : item.en}</span>
                  {item.deferred && (
                    <span className="nav-deferred-tag" aria-hidden="true">
                      {isArabic ? 'قريباً' : 'Soon'}
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>

        <div className="primary-nav-controls">
          <button
            type="button"
            className="nav-icon-btn"
            onClick={toggleLanguage}
            aria-label={
              isArabic ? 'تغيير اللغة إلى الإنجليزية' : 'Switch interface to Arabic'
            }
          >
            {locale === 'ar' ? 'EN' : 'عربي'}
          </button>

          <button
            type="button"
            className="nav-icon-btn"
            onClick={toggleTheme}
            aria-label={
              isArabic
                ? (resolvedTheme === 'dark' ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الليلي')
                : (resolvedTheme === 'dark' ? 'Toggle light mode' : 'Toggle night mode')
            }
          >
            <FontAwesomeIcon icon={resolvedTheme === 'dark' ? faSun : faMoon} aria-hidden="true" />
          </button>
        </div>
      </nav>
    </header>
  )
}
