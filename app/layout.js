import './globals.css';

export const metadata = {
  title: 'Test de Ingenierías UACh',
  description: 'Descubre tu ingeniería ideal',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}