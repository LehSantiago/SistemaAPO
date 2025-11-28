// src/app/login/orientador/page.js
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../aluno/page.module.css';

export default function LoginOrientador() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
       const response = await fetch('/api/login', {  // ✅ Sem localhost:5000
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           ...formData,
           tipo: 'orientador'  // ✅ Corrigido o tipo
         })
       });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/dashboard/orientador');
      } else {
        setError(data.message || 'Erro ao fazer login');
      }
    } catch (error) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <div className={styles.header} style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
          <div className={styles.icon}>👨‍🏫</div>
          <h1 className={styles.title}>Login do Orientador</h1>
          <p className={styles.subtitle}>Sistema APO</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          <div className={styles.formGroup}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              className={styles.input}
              placeholder="seu.email@exemplo.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Senha</label>
            <input
              type="password"
              className={styles.input}
              placeholder="••••••••"
              value={formData.senha}
              onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
              required
            />
          </div>

          <button 
            type="submit" 
            className={styles.submitButton}
            style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <div className={styles.links}>
            <a href="#" className={styles.link}>Esqueceu a senha?</a>
            <button 
              type="button"
              className={styles.backButton}
              onClick={() => router.push('/')}
            >
              ← Voltar
            </button>
          </div>
        </form>

        <div className={styles.testInfo}>
          <p className={styles.testTitle}>Credenciais de teste:</p>
          <p className={styles.testCredential}>Email: orientador@teste.com</p>
          <p className={styles.testCredential}>Senha: 123456</p>
        </div>
      </div>
    </div>
  );
}