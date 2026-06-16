import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { exchangeGoogleCode } from '../../services/auth'
import { useAuth } from '../../hooks/useAuth'
import { getDashboardPath } from '../../utils/roleHelper'
import Spinner from '../../components/common/Spinner'

const ERROR_MESSAGES = {
  registration_required:
    'This Google account is not registered yet. Please use the Register page and select your role and clinic before signing in with Google.',
  account_deactivated:
    'Your account has been deactivated. Please contact an administrator.',
  state_invalid:
    'The sign-in session expired or was invalid. Please try again.',
  validation_failed:
    'Invalid registration details. Please go back and check your role and clinic selection.',
  google_error:
    'An error occurred during Google sign-in. Please try again.',
}

export default function GoogleCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { loginWithToken } = useAuth()
  const [error, setError] = useState('')

  useEffect(() => {
    const code = searchParams.get('code')
    const errorKey = searchParams.get('error')

    if (errorKey) {
      setError(ERROR_MESSAGES[errorKey] ?? ERROR_MESSAGES.google_error)
      return
    }

    if (!code) {
      setError(ERROR_MESSAGES.google_error)
      return
    }

    exchangeGoogleCode(code)
      .then((res) => {
        const { user, token } = res.data.data
        loginWithToken(user, token)
        navigate(getDashboardPath(user.role), { replace: true })
      })
      .catch((err) => {
        setError(err.response?.data?.message ?? ERROR_MESSAGES.google_error)
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md card text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mx-auto mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Sign-in failed</h2>
          <p className="text-sm text-gray-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <Link to="/login" className="btn-secondary text-sm px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
              Back to Login
            </Link>
            <Link to="/register" className="text-sm px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700">
              Register
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 gap-4">
      <Spinner size="lg" />
      <p className="text-sm text-gray-500">Completing Google sign-in…</p>
    </div>
  )
}
