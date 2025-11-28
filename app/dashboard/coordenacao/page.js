// src/app/dashboard/coordenacao/page.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function PainelCoordenacao() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeTab, setActiveTab] = useState('visao');
  const [comentario, setComentario] = useState('');
  const [observacoes, setObservacoes] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login/coordenacao');
      return;
    }
    setUser(JSON.parse(userData));
    fetchItemsValidados();
  }, []);

  const fetchItemsValidados = async () => {
    try {
      const response = await fetch('/api/coordenacao/items-validados');
      const data = await response.json();
      console.log('Items para coordenação:', data);
      setItems(data.items || []);
    } catch (error) {
      console.error('Erro ao carregar itens:', error);
    }
  };

  const handleAprovarFinal = async () => {
    if (!selectedItem) return;

    try {
      const response = await fetch('/api/coordenacao/aprovar-final', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_id: selectedItem.id,
          status: 'aprovado_final',
          comentario: observacoes
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert(data.message);
        setSelectedItem(null);
        setObservacoes('');
        fetchItemsValidados();
      } else {
        alert(data.message || 'Erro ao aprovar item');
      }
    } catch (error) {
      console.error('Erro ao aprovar item:', error);
      alert('Erro ao aprovar item');
    }
  };

  const handleDevolver = async () => {
    if (!selectedItem) return;

    if (!comentario.trim()) {
      alert('Por favor, adicione um comentário para devolução');
      return;
    }

    try {
      const response = await fetch('/api/coordenacao/aprovar-final', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_id: selectedItem.id,
          status: 'devolvido_coordenacao',
          comentario: comentario
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert(data.message);
        setSelectedItem(null);
        setComentario('');
        fetchItemsValidados();
      } else {
        alert(data.message || 'Erro ao devolver item');
      }
    } catch (error) {
      console.error('Erro ao devolver item:', error);
      alert('Erro ao devolver item');
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

  const calcularDiasPendentes = (dataReferencia) => {
    try {
      const parts = dataReferencia.split(' ')[0].split('/');
      const dataRef = new Date(parts[2], parts[1] - 1, parts[0]);
      const hoje = new Date();
      const diffTime = Math.abs(hoje - dataRef);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch (error) {
      return 0;
    }
  };

  const getFileIcon = (filename) => {
    if (!filename) return '📎';
    const ext = filename.split('.').pop().toLowerCase();
    const iconMap = {
      'pdf': '📄', 'doc': '📝', 'docx': '📝',
      'jpg': '🖼️', 'jpeg': '🖼️', 'png': '🖼️',
      'txt': '📃', 'link': '🔗'
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
          <span className={styles.headerIcon}>⚖️</span>
          <div>
            <h1 className={styles.headerTitle}>Validação Final - Coordenação APO</h1>
            <p className={styles.headerSubtitle}>Aprovação executiva e encaminhamento para formalização</p>
          </div>
        </div>
        <button onClick={handleLogout} className={styles.logoutButton}>Sair</button>
      </div>

      <div className={styles.content}>
        {/* Fluxo de Aprovação */}
        <div className={styles.fluxoContainer}>
          <div className={`${styles.fluxoStep} ${styles.completed}`}>
            <div className={styles.stepNumber}>1</div>
            <span className={styles.stepLabel}>Orientador</span>
          </div>
          <div className={styles.fluxoArrow}>→</div>
          <div className={`${styles.fluxoStep} ${styles.completed}`}>
            <div className={styles.stepNumber}>2</div>
            <span className={styles.stepLabel}>Comissão</span>
          </div>
          <div className={styles.fluxoArrow}>→</div>
          <div className={`${styles.fluxoStep} ${styles.active}`}>
            <div className={styles.stepNumber}>3</div>
            <span className={styles.stepLabel}>Coordenação</span>
          </div>
          <div className={styles.fluxoArrow}>→</div>
          <div className={styles.fluxoStep}>
            <div className={styles.stepNumber}>4</div>
            <span className={styles.stepLabel}>Secretaria</span>
          </div>
        </div>

        {selectedItem ? (
          <div className={styles.avaliacaoContainer}>
            {/* Alerta Prioritário */}
            {calcularDiasPendentes(selectedItem.data_coordenacao) > 3 && (
              <div className={styles.alertaPrioritario}>
                <span className={styles.alertaIcon}>⚠️</span>
                <div>
                  <h3 className={styles.alertaTitle}>Item Prioritário - Ação Requerida</h3>
                  <p className={styles.alertaText}>
                    Este item está na coordenação há {calcularDiasPendentes(selectedItem.data_coordenacao)} dias. 
                    Processamento rápido recomendado para manter o fluxo eficiente.
                  </p>
                </div>
              </div>
            )}

            {/* Card do Item */}
            <div className={styles.itemCard}>
              <div className={styles.itemHeader}>
                <div>
                  <div className={styles.prioridadeBadge}>VALIDADO PELA COMISSÃO</div>
                  <h2 className={styles.itemTitle}>{selectedItem.aluno_nome} - {selectedItem.titulo}</h2>
                  <p className={styles.itemSubtitle}>Tipo: {selectedItem.tipo} • {selectedItem.pontos} pontos</p>
                </div>
              </div>

              <div className={styles.statusGrid}>
                <div className={styles.statusItem}>
                  <span className={styles.statusIcon}>✓</span>
                  <div>
                    <span className={styles.statusLabel}>Orientador</span>
                    <span className={styles.statusValue}>Aprovado</span>
                  </div>
                </div>
                <div className={styles.statusItem}>
                  <span className={styles.statusIcon}>✓</span>
                  <div>
                    <span className={styles.statusLabel}>Comissão APO</span>
                    <span className={styles.statusValue}>Validado</span>
                  </div>
                </div>
              </div>

              <div className={styles.metaGrid}>
                <div className={styles.metaBox}>
                  <span className={styles.metaLabel}>DATA SUBMISSÃO</span>
                  <span className={styles.metaValue}>{selectedItem.data_submissao.split(' ')[0]}</span>
                </div>
                <div className={styles.metaBox}>
                  <span className={styles.metaLabel}>DIAS NA COORDENAÇÃO</span>
                  <span className={styles.metaDias}>
                    {calcularDiasPendentes(selectedItem.data_coordenacao)} dias
                  </span>
                </div>
                <div className={styles.metaBox}>
                  <span className={styles.metaLabel}>PONTUAÇÃO</span>
                  <span className={styles.metaValue}>{selectedItem.pontos} pontos</span>
                </div>
                <div className={styles.metaBox}>
                  <span className={styles.metaLabel}>STATUS ATUAL</span>
                  <span className={styles.metaStatus}>Validação Final</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className={styles.tabsContainer}>
              <button 
                className={`${styles.tab} ${activeTab === 'visao' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('visao')}
              >
                👁️ Visão Geral
              </button>
              <button 
                className={`${styles.tab} ${activeTab === 'avaliacoes' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('avaliacoes')}
              >
                📊 Avaliações
              </button>
              <button 
                className={`${styles.tab} ${activeTab === 'documentos' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('documentos')}
              >
                🔎 Documentos
              </button>
            </div>

            {/* Conteúdo das Tabs */}
            {activeTab === 'visao' && (
              <div className={styles.tabContent}>
                <div className={styles.atividadeCard}>
                  <h3 className={styles.cardTitle}>
                    <span className={styles.badge}>{selectedItem.tipo}</span>
                    {selectedItem.titulo}
                  </h3>

                  <div className={styles.descricaoSection}>
                    <h4 className={styles.sectionTitle}>Descrição da Atividade</h4>
                    <p className={styles.descricaoText}>{selectedItem.descricao}</p>
                  </div>

                  <div className={styles.observacoesSection}>
                    <h4 className={styles.sectionTitle}>Observações da Coordenação</h4>
                    <textarea 
                      className={styles.observacoesTextarea}
                      placeholder="Adicione comentários (opcional para aprovação, obrigatório para devolução)"
                      value={observacoes}
                      onChange={(e) => setObservacoes(e.target.value)}
                    />
                  </div>

                  <div className={styles.acaoFinal}>
                    <button className={styles.btnAprovarFinal} onClick={handleAprovarFinal}>
                      ✓ APROVAR E ENCAMINHAR PARA FORMALIZAÇÃO
                    </button>
                    <button className={styles.btnDevolver} onClick={handleDevolver}>
                      ↩ DEVOLVER À COMISSÃO
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'avaliacoes' && (
              <div className={styles.tabContent}>
                <div className={styles.avaliacoesCard}>
                  {selectedItem.comentario_orientador && (
                    <div className={styles.avaliacaoItem}>
                      <h4>Aprovação do Orientador</h4>
                      <p className={styles.avaliacaoAutor}>
                        Aprovado em {selectedItem.data_aprovacao_orientador}
                      </p>
                      <p className={styles.avaliacaoTexto}>{selectedItem.comentario_orientador}</p>
                    </div>
                  )}
                  {selectedItem.comentario_comissao && (
                    <div className={styles.avaliacaoItem}>
                      <h4>Validação da Comissão</h4>
                      <p className={styles.avaliacaoAutor}>
                        Validado em {selectedItem.data_aprovacao_comissao}
                      </p>
                      <p className={styles.avaliacaoTexto}>{selectedItem.comentario_comissao}</p>
                    </div>
                  )}
                  {!selectedItem.comentario_orientador && !selectedItem.comentario_comissao && (
                    <p className={styles.noAvaliacoes}>Nenhuma avaliação disponível</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'documentos' && (
              <div className={styles.tabContent}>
                <div className={styles.documentosCard}>
                  {selectedItem.arquivo ? (
                    <div className={styles.documentoItem}>
                      <span className={styles.docIcon}>
                        {getFileIcon(selectedItem.arquivo)}
                      </span>
                      <div className={styles.docInfo}>
                        <span className={styles.docName}>
                          {selectedItem.arquivo.split('/').pop()}
                        </span>
                        <span className={styles.docSize}>Arquivo anexado</span>
                      </div>
                      <button onClick={handleDownload} className={styles.downloadButton}>
                        ⬇ Baixar
                      </button>
                    </div>
                  ) : (
                    <p className={styles.noDocuments}>Nenhum documento anexado</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.listaItems}>
            <h2 className={styles.listaTitle}>Items Validados Aguardando Aprovação Final</h2>
            {items.length === 0 ? (
              <div className={styles.emptyState}>Nenhum item pendente de aprovação final</div>
            ) : (
              <div className={styles.itemsList}>
                {items.map((item) => (
                  <div 
                    key={item.id} 
                    className={styles.itemListCard}
                    onClick={() => setSelectedItem(item)}
                  >
                    {calcularDiasPendentes(item.data_coordenacao) > 3 && (
                      <div className={styles.priorityBadge}>ALTA PRIORIDADE</div>
                    )}
                    <h3 className={styles.itemListTitle}>{item.titulo}</h3>
                    <p className={styles.itemListAluno}>Aluno: {item.aluno_nome}</p>
                    <p className={styles.itemListStatus}>✓ Validado pela Comissão</p>
                    <p className={styles.itemListPontos}>{item.pontos} pontos</p>
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