import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import './create.css'

export default function UpdateArticle() {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState('')
  
  const navigate = useNavigate()
  const { urlId } = useParams()

  useEffect(() => {
    const loadArticle = async () => {
      try {
        const ref = doc(db, 'articles', urlId)
        const snapshot = await getDoc(ref)
        
        if (snapshot.exists()) {
          const articleData = snapshot.data()
          setTitle(articleData.title || '')
          setAuthor(articleData.author || '')
          setDescription(articleData.description || '')
        } else {
          setError('Article not found!')
          setTimeout(() => navigate('/'), 2000)
        }
      } catch (err) {
        console.error('Error loading article:', err)
        setError('Error loading article data')
      }
      
      setLoading(false)
    }

    loadArticle()
  }, [urlId, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUpdating(true)
    setError('')
    
    try {
      const articleRef = doc(db, 'articles', urlId)
      const updatedArticle = {
        title,
        author,
        description,
        updatedAt: new Date()
      }
      
      await updateDoc(articleRef, updatedArticle)
      
      navigate(`/articles/${urlId}`)
    } catch (err) {
      console.error('Error updating article:', err)
      setError('Error updating article. Please try again.')
    }
    
    setUpdating(false)
  }

  const handleCancel = () => {
    navigate(`/articles/${urlId}`)
  }

  if (loading) {
    return (
      <div className="create">
        <p>Loading article data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="create">
        <div style={{
          color: 'red',
          background: '#ffe6e6',
          padding: '10px',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="create">
      <h2 className="page-title">Update Article</h2>
      
      <form onSubmit={handleSubmit}>
        <label>
          <span>Title:</span>
          <input 
            type="text" 
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            required
          />
        </label>
        
        <label>
          <span>Author:</span>
          <input 
            type="text" 
            onChange={(e) => setAuthor(e.target.value)}
            value={author}
            required
          />
        </label>

        <label>
          <span>Description:</span>
          <textarea 
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            required
            rows="6"
          />
        </label>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="btn" 
            type="submit" 
            disabled={updating}
          >
            {updating ? 'Updating...' : 'Update Article'}
          </button>
          
          <button 
            type="button"
            onClick={handleCancel}
            style={{
              display: 'block',
              width: '100px',
              fontSize: '1em',
              color: '#666',
              padding: '8px 20px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: '#f0f0f0',
              cursor: 'pointer',
              textDecoration: 'none',
              margin: '20px 0'
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}