// src/app/login/aluno/page.js
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function LoginAluno() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
    tipo: 'aluno'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Tentando fazer login com:', formData);

      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      console.log('Resposta do login:', data);

      if (data.success && data.user) {
        // Verificar se o user tem ID
        if (!data.user.id) {
          console.error('Resposta do backend sem ID:', data);
          setError('Erro: Dados de usuário inválidos');
          return;
        }

        // Salvar no localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('Usuário salvo no localStorage:', data.user);

        // Redirecionar
        router.push('/dashboard/aluno');
      } else {
        setError(data.message || 'Credenciais inválidas');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <div className={styles.header}>
          <span className={styles.icon}>🎓</span>
          <h1 className={styles.title}>Portal do Aluno</h1>
          <p className={styles.subtitle}>Sistema de Atividades Complementares</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <div className={styles.formGroup}>
            <label className={styles.label}>E-mail</label>
            <input
              type="email"
              className={styles.input}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="seu.email@exemplo.com"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Senha</label>
            <input
              type="password"
              className={styles.input}
              value={formData.senha}
              onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className={styles.testCredentials}>
          <p className={styles.testTitle}>🔑 Credenciais de Teste:</p>
          <p className={styles.testInfo}>
            <strong>Email:</strong> aluno@teste.com<br />
            <strong>Senha:</strong> 123456
          </p>
        </div>

        <button 
          onClick={() => router.push('/')} 
          className={styles.backButton}
        >
          ← Voltar
        </button>
      </div>
    </div>
  );
}