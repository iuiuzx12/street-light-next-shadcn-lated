import { LoginForm } from "@/components/login-form"

export default function Page() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center p-4 md:p-10">
      {/* Background with electric theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        {/* Circuit board pattern - Commented out for performance testing
        <div className="absolute inset-0 opacity-20">
          <svg className="h-full w-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
            <path d="M100,100 L300,100 L300,200 L500,200" stroke="rgb(59,130,246)" strokeWidth="2" fill="none" opacity="0.6"/>
            <path d="M600,150 L800,150 L800,300 L1000,300" stroke="rgb(34,197,94)" strokeWidth="2" fill="none" opacity="0.5"/>
            <path d="M200,400 L400,400 L400,500 L600,500 L600,600" stroke="rgb(168,85,247)" strokeWidth="2" fill="none" opacity="0.4"/>
            <path d="M700,50 L900,50 L900,250 L1100,250" stroke="rgb(59,130,246)" strokeWidth="2" fill="none" opacity="0.3"/>
            <circle cx="300" cy="100" r="4" fill="rgb(59,130,246)" opacity="0.8"/>
            <circle cx="500" cy="200" r="4" fill="rgb(34,197,94)" opacity="0.8"/>
            <circle cx="800" cy="150" r="4" fill="rgb(168,85,247)" opacity="0.8"/>
            <circle cx="600" cy="500" r="4" fill="rgb(59,130,246)" opacity="0.8"/>
          </svg>
        </div>
        */}
        
        {/* Glowing light bulbs */}
        <div className="absolute top-20 left-20">
          <div className="relative">
            <div className="w-8 h-12 bg-yellow-400 rounded-full opacity-80 animate-pulse shadow-lg shadow-yellow-400/50"></div>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-4 bg-gray-600 rounded-t-lg"></div>
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-gray-700 rounded"></div>
          </div>
        </div>
        
        {/* Light bulb 2 - Commented out for performance testing
        <div className="absolute top-40 right-32">
          <div className="relative">
            <div className="w-6 h-10 bg-blue-400 rounded-full opacity-70 animate-pulse shadow-lg shadow-blue-400/50" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-3 bg-gray-600 rounded-t-lg"></div>
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-2 bg-gray-700 rounded"></div>
          </div>
        </div>
        */}
        
        <div className="absolute bottom-32 left-16">
          <div className="relative">
            <div className="w-10 h-14 bg-green-400 rounded-full opacity-75 animate-pulse shadow-lg shadow-green-400/50" style={{animationDelay: '1s'}}></div>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-gray-600 rounded-t-lg"></div>
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-2 bg-gray-700 rounded"></div>
          </div>
        </div>
        
        {/* Light bulb 4 - Commented out for performance testing
        <div className="absolute bottom-20 right-20">
          <div className="relative">
            <div className="w-7 h-11 bg-purple-400 rounded-full opacity-85 animate-pulse shadow-lg shadow-purple-400/50" style={{animationDelay: '1.5s'}}></div>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-5 h-3 bg-gray-600 rounded-t-lg"></div>
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-gray-700 rounded"></div>
          </div>
        </div>
        */}
        
        {/* Electric sparks - Commented out for performance testing
        <div className="absolute top-1/4 left-1/3">
          <div className="w-2 h-2 bg-yellow-300 rounded-full animate-ping"></div>
        </div>
        <div className="absolute top-3/4 left-1/4">
          <div className="w-1 h-1 bg-blue-300 rounded-full animate-ping" style={{animationDelay: '0.3s'}}></div>
        </div>
        <div className="absolute top-1/2 right-1/3">
          <div className="w-3 h-3 bg-green-300 rounded-full animate-ping" style={{animationDelay: '0.8s'}}></div>
        </div>
        */}
        
        {/* Subtle electric grid pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle, #60a5fa 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-sm">
        <LoginForm />
      </div>
      
      {/* Bottom decoration with electric wave - Commented out for performance testing */}
      {/*
      <div className="absolute bottom-0 left-0 right-0 h-40">
        <svg className="w-full h-full" viewBox="0 0 1200 200" preserveAspectRatio="none">
          <defs>
            <linearGradient id="electricGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{stopColor:'rgb(59,130,246)', stopOpacity:0.3}} />
              <stop offset="50%" style={{stopColor:'rgb(34,197,94)', stopOpacity:0.3}} />
              <stop offset="100%" style={{stopColor:'rgb(168,85,247)', stopOpacity:0.3}} />
            </linearGradient>
          </defs>
          <path d="M0,100 C300,50 600,150 900,80 C1050,40 1200,100 1200,100 L1200,200 L0,200 Z" fill="url(#electricGrad)"/>
        </svg>
      </div>
      */}
    </div>
  )
}