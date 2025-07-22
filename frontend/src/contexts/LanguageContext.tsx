'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'en' | 'pt'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  messages: any
  t: (key: string, params?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Helper function to get nested object value using dot notation
const getNestedValue = (obj: any, path: string): string => {
  return path.split('.').reduce((current, key) => current?.[key], obj) || path
}

// Simple interpolation function
const interpolate = (template: string, params: Record<string, string | number> = {}): string => {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return params[key]?.toString() || match
  })
}

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('en')
  const [messages, setMessages] = useState<any>({})

  // Load messages when language changes
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const messageModule = await import(`@/messages/${language}.json`)
        setMessages(messageModule.default)
      } catch (error) {
        console.error(`Failed to load messages for language: ${language}`, error)
        // Fallback to empty object
        setMessages({})
      }
    }
    
    loadMessages()
  }, [language])

  // Load saved language preference on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'pt')) {
      setLanguageState(savedLanguage)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
  }

  // Translation function
  const t = (key: string, params?: Record<string, string | number>): string => {
    const value = getNestedValue(messages, key)
    return params ? interpolate(value, params) : value
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, messages, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}