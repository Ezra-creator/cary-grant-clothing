const requiredEnvVars = {
  // Firebase
  NEXT_PUBLIC_FIREBASE_API_KEY: 'string',
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: 'string',
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: 'string',
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: 'string',
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: 'string',
  NEXT_PUBLIC_FIREBASE_APP_ID: 'string',
  
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: 'string',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'string',
} as const

type EnvVar = keyof typeof requiredEnvVars

export function validateEnvVars(): { valid: boolean; missing: string[]; invalid: string[] } {
  const missing: string[] = []
  const invalid: string[] = []

  for (const [key, type] of Object.entries(requiredEnvVars)) {
    const value = process.env[key]
    
    if (!value) {
      missing.push(key)
      continue
    }

    if (type === 'string' && typeof value !== 'string') {
      invalid.push(key)
    }
  }

  const valid = missing.length === 0 && invalid.length === 0

  if (!valid) {
    console.error('❌ Environment Variable Validation Failed')
    if (missing.length > 0) {
      console.error('Missing variables:', missing.join(', '))
    }
    if (invalid.length > 0) {
      console.error('Invalid variables:', invalid.join(', '))
    }
  } else {
    console.log('✅ All environment variables are valid')
  }

  return { valid, missing, invalid }
}

// Run validation on import (only in development)
if (process.env.NODE_ENV === 'development') {
  validateEnvVars()
}
