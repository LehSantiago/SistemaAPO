// src/app/dashboard/comissao/page.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function PainelComissao() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeTab, setActiveTab] = useState('detalhes');
  const [parecer, setParecer] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login/comissao');
      return;
    }
    setUser(JSON.parse(userData));
    fetchItemsAprovados();
  }, []);

  const fetchItemsAprovados = async () => {
    try {
      const response = await fetch('/api/comissao/items-aprovados');
      const data = await response.json();
      console.log('Items para comissão:', data);
      setItems(data.items || []);
    } catch (error) {
      console.error('Erro ao carregar itens:', error);
    }
  };

  const handleAprovar = async () => {
    if (!selectedItem) return;

    try {
      const response = await fetch('/api/comissao/validar-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_id: selectedItem.id,
          status: 'validado_comissao',
          parecer: parecer
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert(data.message);
        setSelectedItem(null);
        setParecer('');
        fetchItemsAprovados();
      } else {
        alert(data.message || 'Erro ao validar item');
      }
    } catch (error) {
      console.error('Erro ao validar item:', error);
      alert('Erro ao validar item');
    }
  };

  const handleDevolver = async () => {
    if (!selectedItem) return;

    if (!parecer.trim()) {
      alert('Por favor, adicione um parecer para devolução');
      return;
    }

    try {
      const response = await fetch('/api/comissao/validar-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_id: selectedItem.id,
          status: 'devolvido_comissao',
          parecer: parecer
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert(data.message);
        setSelectedItem(null);
        setParecer('');
        fetchItemsAprovados();
      } else {
        alert(data.message || 'Erro ao devolver item');
      }
    } catch (error) {
      console.error('Erro ao devolver item:', error);
      alert('Erro ao devolver item');
    }
  };

  const handleDownload = (arquivo) => {
  if (arquivo) {
    const filename = arquivo.replace('uploads/', '').replace('uploads\\', '');
    window.open(`http://localhost:5000/uploads/${filename}`, '_blank');
  } else {
    alert('Nenhum arquivo disponível para download');
  }
};
const handleVoltarBtn = () => {
  if (selectedItem) {
    setSelectedItem(null);
  } else {
    router.push('/');
  }
};


const handleVerLink = (link) => {
  if (link && link.trim()) {
    window.open(link.startsWith('http') ? link : `https://${link}`, '_blank');
  } else {
    alert('Nenhum link fornecido');
  }
};


  const handleLogout = () => {
  localStorage.removeItem('user');
  router.push('/');
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

  if (!user) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => setSelectedItem(null)} className={styles.backButton}>
          ← Voltar
        </button>
        <div className={styles.headerContent}>
          <span className={styles.headerIcon}>🔍</span>
          <div>
            <h1 className={styles.headerTitle}>Análise Técnica - Comissão APO</h1>
            <p className={styles.headerSubtitle}>Avaliação técnica e conformidade regulamentar</p>
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
          <div className={`${styles.fluxoStep} ${styles.active}`}>
            <div className={styles.stepNumber}>2</div>
            <span className={styles.stepLabel}>Comissão</span>
          </div>
          <div className={styles.fluxoArrow}>→</div>
          <div className={styles.fluxoStep}>
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
            {/* Card do Aluno */}
            <div className={styles.alunoCard}>
              <div className={styles.aprovadoBadge}>✓ APROVADO PELO ORIENTADOR</div>
              <h2 className={styles.itemTitle}>{selectedItem.aluno_nome} - {selectedItem.titulo}</h2>
              <p className={styles.itemSubtitle}>Tipo: {selectedItem.tipo} • {selectedItem.pontos} pontos</p>
              
              <div className={styles.metaGrid}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Submetido pelo Aluno</span>
                  <span className={styles.metaValue}>{selectedItem.data_submissao}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Aprovado pelo Orientador</span>
                  <span className={styles.metaValue}>{selectedItem.data_aprovacao_orientador}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Dias na Comissão</span>
                  <span className={styles.diasPendentes}>
                    {calcularDiasPendentes(selectedItem.data_aprovacao_orientador || selectedItem.data_submissao)} dias
                  </span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Pontuação Atribuída</span>
                  <span className={styles.metaValue}>{selectedItem.pontos} pontos</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className={styles.tabsContainer}>
              <button 
                className={`${styles.tab} ${activeTab === 'detalhes' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('detalhes')}
              >
                📋 Detalhes
              </button>
              <button 
                className={`${styles.tab} ${activeTab === 'documentos' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('documentos')}
              >
                📎 Documentos
              </button>
            </div>

            {/* Conteúdo das Tabs */}
            {activeTab === 'detalhes' && (
              <div className={styles.detalhesContent}>
                <div className={styles.atividadeCard}>
                  <h3 className={styles.cardTitle}>
                    <span className={styles.badge}>{selectedItem.tipo}</span>
                    {selectedItem.titulo}
                  </h3>

                  <div className={styles.descricaoSection}>
                    <h4 className={styles.sectionTitle}>📝 Descrição da Atividade</h4>
                    <p className={styles.descricaoText}>{selectedItem.descricao}</p>
                  </div>

                  {selectedItem.comentario_orientador && (
                    <div className={styles.orientadorSection}>
                      <div className={styles.orientadorHeader}>
                        <div className={styles.orientadorAvatar}>OR</div>
                        <div>
                          <h4 className={styles.orientadorNome}>Parecer do Orientador</h4>
                          <p className={styles.orientadorCargo}>Aprovado em {selectedItem.data_aprovacao_orientador}</p>
                        </div>
                      </div>
                      <div className={styles.parecerBox}>
                        <p className={styles.parecerTexto}>{selectedItem.comentario_orientador}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className={styles.acaoCard}>
                  <h3 className={styles.cardTitle}>✓ Validação da Comissão</h3>
                  
                  <div className={styles.parecerSection}>
                    <label className={styles.parecerLabel}>Parecer da Comissão</label>
                    <textarea 
                      className={styles.parecerTextarea}
                      placeholder="Adicione observações técnicas sobre a conformidade regulamentar..."
                      value={parecer}
                      onChange={(e) => setParecer(e.target.value)}
                    />
                  </div>

                  <div className={styles.botoesAcao}>
                    <button className={styles.btnValidar} onClick={handleAprovar}>
                      ✓ VALIDAR E ENCAMINHAR
                    </button>
                    <button className={styles.btnDevolver} onClick={handleDevolver}>
                      ↩ DEVOLVER AO ORIENTADOR
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'documentos' && (
              <div className={styles.documentosContent}>
                {selectedItem.arquivo ? (
                  <div className={styles.documentoItem}>
                    <span className={styles.docIcon}>📄</span>
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
            )}
          </div>
        ) : (
          <div className={styles.listaItems}>
            <h2 className={styles.listaTitle}>Items Aprovados Pendentes de Validação</h2>
            {items.length === 0 ? (
              <div className={styles.emptyState}>Nenhum item pendente de validação</div>
            ) : (
              <div className={styles.itemsList}>
                {items.map((item) => (
                  <div 
                    key={item.id} 
                    className={styles.itemListCard}
                    onClick={() => setSelectedItem(item)}
                  >
                    <h3 className={styles.itemListTitle}>{item.titulo}</h3>
                    <p className={styles.itemListAluno}>Aluno: {item.aluno_nome}</p>
                    <p className={styles.itemListStatus}>✓ Aprovado pelo Orientador</p>
                    <p className={styles.itemListPontos}>{item.pontos} pontos</p>
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