import { useNavigate, useParams, Link } from "react-router-dom"
import { getDoc, doc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useEffect, useState } from 'react'

export default function Article() {
  const { urlId } = useParams()
  const navigate = useNavigate()

  console.log("id: " + urlId)

  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadArticle = async () => {
      try {
        const ref = doc(db, 'articles', urlId)
        const snapshot = await getDoc(ref)
        
        if (snapshot.exists()) {
          setArticle({ id: snapshot.id, ...snapshot.data() })
        } else {
          setError('Article not found!')
          setTimeout(() => {
            navigate('/')
          }, 3000)
        }
      } catch (err) {
        console.error('Error loading article:', err)
        setError('Error loading article')
      }
      
      setLoading(false)
    }

    loadArticle()
  }, [urlId, navigate])

  if (loading) {
    return (
      <div>
        <p>Loading article...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <p style={{ color: 'red' }}>{error}</p>
        <p>Redirecting to home page...</p>
      </div>
    )
  }

  return (
    <div>
      {!article && <p>No records found!</p>}
      {article && (
        <div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            marginBottom: '20px'
          }}>
            <div>
              <h2>{article.title}</h2>
              <p style={{ color: '#666', margin: '5px 0' }}>By {article.author}</p>
            </div>
            
            <Link 
              to={`/update/${article.id}`}
              style={{
                padding: '8px 16px',
                background: '#4CAF50',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                fontSize: '0.9em'
              }}
            >
              Update Article
            </Link>
          </div>
          
          <div style={{ 
            lineHeight: '1.6', 
            fontSize: '1.1em',
            padding: '20px 0',
            borderTop: '1px solid #eee'
          }}>
            <p>{article.description}</p>
          </div>
          
          {article.updatedAt && (
            <p style={{ 
              fontSize: '0.8em', 
              color: '#999', 
              fontStyle: 'italic',
              marginTop: '20px'
            }}>
              Last updated: {new Date(article.updatedAt.seconds * 1000).toLocaleDateString()}
            </p>
          )}
          
          <div style={{ marginTop: '30px' }}>
            <Link 
              to="/"
              style={{
                padding: '8px 16px',
                background: '#333',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px'
              }}
            >
              ← Back to Articles
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}