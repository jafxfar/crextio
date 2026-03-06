'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, GraduationCap } from 'lucide-react'
import { cn } from '@/lib/utils'
import AccProspLogo from '@/public/noroot.png'
import Image from 'next/image'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // TODO: implement auth logic
    await new Promise((r) => setTimeout(r, 1000))
    setIsLoading(false)
  }

  return (
    <div
      className="min-h-screen w-full flex"
      style={{ background: 'linear-gradient(150deg, #e3e4e6 30%, #ddff00 100%)' }}
    >
      {/* Left branding panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-14">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="142" height="54" fill="none">
            <path
              fill="#000"
              fillRule="evenodd"
              d="M22.605 9.042a49.176 49.176 0 0 1-1.865 4.54c2.881 1.616 6.265 1.802 8.527 1.183-3.428 1.852-6.065 1.852-15.557.529l.02-.014c-1.01-.132-2.09-.273-3.254-.42-6.328-1.057-13.71 4.233-8.964 10.582h16.157c4.69 0 9.025-2.499 11.388-6.562l7.258-12.483c-3.164-3.704-11.6-3.704-13.71 2.645Z"
              clipRule="evenodd"
            />
            <path
              fill="#000"
              fillRule="evenodd"
              d="M39.785 33.127a49.075 49.075 0 0 1-2.987-3.89c-2.836 1.694-4.688 4.541-5.284 6.816.115-3.904 1.433-6.195 7.32-13.78l.003.023c.619-.81 1.281-1.678 1.989-2.617 4.077-4.968 3.202-14.028-4.651-13.079l-8.08 14.039a13.263 13.263 0 0 0-.029 13.174l7.147 12.548c4.779-.897 8.997-8.228 4.572-13.234Z"
              clipRule="evenodd"
            />
            <path
              fill="#000"
              fillRule="evenodd"
              d="M10.57 35.979c1.8-.325 3.405-.537 4.85-.65-.044-3.311-1.576-6.344-3.24-8 3.311 2.053 4.63 4.343 8.234 13.252l-.021-.01c.39.942.808 1.952 1.264 3.036 2.25 6.027 10.509 9.796 13.616 2.498l-8.079-14.038a13.176 13.176 0 0 0-11.358-6.613L1.431 25.39c-1.615 4.6 2.604 11.93 9.139 10.589Z"
              clipRule="evenodd"
            />
            <text
              x="55"
              y="33"
              fontFamily="Inter, Arial, sans-serif"
              fontSize="20"
              fontWeight="600"
              fill="black"
            >
              Jupiter
            </text>
          </svg>
        </div>

        {/* Hero text */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            {/* <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-black text-[#ddff00]">
              <GraduationCap size={20} />
            </span>
            <span className="text-sm font-semibold text-foreground/60 uppercase tracking-widest">
              Enterprise Training Platform
            </span> */}
          </div>
          <h1 className="text-5xl font-bold text-foreground leading-tight tracking-tight">
            Обучение, которое
            <br />
            <span className="text-foreground/40">двигает компанию</span>
            <br />
            вперёд
          </h1>
          <p className="text-muted-foreground text-base max-w-sm leading-relaxed">
            Управляйте курсами, сертификатами и соответствием требованиям — всё в одном месте.
          </p>
        </div>

        {/* Stats pills */}
        <div className="space-y-4">
          <div className="flex gap-4">
            {[
              { label: 'Активных курсов', value: '120+' },
              { label: 'Сотрудников', value: '2 400' },
              { label: 'Сертификаций', value: '98%' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex-1 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/70 px-4 py-3"
              >
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Powered by Accelerate Prosperity */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/70 overflow-hidden">
              <Image src={AccProspLogo} alt="Accelerate Prosperity" width={28} height={28} className="object-contain" />
            </span>
            <span className="text-sm font-semibold text-foreground/60 uppercase tracking-widest">
              При поддержке Accelerate Prosperity
            </span>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 items-center justify-center p-6 lg:p-14">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="rounded-3xl bg-white/80 backdrop-blur-md border border-white/70 shadow-xl shadow-black/5 p-8 space-y-6">
            {/* Mobile logo */}
            <div className="flex lg:hidden items-center gap-2 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="110" height="42" fill="none">
                <path
                  fill="#000"
                  fillRule="evenodd"
                  d="M17.142 7.032a38 38 0 0 1-1.442 3.51c2.228 1.25 4.845 1.393 6.595.915-2.652 1.432-4.692 1.432-12.037.41l.016-.012c-.782-.101-1.617-.21-2.518-.323C3.263 10.716-2.002 14.984 1.54 19.61h12.498c3.628 0 6.983-1.934 8.81-5.078l5.618-9.66c-2.449-2.867-8.978-2.867-10.613 2.047l-.311.113Z"
                  clipRule="evenodd"
                />
                <path
                  fill="#000"
                  fillRule="evenodd"
                  d="M30.8 25.64a37.95 37.95 0 0 1-2.312-3.011c-2.194 1.31-3.626 3.513-4.089 5.274.088-3.021 1.109-4.796 5.663-10.666l.002.018c.479-.627.991-1.299 1.539-2.026 3.155-3.844 2.478-10.855-3.600-10.12L21.76 16.57a10.266 10.266 0 0 0-.022 10.198l5.53 9.714c3.699-.695 6.963-6.37 3.54-10.243l-.008-.598Z"
                  clipRule="evenodd"
                />
                <path
                  fill="#000"
                  fillRule="evenodd"
                  d="M8.177 27.844c1.393-.252 2.636-.416 3.754-.503-.034-2.563-1.22-4.91-2.508-6.192 2.563 1.59 3.584 3.362 6.376 10.256l-.016-.008c.302.728.625 1.51.978 2.35 1.742 4.665 8.133 7.582 10.54 1.934L21.3 24.843a10.2 10.2 0 0 0-8.791-5.12L1.108 19.67c-1.25 3.562 2.016 9.236 7.07 8.174Z"
                  clipRule="evenodd"
                />
                <text
                  x="42"
                  y="26"
                  fontFamily="Inter, Arial, sans-serif"
                  fontSize="16"
                  fontWeight="600"
                  fill="black"
                >
                  Jupiter
                </text>
              </svg>
            </div>

            {/* Heading */}
            <div>
              <h2 className="text-2xl font-bold text-foreground tracking-tight">
                Добро пожаловать
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Войдите в корпоративный аккаунт
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground"
                >
                  Эл. почта
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ivanov@company.ru"
                  className={cn(
                    'w-full rounded-xl border border-border bg-white/70 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground',
                    'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition',
                  )}
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-foreground"
                  >
                    Пароль
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Забыли пароль?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={cn(
                      'w-full rounded-xl border border-border bg-white/70 px-4 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground',
                      'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition',
                    )}
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded accent-primary cursor-pointer"
                />
                <span className="text-sm text-muted-foreground">Запомнить меня</span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className={cn(
                  'w-full rounded-xl bg-foreground text-background font-semibold text-sm py-2.5 transition-all',
                  'hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed',
                )}
              >
                {isLoading ? 'Вход...' : 'Войти'}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">или</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* SSO */}
            <button
              type="button"
              className={cn(
                'w-full rounded-xl border border-border bg-white/60 px-4 py-2.5 text-sm font-medium text-foreground',
                'hover:bg-white/80 transition flex items-center justify-center gap-2',
              )}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
                <path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.1 33.1 29.5 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l6-6C34.4 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.2-2.7-.2-4z"/>
                <path fill="#34A853" d="M6.3 14.7l7 5.1C15 16.1 19.2 13 24 13c3 0 5.8 1.1 7.9 3l6-6C34.4 6.1 29.5 4 24 4 16.1 4 9.3 8.4 6.3 14.7z"/>
                <path fill="#FBBC05" d="M24 44c5.4 0 10.3-1.8 14.1-4.9l-6.5-5.3C29.5 35.5 26.9 36 24 36c-5.5 0-10.1-3-11.7-7.5l-7 5.4C8.9 40 15.9 44 24 44z"/>
                <path fill="#EA4335" d="M44.5 20H24v8.5h11.7c-.8 2.4-2.4 4.4-4.5 5.8l6.5 5.3C41.3 36.4 44.5 30.7 44.5 24c0-1.3-.2-2.7-.2-4z"/>
              </svg>
              Войти через Google SSO
            </button>

            {/* Footer note */}
            <p className="text-center text-xs text-muted-foreground">
              Нет аккаунта?{' '}
              <Link href="/register" className="font-medium text-foreground hover:underline">
                Обратитесь к администратору
              </Link>
            </p>
          </div>

          {/* Bottom disclaimer */}
          <p className="mt-6 text-center text-xs text-foreground/40">
            © 2026 Jupiter LMS · Корпоративная платформа обучения
          </p>
        </div>
      </div>
    </div>
  )
}
