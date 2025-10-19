import React from 'react'
import { useTheme } from '../contexts/ThemeContext'

export default function Footer() {
  const { isDarkMode, toggleTheme } = useTheme()
  return (
    <footer className="mt-16 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Company</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Building a modern app marketplace for developers and users.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-200 mb-3">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" href="#">Features</a></li>
              <li><a className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" href="#">Pricing</a></li>
              <li><a className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" href="#">Documentation</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-200 mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" href="#">About</a></li>
              <li><a className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" href="#">Careers</a></li>
              <li><a className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" href="#">Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-200 mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>support@company.com</li>
              <li>+1 (555) 000-0000</li>
              <li>Mon–Fri, 9am–6pm</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 dark:text-gray-500">© {new Date().getFullYear()} Company, Inc. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs">
            <a href="#" className="text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white">Privacy</a>
            <a href="#" className="text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white">Terms</a>
            <a href="#" className="text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white">Status</a>
            <button
              onClick={toggleTheme}
              className="ml-2 px-3 py-1 rounded-md border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? 'Dark' : 'Light'} mode
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}


