// src/app/dashboard/aluno/page.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function PainelAluno() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({
    pontosAtual: 0,
    pontosTotal: 12,
    pendentes: 0,
    aprovados: 0
  });
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [newItem, setNewItem] = useState({
    tipo: '',
    titulo: '',
    descricao: '',
    arquivo: null
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login/aluno');
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      console.log('Usuário carregado do localStorage:', parsedUser);
      
      if (!parsedUser.id) {
        console.error('Usuário sem ID! Objeto completo:', parsedUser);
        alert('Erro: Dados de usuário inválidos. Faça login novamente.');
        localStorage.removeItem('user');
        router.push('/login/aluno');
        return;
      }
      
      setUser(parsedUser);
      fetchDashboardData(parsedUser.id);
    } catch (error) {
      console.error('Erro ao parsear dados do usuário:', error);
      localStorage.removeItem('user');
      router.push('/login/aluno');
    }
  }, []);

  const fetchDashboardData = async (alunoId) => {
    try {
      console.log('Buscando dashboard para aluno ID:', alunoId);
      const response = await fetch(`/api/aluno/dashboard?aluno_id=${alunoId}`);
      const data = await response.json();
      
      console.log('Dados recebidos:', data);
      
      if (data.items) {
        setItems(data.items);
      }
      if (data.stats) {
        setStats(data.stats);
        
        // Atualizar pontos no localStorage
        const userData = JSON.parse(localStorage.getItem('user'));
        userData.pontos_total = data.stats.pontosAtual;
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Usuário não autenticado');
      return;
    }

    if (!user.id) {
      console.error('user object:', user);
      alert('Erro: ID do usuário não encontrado. Faça login novamente.');
      router.push('/login/aluno');
      return;
    }

    const formData = new FormData();
    formData.append('aluno_id', user.id.toString());
    formData.append('tipo', newItem.tipo);
    formData.append('titulo', newItem.titulo);
    formData.append('descricao', newItem.descricao);
    
    if (newItem.arquivo) {
      formData.append('arquivo', newItem.arquivo);
    }

    console.log('Enviando formulário com user.id:', user.id);

    try {
      const response = await fetch('/api/aluno/submit-item', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert('Item enviado com sucesso!');
        setNewItem({ tipo: '', titulo: '', descricao: '', arquivo: null });
        setShowForm(false);
        fetchDashboardData(user.id);
      } else {
        alert(data.message || 'Erro ao enviar item');
      }
    } catch (error) {
      console.error('Erro ao enviar item:', error);
      alert('Erro ao enviar item');
    }
  };

  const handleFileChange = (e) => {
    setNewItem({ ...newItem, arquivo: e.target.files[0] });
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleDownload = (arquivo) => {
    if (arquivo) {
      const filename = arquivo.replace('uploads/', '').replace('uploads\\', '');
      window.open(`http://localhost:5000/uploads/${filename}`, '_blank');
    } else {
      alert('Nenhum arquivo disponível para download');
    }
  };

  const getStatusDisplay = (status) => {
    const statusMap = {
      'pendente_orientador': 'Pendente - Orientador',
      'pendente_comissao': 'Pendente - Comissão',
      'pendente_coordenacao': 'Pendente - Coordenação',
      'aguardando_formalizacao': 'Aguardando Formalização',
      'aprovado_final': 'Aprovado',
      'devolvido_orientador': 'Devolvido - Orientador',
      'devolvido_comissao': 'Devolvido - Comissão',
      'devolvido_coordenacao': 'Devolvido - Coordenação'
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status) => {
    if (status === 'aprovado_final' || status === 'aguardando_formalizacao') return 'aprovado';
    if (status.includes('devolvido')) return 'devolvido';
    return 'pendente';
  };

  if (!user) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  return (
    <div className={styles.container}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <div className={styles.brand}>
            <span className={styles.logo}>🎓</span>
            <span className={styles.brandName}>Sistema APO</span>
          </div>
          <div className={styles.userSection}>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user.nome}</span>
              <span className={styles.userType}>Aluno • {stats.pontosAtual} pontos APO</span>
            </div>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Sair
            </button>
          </div>
        </div>
      </nav>
      
      <div className={styles.content}>
        {/* Cards de Estatísticas */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3 className={styles.statTitle}>Meu Progresso APO</h3>
            <div className={styles.progressInfo}>
              <div className={styles.progressNumbers}>
                <div className={styles.progressItem}>
                  <div className={styles.progressValue}>{stats.pontosAtual}</div>
                  <div className={styles.progressLabel}>Pontos Atual</div>
                </div>
                <div className={styles.progressItem}>
                  <div className={styles.progressValue}>{stats.pontosTotal}</div>
                  <div className={styles.progressLabel}>Meta</div>
                </div>
              </div>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill}
                  style={{ width: `${(stats.pontosAtual / stats.pontosTotal) * 100}%` }}
                ></div>
              </div>
              <button 
                className={styles.newItemButton}
                onClick={() => setShowForm(!showForm)}
              >
                + Novo Item APO
              </button>
            </div>
          </div>

          <div className={styles.statCard}>
            <h3 className={styles.statTitle}>Status dos Itens</h3>
            <div className={styles.statusInfo}>
              <div className={styles.statusItem}>
                <div className={styles.statusValue}>{stats.pendentes}</div>
                <div className={styles.statusLabel}>Pendentes</div>
              </div>
              <div className={styles.statusItem}>
                <div className={styles.statusValue}>{stats.aprovados}</div>
                <div className={styles.statusLabel}>Aprovados</div>
              </div>
            </div>
            <a href="#items" className={styles.viewAllLink}>Ver Todos</a>
          </div>
        </div>

        {/* Formulário de Submissão - Condicional */}
        {showForm && (
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Submeter Novo Item APO</h2>
          
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Tipo de Atividade</label>
              <select 
                className={styles.formSelect}
                value={newItem.tipo}
                onChange={(e) => setNewItem({ ...newItem, tipo: e.target.value })}
                required
              >
                <option value="">Selecione o tipo</option>
                <option value="workshop">Workshop</option>
                <option value="monitoria">Monitoria</option>
                <option value="pesquisa">Pesquisa</option>
                <option value="extensao">Extensão</option>
                <option value="evento">Evento</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Título da Atividade</label>
              <input 
                type="text"
                className={styles.formInput}
                placeholder="Digite o título"
                value={newItem.titulo}
                onChange={(e) => setNewItem({ ...newItem, titulo: e.target.value })}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Descrição</label>
              <textarea 
                className={styles.formTextarea}
                placeholder="Descreva a atividade"
                value={newItem.descricao}
                onChange={(e) => setNewItem({ ...newItem, descricao: e.target.value })}
                required
              ></textarea>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Anexar Comprovante</label>
              <input 
                type="file"
                className={styles.formFile}
                onChange={handleFileChange}
                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
              />
            </div>

            <button type="submit" className={styles.submitButton}>
              Enviar para Orientador
            </button>
          </form>
        </div>
        )}

        {/* Modal de Detalhes do Item */}
        {selectedItem && (
          <div className={styles.modalOverlay} onClick={() => setSelectedItem(null)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>{selectedItem.titulo}</h2>
                <button onClick={() => setSelectedItem(null)} className={styles.closeButton}>
                  ✕
                </button>
              </div>
              
              <div className={styles.modalBody}>
                <div className={styles.detailGroup}>
                  <label className={styles.detailLabel}>Tipo:</label>
                  <span className={styles.detailValue}>{selectedItem.tipo}</span>
                </div>
                
                <div className={styles.detailGroup}>
                  <label className={styles.detailLabel}>Status:</label>
                  <span className={`${styles.itemStatus} ${styles[getStatusClass(selectedItem.status)]}`}>
                    {getStatusDisplay(selectedItem.status)}
                  </span>
                </div>
                
                <div className={styles.detailGroup}>
                  <label className={styles.detailLabel}>Pontos:</label>
                  <span className={styles.detailValue}>{selectedItem.pontos} pontos</span>
                </div>
                
                <div className={styles.detailGroup}>
                  <label className={styles.detailLabel}>Data de Submissão:</label>
                  <span className={styles.detailValue}>{selectedItem.data}</span>
                </div>
                
                <div className={styles.detailGroup}>
                  <label className={styles.detailLabel}>Descrição:</label>
                  <p className={styles.detailText}>{selectedItem.descricao}</p>
                </div>
                
                {selectedItem.arquivo && (
                  <div className={styles.detailGroup}>
                    <label className={styles.detailLabel}>Arquivo Anexado:</label>
                    <button 
                      onClick={() => handleDownload(selectedItem.arquivo)}
                      className={styles.downloadButton}
                    >
                      ⬇️ Baixar Arquivo
                    </button>
                  </div>
                )}
                
                {/* Comentários de devolução */}
                {selectedItem.status.includes('devolvido') && (
                  <div className={styles.commentSection}>
                    <h3 className={styles.commentTitle}>Motivo da Devolução:</h3>
                    
                    {selectedItem.comentario_orientador && selectedItem.status === 'devolvido_orientador' && (
                      <div className={styles.commentBox}>
                        <div className={styles.commentHeader}>
                          <span className={styles.commentAuthor}>👨‍🏫 Orientador</span>
                        </div>
                        <p className={styles.commentText}>{selectedItem.comentario_orientador}</p>
                      </div>
                    )}
                    
                    {selectedItem.comentario_comissao && selectedItem.status === 'devolvido_comissao' && (
                      <div className={styles.commentBox}>
                        <div className={styles.commentHeader}>
                          <span className={styles.commentAuthor}>👥 Comissão</span>
                        </div>
                        <p className={styles.commentText}>{selectedItem.comentario_comissao}</p>
                      </div>
                    )}
                    
                    {selectedItem.comentario_coordenacao && selectedItem.status === 'devolvido_coordenacao' && (
                      <div className={styles.commentBox}>
                        <div className={styles.commentHeader}>
                          <span className={styles.commentAuthor}>📋 Coordenação</span>
                        </div>
                        <p className={styles.commentText}>{selectedItem.comentario_coordenacao}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Lista de Itens Recentes */}
        <div className={styles.itemsSection} id="items">
          <h2 className={styles.sectionTitle}>Meus Itens Recentes</h2>
          
          <div className={styles.itemsList}>
            {items.length === 0 ? (
              <div className={styles.emptyState}>
                Nenhum item submetido ainda
              </div>
            ) : (
              items.map((item) => (
                <div 
                  key={item.id} 
                  className={styles.itemCard}
                  onClick={() => setSelectedItem(item)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={styles.itemHeader}>
                    <h3 className={styles.itemTitle}>{item.titulo}</h3>
                    <span className={`${styles.itemStatus} ${styles[getStatusClass(item.status)]}`}>
                      {getStatusDisplay(item.status)}
                    </span>
                  </div>
                  <p className={styles.itemMeta}>
                    <strong>Tipo:</strong> {item.tipo} • <strong>Pontos:</strong> {item.pontos}
                  </p>
                  <p className={styles.itemDate}>Submetido em {item.data}</p>
                  {item.status.includes('devolvido') && (
                    <p className={styles.itemAlert}>⚠️ Este item foi devolvido. Clique para ver o motivo.</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}