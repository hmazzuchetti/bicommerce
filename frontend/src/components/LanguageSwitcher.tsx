'use client'

import { useState } from 'react'
import { Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/LanguageContext'

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' }
]

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const currentLanguage = languages.find(lang => lang.code === language)

  const toggleLanguage = (langCode: 'en' | 'pt') => {
    setLanguage(langCode)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      {/* Language Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 hover:text-neon-cyan transition-colors"
      >
        <Globe size={18} />
        <span className="hidden sm:inline text-sm">
          {currentLanguage?.flag} {currentLanguage?.code.toUpperCase()}
        </span>
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 bg-black/90 backdrop-blur-lg border border-neon-blue/30 rounded-lg shadow-lg shadow-neon-blue/20 min-w-[160px] z-50">
          <div className="py-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => toggleLanguage(lang.code as 'en' | 'pt')}
                className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-neon-blue/10 transition-colors ${
                  language === lang.code 
                    ? 'text-neon-cyan bg-neon-blue/5' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="text-sm">{lang.name}</span>
                {language === lang.code && (
                  <div className="ml-auto w-2 h-2 bg-neon-cyan rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}