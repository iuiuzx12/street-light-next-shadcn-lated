import { LoginForm } from "@/components/login-form"
import { useTranslations } from 'next-intl'

export default function Page() {
  const t = useTranslations('LoginPage')
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center p-4 md:p-10">
      {/* Background with sky gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-400 via-sky-500 to-sky-600">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/10 rounded-full blur-lg animate-bounce delay-500"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-sky-100 text-lg drop-shadow">
            {t('upForm')}
          </p>
        </div>
        <LoginForm />
      </div>
      
      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-sky-700 to-transparent opacity-50"></div>
    </div>
  )
}