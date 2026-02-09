// src/app/page.js
'use client';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();

  const userTypes = [
    { id: 'aluno', label: 'ALUNO', icon: '🎓', color: '#3B82F6', path: '/login/aluno' },
    { id: 'orientador', label: 'ORIENTADOR', icon: '👨‍🏫', color: '#EF4444', path: '/login/orientador' },
    { id: 'comissao', label: 'COMISSÃO', icon: '👥', color: '#F59E0B', path: '/login/comissao' },
    { id: 'coordenacao', label: 'COORDENAÇÃO', icon: '📋', color: '#8B5CF6', path: '/login/coordenacao' },
    { id: 'secretaria', label: 'SECRETARIA', icon: '📊', color: '#10B981', path: '/login/secretaria' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Sistema APO</h1>
        <p className={styles.subtitle}>Aprovação de Atividades Práticas Orientadas</p>
      </div>

      <div className={styles.content}>
        <h2 className={styles.sectionTitle}>Selecione seu tipo de usuário</h2>
        
        <div className={styles.userTypeGrid}>
          {userTypes.map((type) => (
            <button
              key={type.id}
              className={styles.userTypeButton}
              style={{ backgroundColor: type.color }}
              onClick={() => router.push(type.path)}
            >
              <span className={styles.userTypeIcon}>{type.icon}</span>
              <span className={styles.userTypeLabel}>{type.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}