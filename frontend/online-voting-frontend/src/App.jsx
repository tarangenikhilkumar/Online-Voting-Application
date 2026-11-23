import { Toaster } from 'sonner'
import AppRoutes from './routes/AppRoutes'
import { useTheme } from './hooks/useTheme'

function App() {
  const { isDark } = useTheme()

  return (
    <>
      <AppRoutes />
      <Toaster position="top-right" richColors closeButton theme={isDark ? 'dark' : 'light'} />
    </>
  )
}

export default App