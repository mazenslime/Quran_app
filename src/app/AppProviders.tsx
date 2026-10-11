import React from 'react'
import { AppStateProvider } from './app-state'

export interface AppProvidersProps {
  children: React.ReactNode
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return <AppStateProvider>{children}</AppStateProvider>
}
