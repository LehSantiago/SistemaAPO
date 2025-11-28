// src/app/layout.js
import './globals.css'

export const metadata = {
  title: 'Sistema APO - Aprovação de Atividades Práticas Orientadas',
  description: 'Sistema de gerenciamento de atividades acadêmicas práticas',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}