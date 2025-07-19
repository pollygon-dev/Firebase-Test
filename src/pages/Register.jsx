import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase/config'
import { Link } from 'react-router-dom'
import './create.css'

export default function Register({ onRegister }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      onRegister({
        id: user.uid,
        email: user.email,
        username: user.email.split('@')[0]
      })
    } catch (err) {
      console.error('Registration error:', err)
      
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('An account with this email already exists.')
          break
        case 'auth/invalid-email':
          setError('Invalid email address.')
          break
        case 'auth/weak-password':
          setError('Password is too weak.')
          break
        default:
          setError('Registration failed. Please try again.')
      }
    }

    setLoading(false)
  }

  return (
    <div className="create">
      <h2 className="page-title">Create New Account</h2>
      
      {error && (
        <div style={{
          color: 'red',
          background: '#ffe6e6',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label>
          <span>Email:</span>
          <input 
            type="email" 
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
            placeholder="Enter your email"
          />
        </label>
        
        <label>
          <span>Password:</span>
          <input 
            type="password" 
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
            placeholder="Enter your password (min 6 characters)"
          />
        </label>

        <label>
          <span>Confirm Password:</span>
          <input 
            type="password" 
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            required
            placeholder="Confirm your password"
          />
        </label>

        <button className="btn" disabled={loading}>
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#58249c' }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  )
}