// src/app/dashboard/orientador/page.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function PainelOrientador() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [avaliacao, setAvaliacao] = useState({
    pontos: 3,
    observacoes: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login/orientador');
      return;
    }
    setUser(JSON.parse(userData));
    fetchItemsPendentes();
  }, []);

  const fetchItemsPendentes = async () => {
    try {
      const response = await fetch('/api/orientador/items-pendentes');
      const data = await response.json();
      console.log('Items pendentes:', data);
      setItems(data.items || []);
    } catch (error) {
      console.error('Erro ao carregar itens:', error);
    }
  };

  const handleAvaliar = async (status) => {
    if (!selectedItem) return;

    if (status === 'rejeitado' && !avaliacao.observacoes.trim()) {
      alert('Por favor, adicione uma justificativa para devolução');
      return;
    }

    try {
      const response = await fetch('/api/orientador/avaliar-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_id: selectedItem.id,
          status: status,
          pontos: status === 'aprovado' ? avaliacao.pontos : 0,
          comentario: avaliacao.observacoes
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert(data.message);
        setSelectedItem(null);
        setAvaliacao({ pontos: 3, observacoes: '' });
        fetchItemsPendentes();
      } else {
        alert(data.message || 'Erro ao avaliar item');
      }
    } catch (error) {
      console.error('Erro ao avaliar item:', error);
      alert('Erro ao avaliar item');
    }
  };

  const handleDownload = () => {
    if (selectedItem && selectedItem.arquivo_url) {
      window.open(selectedItem.arquivo_url, '_blank');
    } else if (selectedItem && selectedItem.arquivo) {
      window.open(`http://localhost:5000/${selectedItem.arquivo}`, '_blank');
    } else {
      alert('Nenhum arquivo disponível para download');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleVoltar = () => {
    if (selectedItem) {
      setSelectedItem(null);
    } else {
      router.push('/');
    }
  };

  const calcularDiasPendentes = (dataSubmissao) => {
    try {
      const parts = dataSubmissao.split(' ')[0].split('/');
      const dataSubmetida = new Date(parts[2], parts[1] - 1, parts[0]);
      const hoje = new Date();
      const diffTime = Math.abs(hoje - dataSubmetida);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch (error) {
      return 0;
    }
  };

  const getFileExtension = (filename) => {
    if (!filename) return '';
    return filename.split('.').pop().toLowerCase();
  };

  const getFileIcon = (filename) => {
    const ext = getFileExtension(filename);
    const iconMap = {
      'pdf': '📄',
      'doc': '📝',
      'docx': '📝',
      'jpg': '🖼️',
      'jpeg': '🖼️',
      'png': '🖼️',
      'txt': '📃',
      'link': '🔗'
    };
    return iconMap[ext] || '📎';
  };

  if (!user) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={handleVoltar} className={styles.backButton}>
          ← Voltar
        </button>
        <div className={styles.headerContent}>
          <span className={styles.headerIcon}>📊</span>
          <div>
            <h1 className={styles.headerTitle}>Avaliar Item APO</h1>
            <p className={styles.headerSubtitle}>Análise e decisão sobre submissão do orientando</p>
          </div>
        </div>
        <button onClick={handleLogout} className={styles.logoutButton}>Sair</button>
      </div>

      <div className={styles.content}>
        {selectedItem ? (
          <div className={styles.avaliacaoContainer}>
            <div className={styles.itemCard}>
              <div className={styles.itemHeader}>
                <div>
                  <h2 className={styles.alunoNome}>{selectedItem.aluno_nome}</h2>
                  <p className={styles.itemInfo}>Aluno • Sistema APO</p>
                </div>
                {calcularDiasPendentes(selectedItem.data_submissao) > 5 && (
                  <span className={styles.urgentBadge}>URGENTE</span>
                )}
              </div>
              
              <div className={styles.itemMeta}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Data de Submissão:</span>
                  <span className={styles.metaValue}>{selectedItem.data_submissao}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Dias Pendentes:</span>
                  <span className={styles.diasPendentes}>
                    {calcularDiasPendentes(selectedItem.data_submissao)} dias
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.detalhesGrid}>
              <div className={styles.detalhesCard}>
                <h3 className={styles.cardTitle}>
                  <span className={styles.badge}>{selectedItem.tipo}</span>
                  {selectedItem.titulo}
                </h3>

                <div className={styles.descricaoSection}>
                  <h4 className={styles.sectionTitle}>Descrição da Atividade</h4>
                  <p className={styles.descricaoText}>{selectedItem.descricao}</p>
                </div>

                {selectedItem.arquivo && (
                  <div className={styles.documentosSection}>
                    <h4 className={styles.sectionTitle}>Documentos Anexados</h4>
                    <div className={styles.documentosList}>
                      <div className={styles.documentoItem}>
                        <span className={styles.docIcon}>
                          {getFileIcon(selectedItem.arquivo)}
                        </span>
                        <div className={styles.docInfo}>
                          <span className={styles.docName}>
                            {selectedItem.arquivo.split('/').pop()}
                          </span>
                          <span className={styles.docSize}>
                            {getFileExtension(selectedItem.arquivo).toUpperCase()} • Arquivo anexado
                          </span>
                        </div>
                        <button onClick={handleDownload} className={styles.downloadButton}>
                          ⬇ Baixar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.criteriosCard}>
                <h3 className={styles.cardTitle}>📋 Critérios de Avaliação</h3>
                
                <div className={styles.verificacoes}>
                  <h4 className={styles.verificacoesTitle}>Verificações Obrigatórias</h4>
                  <div className={styles.checkItem}>
                    <input type="checkbox" id="check1" />
                    <label htmlFor="check1">Certificado válido e autêntico</label>
                  </div>
                  <div className={styles.checkItem}>
                    <input type="checkbox" id="check2" />
                    <label htmlFor="check2">Carga horária adequada (mín. 20h)</label>
                  </div>
                  <div className={styles.checkItem}>
                    <input type="checkbox" id="check3" />
                    <label htmlFor="check3">Atividade relacionada ao curso</label>
                  </div>
                  <div className={styles.checkItem}>
                    <input type="checkbox" id="check4" />
                    <label htmlFor="check4">Documentação completa</label>
                  </div>
                  <div className={styles.checkItem}>
                    <input type="checkbox" id="check5" />
                    <label htmlFor="check5">Dentro do prazo regulamentar</label>
                  </div>
                </div>

                <div className={styles.pontosSection}>
                  <div className={styles.pontosDisplay}>
                    <span className={styles.pontosNumber}>{avaliacao.pontos}</span>
                    <span className={styles.pontosLabel}>Pontos APO</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="5" 
                    value={avaliacao.pontos}
                    onChange={(e) => setAvaliacao({...avaliacao, pontos: parseInt(e.target.value)})}
                    className={styles.pontosSlider}
                  />
                  <p className={styles.pontosHint}>Conforme tabela de pontuação</p>
                </div>

                <div className={styles.observacoesSection}>
                  <h4 className={styles.sectionTitle}>Observações</h4>
                  <textarea 
                    className={styles.observacoesTextarea}
                    placeholder="Adicione comentários sobre a avaliação (opcional para aprovação, obrigatório para devolução)"
                    value={avaliacao.observacoes}
                    onChange={(e) => setAvaliacao({...avaliacao, observacoes: e.target.value})}
                  />
                </div>

                <div className={styles.botoesAcao}>
                  <button 
                    className={styles.btnAprovar}
                    onClick={() => handleAvaliar('aprovado')}
                  >
                    ✓ APROVAR
                  </button>
                  <button 
                    className={styles.btnDevolver}
                    onClick={() => handleAvaliar('rejeitado')}
                  >
                    ↩ DEVOLVER
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.listaItems}>
            <h2 className={styles.listaTitle}>Items Pendentes de Avaliação</h2>
            {items.length === 0 ? (
              <div className={styles.emptyState}>Nenhum item pendente de avaliação</div>
            ) : (
              <div className={styles.itemsList}>
                {items.map((item) => (
                  <div 
                    key={item.id} 
                    className={styles.itemListCard}
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className={styles.itemListHeader}>
                      <h3 className={styles.itemListTitle}>{item.titulo}</h3>
                      {calcularDiasPendentes(item.data_submissao) > 5 && (
                        <span className={styles.urgentBadgeSmall}>URGENTE</span>
                      )}
                    </div>
                    <p className={styles.itemListAluno}>Aluno: {item.aluno_nome}</p>
                    <p className={styles.itemListData}>Submetido em: {item.data_submissao}</p>
                    <p className={styles.itemListTipo}>Tipo: {item.tipo}</p>
                    {item.arquivo && (
                      <p className={styles.itemListArquivo}>
                        {getFileIcon(item.arquivo)} Arquivo anexado
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}