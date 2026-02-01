'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'

import { apiClient, gameApi, authUtils } from '@/lib/api'
import supabase from '@/lib/supabase'

const AuthContext = createContext(undefined)

const initialUser = {
  id: '',
  email: '',
  username: '',
  isAuthenticated: false,
  profile: null,
  balance: 0
}

function safeSessionFlagGet(key) {
  try {
    return typeof window !== 'undefined' ? sessionStorage.getItem(key) : null
  } catch {
    return null
  }
}
function safeSessionFlagRemove(key) {
  try {
    if (typeof window !== 'undefined') sessionStorage.removeItem(key)
  } catch {}
}
function safeLocalRemove(key) {
  try {
    if (typeof window !== 'undefined') localStorage.removeItem(key)
  } catch {}
}

export function AuthProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState({ ...initialUser })

  // prevent multiple simultaneous auth checks
  const authCheckInProgress = useRef(false)

  // prevent setState after unmount
  const mountedRef = useRef(false)

  const setUnauthenticated = useCallback(() => {
    setUser(prev => ({
      ...prev,
      ...initialUser,
      // mantém qualquer coisa extra que você queira preservar no futuro
    }))
  }, [])

  const setAuthenticatedFromProfile = useCallback((profile) => {
    setUser({
      id: profile.id,
      email: profile.email,
      username: profile.username,
      isAuthenticated: true,
      profile,
      balance: profile.balance ?? 0
    })
  }, [])

  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await gameApi.user.getProfile()
      if (!response?.success || !response?.data) {
        throw new Error('Failed to fetch profile')
      }
      const profile = response.data
      if (mountedRef.current) setAuthenticatedFromProfile(profile)
      console.log('✅ User profile loaded:', profile.username)
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
      if (mountedRef.current) setUnauthenticated()
    }
  }, [setAuthenticatedFromProfile, setUnauthenticated])

  const checkAuthStatus = useCallback(async () => {
    if (authCheckInProgress.current) {
      console.log('🔄 Auth check already in progress, skipping')
      return
    }

    // redirect loop guard
    if (safeSessionFlagGet('auth_redirect_flag')) {
      console.log('🔄 Auth redirect flag detected, skipping auth status check')
      safeSessionFlagRemove('auth_redirect_flag')
      safeSessionFlagRemove('logout_in_progress')
      if (mountedRef.current) setUnauthenticated()
      return
    }

    try {
      authCheckInProgress.current = true
      if (mountedRef.current) setIsLoading(true)

      console.log('🔐 Starting auth status check')
      const isAuth = await authUtils.isAuthenticated()

      if (isAuth) {
        console.log('✅ User is authenticated, fetching profile')
        await fetchUserProfile()
      } else {
        console.log('❌ User is not authenticated')
        if (mountedRef.current) setUnauthenticated()
      }
    } catch (error) {
      console.error('Auth status check failed:', error)
      if (mountedRef.current) setUnauthenticated()
    } finally {
      if (mountedRef.current) setIsLoading(false)
      authCheckInProgress.current = false
    }
  }, [fetchUserProfile, setUnauthenticated])

  const signIn = useCallback(async (email, password) => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      // token exchange handled by onAuthStateChange
    } catch (error) {
      console.error('Sign in error:', error)
      throw new Error(error?.message || 'Sign in failed')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signUp = useCallback(async (email, password, metadata) => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata }
      })
      if (error) throw error
      // token exchange handled by onAuthStateChange
    } catch (error) {
      console.error('Sign up error:', error)
      throw new Error(error?.message || 'Sign up failed')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loginWithOTP = useCallback(async (email, code) => {
    try {
      setIsLoading(true)

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/otp/verify`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email, code })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || 'OTP verification failed')
      }

      // store tokens (se você realmente usa isso no app)
      if (data?.token) localStorage.setItem('auth_token', data.token)
      if (data?.platformToken) localStorage.setItem('platform_token', data.platformToken)

      if (data?.user) {
        if (mountedRef.current) {
          setUser({
            id: data.user.id,
            email: data.user.email,
            username: data.user.username,
            isAuthenticated: true,
            profile: data.user,
            balance: data.user.balance ?? 0
          })
        }
      }

      console.log('✅ OTP login successful')
    } catch (error) {
      console.error('OTP login error:', error)
      throw new Error(error?.message || 'OTP verification failed')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signInWithGoogle = useCallback(async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) throw error
    } catch (error) {
      console.error('Google sign in error:', error)
      throw new Error(error?.message || 'Google sign in failed')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signInWithTwitter = useCallback(async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'twitter',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) throw error
    } catch (error) {
      console.error('Twitter sign in error:', error)
      throw new Error(error?.message || 'Twitter sign in failed')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // ✅ MetaMask login: params limpos + checagens
  const signInWithMetaMask = useCallback(async (walletAddress) => {
    try {
      setIsLoading(true)

      if (typeof window === 'undefined') {
        throw new Error('MetaMask login is only available in the browser')
      }
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed. Please install the MetaMask extension.')
      }
      if (!walletAddress) {
        throw new Error('Wallet address is required')
      }

      console.log('🔐 MetaMask wallet connected:', walletAddress)

      // Step 1: Get nonce/message
      const nonceResponse = await apiClient.post('/auth/wallet/nonce', { walletAddress })

      const nonceMessage = nonceResponse?.data?.message
      if (!nonceMessage) {
        throw new Error('Failed to get authentication message')
      }

      // Step 2: Sign message
      console.log('📝 Requesting signature from MetaMask...')
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [nonceMessage, walletAddress]
      })

      if (!signature) throw new Error('Signature request was rejected')

      console.log('✅ Message signed successfully')

      // Step 3: Verify
      const verifyResponse = await apiClient.post('/auth/wallet/verify', {
        walletAddress,
        signature
      })

      if (verifyResponse?.data?.success && verifyResponse?.data?.user) {
        const userData = verifyResponse.data.user
        if (mountedRef.current) {
          setUser({
            id: userData.id,
            email: userData.email || '',
            username: userData.username,
            isAuthenticated: true,
            profile: userData,
            balance: userData.balance ?? 0
          })
        }
        console.log('✅ MetaMask authentication successful:', userData.username)
      } else {
        throw new Error('Verification failed')
      }
    } catch (error) {
      console.error('MetaMask sign in error:', error)

      // user-friendly errors
      if (error?.code === 4001) {
        throw new Error('MetaMask signature request was rejected')
      }
      throw new Error(error?.message || 'MetaMask authentication failed')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const exchangeToken = useCallback(async (supabaseToken) => {
    try {
      if (safeSessionFlagGet('auth_redirect_flag')) {
        console.log('🔄 Auth redirect flag detected, skipping token exchange')
        safeSessionFlagRemove('auth_redirect_flag')
        safeSessionFlagRemove('logout_in_progress')
        if (mountedRef.current) setUnauthenticated()
        return
      }

      const response = await apiClient.post('/auth/exchange', { token: supabaseToken })

      if (response?.data?.success) {
        console.log('✅ Platform token obtained and stored in cookie')
        await fetchUserProfile()
      } else {
        throw new Error('Token exchange failed')
      }
    } catch (error) {
      console.error('❌ Token exchange failed:', error)

      if (mountedRef.current) setUnauthenticated()

      // cleanup to avoid repeated failures
      try {
        await supabase.auth.signOut()
      } catch {}

      safeLocalRemove('supabase.auth.token')
      safeLocalRemove('auth_token')
      safeLocalRemove('platform_token')
      safeSessionFlagRemove('auth_redirect_flag')
      safeSessionFlagRemove('logout_in_progress')

      throw error
    }
  }, [fetchUserProfile, setUnauthenticated])

  const signOut = useCallback(async () => {
    try {
      setIsLoading(true)

      // backend logout (clear cookie)
      await authUtils.logout()

      // supabase logout
      await supabase.auth.signOut()

      if (mountedRef.current) setUnauthenticated()

      console.log('✅ User signed out successfully')

      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      setIsLoading(false)
    }
  }, [setUnauthenticated])

  const refreshProfile = useCallback(async () => {
    if (user.isAuthenticated) await fetchUserProfile()
  }, [user.isAuthenticated, fetchUserProfile])

  const updateUser = useCallback((profilePatch) => {
    setUser(prev => ({
      ...prev,
      profile: prev.profile ? { ...prev.profile, ...profilePatch } : prev.profile
    }))
  }, [])

  const updateBalance = useCallback((newBalance) => {
    setUser(prev => ({
      ...prev,
      balance: newBalance,
      profile: prev.profile ? { ...prev.profile, balance: newBalance } : prev.profile
    }))
  }, [])

  // Supabase auth listener
  useEffect(() => {
    mountedRef.current = true

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state change:', event, session?.user?.email)

        if (safeSessionFlagGet('auth_redirect_flag')) {
          console.log('🔄 Auth redirect flag detected, skipping auth state change processing')
          return
        }

        const hasUser = !!session?.user
        const hasToken = !!session?.access_token

        if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && hasUser && hasToken) {
          try {
            await exchangeToken(session.access_token)
          } catch (error) {
            console.error('❌ Failed to exchange token:', error)
          }
        }

        if (event === 'SIGNED_OUT') {
          if (mountedRef.current) setUnauthenticated()
        }
      }
    )

    return () => {
      mountedRef.current = false
      subscription.unsubscribe()
    }
  }, [exchangeToken, setUnauthenticated])

  // Check auth once on mount
  useEffect(() => {
    checkAuthStatus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const value = useMemo(() => ({
    user,
    isLoading,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithTwitter,
    signInWithMetaMask,
    signOut,
    refreshProfile,
    updateUser,
    updateBalance,
    fetchUserProfile,
    loginWithOTP
  }), [
    user,
    isLoading,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithTwitter,
    signInWithMetaMask,
    signOut,
    refreshProfile,
    updateUser,
    updateBalance,
    fetchUserProfile,
    loginWithOTP
  ])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
