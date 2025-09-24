import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { StatusBar, Style } from '@capacitor/status-bar'
import { Capacitor } from '@capacitor/core'

// Configure status bar for utility app - always visible
const setupStatusBar = async () => {
  try {
    // Only setup status bar on native platforms
    if (Capacitor.isNativePlatform()) {
      // Add data attribute to HTML for CSS targeting
      document.documentElement.setAttribute('data-capacitor', 'true')
      
      // Always show the status bar for utility apps
      await StatusBar.show()
      
      // Set dark content on light background (better for utility apps)
      await StatusBar.setStyle({ style: Style.Light })
      
      // Set status bar background to match your app header
      await StatusBar.setBackgroundColor({ color: '#ffffff' })
      
      // Ensure it's not overlaid by the app content
      await StatusBar.setOverlaysWebView({ overlay: false })
      
      console.log('Status bar configured for utility app')
    }
  } catch (error) {
    console.log('StatusBar not available:', error)
  }
}

// Setup status bar when app loads
setupStatusBar()


// --- GitHub Pages SPA redirect handler ---
// If ?redirect= is present, replace history and reload to the correct path
const params = new URLSearchParams(window.location.search);
const redirect = params.get('redirect');
if (redirect) {
  // Remove ?redirect= from the URL and push the intended path
  window.history.replaceState(null, '', redirect);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
