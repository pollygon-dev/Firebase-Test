import { Link } from 'react-router-dom'
import { getDocs, collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useEffect, useState } from 'react'
import DeleteIcon from '../assets/delete.svg'

import './Home.css'

export default function Home() {
  const [articles, setArticles] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ref = collection(db, 'articles')

    const unsubscribe = onSnapshot(ref, (snapshot) => {
      console.log(snapshot)
      let results = []
      snapshot.docs.forEach(doc => {
        results.push({ id: doc.id, ...doc.data() })
      })
      setArticles(results)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        const ref = doc(db, 'articles', id)
        await deleteDoc(ref)
        console.log('Article deleted successfully')
      } catch (error) {
        console.error('Error deleting article:', error)
        alert('Error deleting article. Please try again.')
      }
    }
  }

  if (loading) {
    return (
      <div className="home">
        <p>Loading articles...</p>
      </div>
    )
  }

  return (
    <div className="home">
      <h2>Articles</h2>
      
      {!articles || articles.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>No articles found. <Link to="/new">Create your first article!</Link></p>
        </div>
      ) : (
        articles.map(article => (
          <div key={article.id} className="card">
            <h3>{article.title}</h3>
            <p>Written by {article.author}</p>
            <p>{article.description?.substring(0, 100)}...</p>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginTop: '15px'
            }}>
              <Link to={`/articles/${article.id}`}>Read More...</Link>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Link 
                  to={`/update/${article.id}`}
                  style={{
                    padding: '4px 8px',
                    background: '#4CAF50',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '4px',
                    fontSize: '0.9em'
                  }}
                >
                  Update
                </Link>
                
                <img 
                  className="icon"
                  onClick={() => handleDelete(article.id)}
                  src={DeleteIcon} 
                  alt="delete icon"
                  style={{ margin: 0, float: 'none' }}
                />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}