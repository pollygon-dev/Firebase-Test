import { useState } from 'react'
import { getDocs, collection, query, where } from 'firebase/firestore'
import { db } from '../firebase/config'
import './create.css'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const usersRef = collection(db, 'users')
      const q = query(usersRef, where('username', '==', username))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        setError('Username not found!')
        setLoading(false)
        return
      }

      let userFound = false
      querySnapshot.forEach((doc) => {
        const userData = doc.data()
        if (userData.password === password) {
          userFound = true
          onLogin({
            id: doc.id,
            username: userData.username,
            email: userData.email || ''
          })
        }
      })

      if (!userFound) {
        setError('Incorrect password!')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('An error occurred during login. Please try again.')
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
          <span>Username:</span>
          <input 
            type="text" 
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            required
            placeholder="Enter your username"
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
        <p><strong>Demo Credentials:</strong></p>
        <p>Username: admin</p>
        <p>Password: password123</p>
        <p style={{ fontSize: '0.8em', color: '#666' }}>
          You'll need to create a user in Firestore with these credentials
        </p>
      </div>
    </div>
  )
}