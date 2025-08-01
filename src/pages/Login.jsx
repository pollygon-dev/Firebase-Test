import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase/config'
import './create.css'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      onLogin({
        id: user.uid,
        email: user.email,
        username: user.email.split('@')[0]
      })
    } catch (err) {
      console.error('Login error:', err)
      
      switch (err.code) {
        case 'auth/user-not-found':
          setError('No account found with this email address.')
          break
        case 'auth/wrong-password':
          setError('Incorrect password.')
          break
        case 'auth/invalid-email':
          setError('Invalid email address.')
          break
        case 'auth/too-many-requests':
          setError('Too many failed attempts. Try again later.')
          break
        default:
          setError('Login failed. Please try again.')
      }
    }

    setLoading(false)
  }

  return (
    <div className="create">
      <h2 className="page-title">Login to Your Account</h2>
      
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
            placeholder="Enter your password"
          />
        </label>

        <button className="btn" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p><strong>Test Account:</strong></p>
        <p>Email: admin@email.com</p>
        <p>Password: (use the password you set in Firebase Auth)</p>
        <p style={{ fontSize: '0.8em', color: '#666' }}>
          Create this user in Firebase Authentication console
        </p>
      </div>
    </div>
  )
}