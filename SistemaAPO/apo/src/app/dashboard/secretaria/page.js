// src/app/dashboard/secretaria/page.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function PainelSecretaria() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [items, setItems] = useState([]);
  const [assinaturas, setAssinaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('items'); // 'items', 'detail', 'arquivos'
  const [arquivoAssinado, setArquivoAssinado] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [arquivosPorAluno, setArquivosPorAluno] = useState([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login/secretaria');
      return;
    }
    setUser(JSON.parse(userData));
    fetchItems();
  }, []);

  useEffect(() => {
    if (selectedItem) {
      fetchAssinaturas(selectedItem.id);
    }
  }, [selectedItem]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/secretaria/items-aprovados');
      const data = await response.json();
      setItems(data.items || []);
    } catch (error) {
      console.error('Erro ao carregar items:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssinaturas = async (itemId) => {
    try {
      const response = await fetch(`/api/secretaria/assinaturas/${itemId}`);
      const data = await response.json();
      setAssinaturas(data.assinaturas || []);
    } catch (error) {
      console.error('Erro ao carregar assinaturas:', error);
    }
  };

  const fetchArquivosAluno = async (matricula) => {
    try {
      const response = await fetch(`/api/secretaria/arquivos-aluno/${matricula}`);
      const data = await response.json();
      setArquivosPorAluno(data.arquivos || []);
    } catch (error) {
      console.error('Erro ao carregar arquivos:', error);
      alert('Erro ao carregar arquivos do aluno');
    }
  };

  const handleEnviarLembrete = async () => {
    try {
      const response = await fetch('/api/secretaria/enviar-lembrete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          item_id: selectedItem.id,
          aluno_email: selectedItem.aluno_email || 'aluno@exemplo.com',
          aluno_nome: selectedItem.aluno_nome
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert('Lembretes enviados com sucesso!\n\nExemplo de e-mail enviado:\n\n' +
              'Para: ' + (selectedItem.aluno_email || 'aluno@exemplo.com') + '\n' +
              'Assunto: Lembrete - Assinatura Pendente APO\n\n' +
              'Olá ' + selectedItem.aluno_nome + ',\n\n' +
              'Este é um lembrete sobre o item APO "' + selectedItem.titulo + '" que está aguardando assinaturas.\n\n' +
              'Por favor, acompanhe o status das assinaturas no sistema.\n\n' +
              'Atenciosamente,\n' +
              'Secretaria Acadêmica');
      } else {
        alert('Erro ao enviar lembretes');
      }
    } catch (error) {
      console.error('Erro ao enviar lembrete:', error);
      alert('Erro ao enviar lembretes');
    }
  };

  const handleUploadAssinado = async () => {
    if (!arquivoAssinado) {
      alert('Por favor, selecione um arquivo');
      return;
    }

    if (!selectedItem) {
      alert('Nenhum item selecionado');
      return;
    }

    const formData = new FormData();
    formData.append('arquivo_assinado', arquivoAssinado);
    formData.append('item_id', selectedItem.id);
    formData.append('aluno_matricula', selectedItem.aluno_matricula || selectedItem.aluno_id);

    try {
      setUploadProgress(true);
      const response = await fetch('/api/secretaria/upload-assinado', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert('Arquivo assinado enviado com sucesso!');
        setArquivoAssinado(null);
        fetchItems();
      } else {
        alert(data.message || 'Erro ao fazer upload');
      }
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao fazer upload do arquivo');
    } finally {
      setUploadProgress(false);
    }
  };

  const handleDownloadDoc = () => {
    if (selectedItem && selectedItem.arquivo_url) {
      window.open(selectedItem.arquivo_url, '_blank');
    } else if (selectedItem && selectedItem.arquivo) {
      window.open(`http://localhost:5000/${selectedItem.arquivo}`, '_blank');
    } else {
      alert('Nenhum arquivo disponível para download');
    }
  };

  const handleDownloadAssinado = (arquivo) => {
    if (arquivo) {
      window.open(`http://localhost:5000/${arquivo}`, '_blank');
    } else {
      alert('Arquivo não disponível');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleVoltar = () => {
    if (activeView === 'detail') {
      setActiveView('items');
      setSelectedItem(null);
    } else if (activeView === 'arquivos') {
      if (alunoSelecionado) {
        setAlunoSelecionado(null);
        setArquivosPorAluno([]);
      } else {
        setActiveView('items');
      }
    } else {
      router.push('/');
    }
  };

  const handleVerArquivos = () => {
    setActiveView('arquivos');
  };

  const handleSelectAluno = async (item) => {
    setAlunoSelecionado(item);
    await fetchArquivosAluno(item.aluno_matricula || item.aluno_id);
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

  const assinaturasPendentes = assinaturas.filter(a => a.status === 'pendente').length;

  // View: Arquivos por Aluno
  if (activeView === 'arquivos') {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <button onClick={handleVoltar} className={styles.backButton}>
            ← Voltar
          </button>
          <div className={styles.headerContent}>
            <span className={styles.headerIcon}>📂</span>
            <div>
              <h1 className={styles.headerTitle}>Arquivos por Aluno</h1>
              <p className={styles.headerSubtitle}>Visualização de documentos organizados por matrícula</p>
            </div>
          </div>
          <button onClick={handleLogout} className={styles.logoutButton}>Sair</button>
        </div>

        <div className={styles.content}>
          {!alunoSelecionado ? (
            <>
              <h2 className={styles.pageTitle}>Selecione um Aluno</h2>
              <div className={styles.itemsList}>
                {items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectAluno(item)}
                    className={styles.itemCard}
                  >
                    <div className={styles.itemInfo}>
                      <h3 className={styles.itemTitle}>{item.aluno_nome}</h3>
                      <p className={styles.itemMeta}>
                        <strong>Matrícula:</strong> {item.aluno_matricula || item.aluno_id}
                      </p>
                      <p className={styles.itemMeta}>
                        <strong>Itens APO:</strong> Ver arquivos →
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className={styles.alunoHeader}>
                <h2 className={styles.pageTitle}>
                  Arquivos de {alunoSelecionado.aluno_nome}
                </h2>
                <p className={styles.alunoMatricula}>
                  Matrícula: {alunoSelecionado.aluno_matricula || alunoSelecionado.aluno_id}
                </p>
              </div>

              {arquivosPorAluno.length === 0 ? (
                <div className={styles.emptyState}>
                  <span className={styles.emptyIcon}>📄</span>
                  <p>Nenhum arquivo encontrado para este aluno</p>
                </div>
              ) : (
                <div className={styles.arquivosList}>
                  {arquivosPorAluno.map((arq, index) => (
                    <div key={index} className={styles.arquivoCard}>
                      <div className={styles.arquivoHeader}>
                        <h3 className={styles.arquivoTitulo}>{arq.titulo}</h3>
                        <span className={styles.arquivoStatus}>{arq.status}</span>
                      </div>
                      
                      <div className={styles.arquivoDetalhes}>
                        <p><strong>Tipo:</strong> {arq.tipo}</p>
                        <p><strong>Pontos:</strong> {arq.pontos}</p>
                        <p><strong>Submetido em:</strong> {arq.data_submissao}</p>
                      </div>

                      <div className={styles.arquivosSection}>
                        {arq.arquivo && (
                          <div className={styles.documentoItem}>
                            <span className={styles.docIcon}>
                              {getFileIcon(arq.arquivo)}
                            </span>
                            <div className={styles.docInfo}>
                              <span className={styles.docName}>Arquivo Original</span>
                              <span className={styles.docSize}>
                                {arq.arquivo.split('/').pop()}
                              </span>
                            </div>
                            <button 
                              onClick={() => window.open(arq.arquivo_url, '_blank')}
                              className={styles.downloadButton}
                            >
                              ⬇ Baixar
                            </button>
                          </div>
                        )}

                        {arq.arquivo_assinado && (
                          <div className={styles.documentoItem}>
                            <span className={styles.docIcon}>✓ 📄</span>
                            <div className={styles.docInfo}>
                              <span className={styles.docName}>Arquivo Assinado</span>
                              <span className={styles.docSize}>
                                {arq.arquivo_assinado.split('/').pop()}
                              </span>
                            </div>
                            <button 
                              onClick={() => window.open(arq.arquivo_assinado_url, '_blank')}
                              className={styles.downloadButton}
                            >
                              ⬇ Baixar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  // View: Lista de Items
  if (activeView === 'items') {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <button onClick={handleVoltar} className={styles.backButton}>
            ← Voltar
          </button>
          <div className={styles.headerContent}>
            <span className={styles.headerIcon}>📋</span>
            <div>
              <h1 className={styles.headerTitle}>Formalização APO - Secretaria</h1>
              <p className={styles.headerSubtitle}>Processamento final e registro acadêmico oficial</p>
            </div>
          </div>
          <div className={styles.headerButtons}>
            <button onClick={handleVerArquivos} className={styles.arquivosButton}>
              📂 Ver Arquivos por Aluno
            </button>
            <button onClick={handleLogout} className={styles.logoutButton}>Sair</button>
          </div>
        </div>

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
          <div className={`${styles.fluxoStep} ${styles.completed}`}>
            <div className={styles.stepNumber}>3</div>
            <span className={styles.stepLabel}>Coordenação</span>
          </div>
          <div className={styles.fluxoArrow}>→</div>
          <div className={`${styles.fluxoStep} ${styles.active}`}>
            <div className={styles.stepNumber}>4</div>
            <span className={styles.stepLabel}>Secretaria</span>
          </div>
        </div>

        <div className={styles.content}>
          <h2 className={styles.pageTitle}>Items Aprovados Aguardando Formalização</h2>
          
          {loading ? (
            <div className={styles.loadingState}>Carregando...</div>
          ) : items.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>📄</span>
              <p>Nenhum item aguardando formalização</p>
            </div>
          ) : (
            <div className={styles.itemsList}>
              {items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedItem(item);
                    setActiveView('detail');
                  }}
                  className={styles.itemCard}
                >
                  <div className={styles.itemHeader}>
                    <div className={styles.itemInfo}>
                      <div className={styles.priorityBadge}>ALTA PRIORIDADE</div>
                      <h3 className={styles.itemTitle}>{item.aluno_nome} - {item.titulo}</h3>
                      <p className={styles.itemStatus}>
                        ✓ Aprovado pelo Orientador • ✓ Validado pela Comissão • ✓ Aprovado pela Coordenação
                      </p>
                      <div className={styles.itemMeta}>
                        <span><strong>Pontos:</strong> {item.pontos}</span>
                        <span><strong>Submetido:</strong> {item.data_submissao}</span>
                        {item.arquivo && (
                          <span>{getFileIcon(item.arquivo)} Arquivo anexado</span>
                        )}
                      </div>
                    </div>
                    <span className={styles.checkIcon}>✓</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // View: Detalhes do Item
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={handleVoltar} className={styles.backButton}>
          ← Voltar
        </button>
        <div className={styles.headerContent}>
          <span className={styles.headerIcon}>📋</span>
          <div>
            <h1 className={styles.headerTitle}>Formalização APO - Secretaria</h1>
            <p className={styles.headerSubtitle}>Processamento final e registro acadêmico oficial</p>
          </div>
        </div>
        <button onClick={handleLogout} className={styles.logoutButton}>Sair</button>
      </div>

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
        <div className={`${styles.fluxoStep} ${styles.completed}`}>
          <div className={styles.stepNumber}>3</div>
          <span className={styles.stepLabel}>Coordenação</span>
        </div>
        <div className={styles.fluxoArrow}>→</div>
        <div className={`${styles.fluxoStep} ${styles.active}`}>
          <div className={styles.stepNumber}>4</div>
          <span className={styles.stepLabel}>Secretaria</span>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.approvedBanner}>
          <span className={styles.bannerIcon}>✓</span>
          <div>
            <h2 className={styles.bannerTitle}>Item APO Aprovado - Pronto para Formalização</h2>
            <p className={styles.bannerText}>Todos os níveis de aprovação foram concluídos com sucesso</p>
          </div>
        </div>

        <div className={styles.itemBanner}>
          {selectedItem.aluno_nome} - {selectedItem.titulo} • {selectedItem.pontos} pontos
        </div>

        <div className={styles.mainGrid}>
          <div className={styles.processColumn}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>📋</span>
              <h3>Processo de Formalização</h3>
            </div>

            <div className={`${styles.processCard} ${styles.completed}`}>
              <div className={styles.processHeader}>
                <div className={styles.processTitle}>
                  <div className={styles.processNumber}>1</div>
                  <h4>Recolhimento da Coordenação</h4>
                </div>
                <span className={styles.statusBadge}>CONCLUÍDO</span>
              </div>
              <div className={styles.processContent}>
                <div className={styles.checkItem}>
                  <span className={styles.checkMark}>✓</span>
                  <span>Aprovado pela coordenação em {selectedItem.data_coordenacao || '16/09/2024'} às 10:45</span>
                </div>
                <div className={styles.checkItem}>
                  <span className={styles.checkMark}>✓</span>
                  <span>Documentação validada e confirmada como íntegra</span>
                </div>
                <div className={styles.checkItem}>
                  <span className={styles.checkMark}>✓</span>
                  <span>Processo está pronto para próxima etapa</span>
                </div>
              </div>
            </div>

            <div className={`${styles.processCard} ${styles.inProgress}`}>
              <div className={styles.processHeader}>
                <div className={styles.processTitle}>
                  <div className={styles.processNumber}>2</div>
                  <h4>Geração DocuSign</h4>
                </div>
                <span className={styles.statusBadge}>EM ANDAMENTO</span>
              </div>
              <div className={styles.processContent}>
                <div className={styles.alertBox}>
                  <p><strong>Documento gerado automaticamente pelo sistema</strong></p>
                  <div className={styles.alertItem}>
                    <span className={styles.alertIcon}>⚠️</span>
                    <span>Assinatura enviada para {assinaturas.length} signatários</span>
                  </div>
                  <div className={styles.alertItem}>
                    <span className={styles.alertIcon}>⏰</span>
                    <span>Aguardando {assinaturasPendentes} assinatura(s) pendente(s)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={`${styles.processCard} ${styles.pending}`}>
              <div className={styles.processHeader}>
                <div className={styles.processTitle}>
                  <div className={styles.processNumber}>3</div>
                  <h4>Upload Documento Assinado</h4>
                </div>
                <span className={styles.statusBadge}>AÇÃO NECESSÁRIA</span>
              </div>
              <div className={styles.processContent}>
                <div className={styles.uploadSection}>
                  <label className={styles.uploadLabel}>
                    Enviar arquivo assinado pelo DocuSign:
                  </label>
                  <input 
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setArquivoAssinado(e.target.files[0])}
                    className={styles.fileInput}
                  />
                  {arquivoAssinado && (
                    <p className={styles.fileName}>
                      Arquivo selecionado: {arquivoAssinado.name}
                    </p>
                  )}
                  <button 
                    onClick={handleUploadAssinado}
                    disabled={!arquivoAssinado || uploadProgress}
                    className={styles.uploadButton}
                  >
                    {uploadProgress ? 'Enviando...' : '📤 Enviar Arquivo Assinado'}
                  </button>
                </div>
              </div>
            </div>

            <div className={`${styles.processCard} ${styles.pending}`}>
              <div className={styles.processHeader}>
                <div className={styles.processTitle}>
                  <div className={styles.processNumber}>4</div>
                  <h4>Registro Acadêmico</h4>
                </div>
                <span className={styles.statusBadge}>PENDENTE</span>
              </div>
              <div className={styles.processContent}>
                <div className={styles.checkItem}>
                  <span className={styles.pendingMark}>⏰</span>
                  <span>Aguarda upload do documento assinado</span>
                </div>
                <div className={styles.checkItem}>
                  <span className={styles.pendingMark}>⏰</span>
                  <span>Lançamento no sistema acadêmico será automatizado</span>
                </div>
              </div>
            </div>

            <div className={`${styles.processCard} ${styles.pending}`}>
              <div className={styles.processHeader}>
                <div className={styles.processTitle}>
                  <div className={styles.processNumber}>5</div>
                  <h4>Arquivamento Digital</h4>
                </div>
                <span className={styles.statusBadge}>PENDENTE</span>
              </div>
              <div className={styles.processContent}>
                <div className={styles.checkItem}>
                  <span className={styles.pendingMark}>⏰</span>
                  <span>Processo digital será criado automaticamente</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.controlColumn}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>⚙️</span>
              <h3>Painel de Controle</h3>
            </div>

            <div className={styles.docusignCard}>
              <div className={styles.docusignHeader}>
                <span className={styles.docIcon}>📄</span>
                <div>
                  <h4>DocuSign Integration</h4>
                  <p>APO_2024_{selectedItem.aluno_nome.replace(/\s/g, '')}.pdf</p>
                </div>
              </div>

              <div className={styles.signaturesSection}>
                <div className={styles.signaturesTitle}>
                  <span className={styles.checkMark}>✓</span>
                  <span>Status das Assinaturas</span>
                </div>

                <div className={styles.signaturesList}>
                  {assinaturas.map((ass) => (
                    <div key={ass.id} className={`${styles.signatureItem} ${styles[ass.status]}`}>
                      <div className={styles.signatureHeader}>
                        <div className={styles.signatureName}>
                          <span className={styles.userIcon}>👤</span>
                          <span>{ass.nome}</span>
                        </div>
                        <span className={styles.signatureStatus}>
                          {ass.status === 'assinado' ? '✓ Assinado' : '⏳ Pendente'}
                        </span>
                      </div>
                      <p className={styles.signatureCargo}>{ass.cargo}</p>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={handleEnviarLembrete} className={styles.reminderButton}>
                📤 ENVIAR LEMBRETE
              </button>
            </div>

            <div className={styles.pointsCard}>
              <div className={styles.pointsNumber}>{selectedItem.pontos}</div>
              <div className={styles.pointsLabel}>Pontos APO Atribuídos</div>
              <div className={styles.pointsProgress}>Progresso: {selectedItem.pontos}/12 pontos</div>
            </div>

            <button onClick={handleDownloadDoc} className={styles.downloadButton}>
              ⬇️ BAIXAR DOCUMENTO ORIGINAL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}