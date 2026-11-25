import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <App />
                <Toaster
                    position="top-right"
                    gutter={8}
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#111827',
                            color: '#e2e8f0',
                            border: '1px solid rgba(37,99,235,0.2)',
                            borderRadius: '12px',
                            backdropFilter: 'blur(12px)',
                            fontSize: '14px',
                            fontWeight: '500',
                            padding: '12px 16px',
                        },
                        success: {
                            iconTheme: { primary: '#22d3ee', secondary: '#080c14' },
                        },
                        error: {
                            iconTheme: { primary: '#ef4444', secondary: '#fff' },
                        },
                    }}
                />
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
)
