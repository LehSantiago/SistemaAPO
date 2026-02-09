# Manual do Usuário - Sistema APO

## 1. Introdução

Bem-vindo ao Sistema APO (Atividades Práticas Orientadas)! Este manual descreve como utilizar todas as funcionalidades do sistema de acordo com seu perfil de usuário.

### 1.1 O que é o Sistema APO?

O Sistema APO é uma plataforma web que gerencia o fluxo completo de aprovação de atividades complementares em instituições de ensino superior, desde a submissão pelo aluno até o registro acadêmico final.

### 1.2 Perfis de Usuário

O sistema possui 5 perfis distintos:

- **Aluno:** Submete atividades e acompanha aprovações
- **Orientador:** Avalia e atribui pontuação
- **Comissão APO:** Valida conformidade técnica
- **Coordenação:** Aprova executivamente
- **Secretaria:** Formaliza e registra academicamente

---

## 2. Acesso ao Sistema

### 2.1 URL de Acesso

Acesse o sistema através do navegador em: **http://localhost:3000**.

### 2.2 Navegadores Compatíveis

- Google Chrome 90+
- Mozilla Firefox 88+
- Microsoft Edge 90+
- Safari 14+

### 2.3 Tela Inicial

Na página inicial, você verá botões de acesso para cada perfil:

- Login Aluno
- Login Orientador
- Login Comissão
- Login Coordenação
- Login Secretaria

---

## 3. Perfil: Aluno

### 3.1 Como Fazer Login

1. Na página inicial, clique em **"Login Aluno"**
2. Insira seu e-mail institucional
3. Insira sua senha
4. Clique em **"Entrar"**

**Credenciais de teste:**
- E-mail: `aluno@teste.com`
- Senha: `123456`

### 3.2 Dashboard do Aluno

Após o login, você verá:

#### Estatísticas
- **Pontos Atuais:** Quantos pontos você já conquistou
- **Meta de Pontos:** Total necessário (geralmente 12 pontos)
- **Pendentes:** Atividades aguardando avaliação
- **Aprovados:** Atividades já aprovadas

#### Barra de Progresso
Mostra visualmente seu progresso em direção aos 12 pontos necessários.

### 3.3 Submeter Nova Atividade

#### Passo 1: Acessar Formulário
1. Clique no botão **"Submeter Nova Atividade"**

#### Passo 2: Preencher Informações

**Tipo de Atividade** (obrigatório):
- Workshop/Curso
- Monitoria
- Pesquisa
- Extensão
- Evento Acadêmico

**Título** (obrigatório):
- Exemplo: "Workshop de React Native"
- Máximo 100 caracteres

**Descrição** (obrigatório):
- Descreva a atividade realizada
- Inclua carga horária, período, objetivos
- Mínimo 50 caracteres

**Comprovante** (opcional):
- Formatos aceitos: PDF, JPG, PNG, DOCX
- Tamanho máximo: 16 MB
- Exemplos: certificado, declaração, fotos

#### Passo 3: Enviar

1. Clique em **"Submeter Atividade"**
2. Aguarde confirmação: "Atividade submetida com sucesso!"
3. O item aparecerá na lista com status "Pendente - Orientador"

### 3.4 Acompanhar Status das Atividades

Cada atividade possui um card com:

- **Título:** Nome da atividade
- **Tipo:** Badge colorido (workshop, monitoria, etc.)
- **Status:** Situação atual no fluxo
- **Pontos:** Pontuação atribuída (quando aprovado)
- **Data:** Quando foi submetida

#### Estados Possíveis

| Status | Significado |
|--------|-------------|
| 🟡 Pendente - Orientador | Aguardando avaliação do orientador |
| 🟡 Pendente - Comissão | Orientador aprovou, aguarda comissão |
| 🟡 Pendente - Coordenação | Comissão validou, aguarda coordenação |
| 🟡 Aguardando Formalização | Aguarda assinatura e registro |
| 🟢 Aprovado Final | Atividade totalmente aprovada |
| 🔴 Devolvido | Precisa correção |

### 3.5 Ver Detalhes da Atividade

1. Clique no card da atividade
2. Um modal abrirá mostrando:
   - Todas as informações da atividade
   - Comentários do orientador/comissão/coordenação
   - Histórico de aprovações
   - Link para download do comprovante

### 3.6 Download de Comprovantes

1. No modal de detalhes, clique em **"Baixar Comprovante"**
2. O arquivo será baixado automaticamente
3. Documentos assinados também podem ser baixados

### 3.7 Atividades Devolvidas

Se uma atividade for devolvida:

1. O card ficará vermelho com status "Devolvido"
2. Aparecerá um comentário explicando o motivo
3. Você pode:
   - Corrigir a descrição
   - Enviar novo comprovante
   - Resubmeter a atividade

**Como Resubmeter:**
1. Clique em **"Editar Atividade"**
2. Faça as correções necessárias
3. Clique em **"Resubmeter"**

### 3.8 Notificações

O sistema envia notificações automáticas por e-mail quando:
- Atividade é aprovada
- Atividade é devolvida
- Pontos são atualizados
- Formalização é concluída

### 3.9 Sair do Sistema

1. Clique em seu nome no canto superior direito
2. Clique em **"Sair"**

---

## 4. Perfil: Orientador

### 4.1 Como Fazer Login

1. Na página inicial, clique em **"Login Orientador"**
2. Insira e-mail e senha
3. Clique em **"Entrar"**

**Credenciais de teste:**
- E-mail: `orientador@teste.com`
- Senha: `123456`

### 4.2 Dashboard do Orientador

O dashboard mostra:

- **Total de Itens Pendentes:** Atividades aguardando sua avaliação
- **Alerta de Urgência:** Itens há mais de 5 dias sem avaliação
- **Lista de Atividades:** Todas as submissões pendentes

### 4.3 Visualizar Atividades Pendentes

Cada card exibe:
- Nome do aluno
- Matrícula
- Tipo de atividade
- Título
- Data de submissão
- Tempo decorrido (ex: "há 2 dias")

### 4.4 Avaliar Atividade

#### Passo 1: Selecionar Atividade
1. Clique no card da atividade desejada
2. Um modal de avaliação abrirá

#### Passo 2: Analisar Informações
O modal mostra:
- Dados do aluno
- Descrição completa da atividade
- Link para visualizar/baixar comprovante

#### Passo 3: Visualizar Comprovante
1. Clique em **"Visualizar Arquivo"**
2. O documento abrirá em nova aba
3. Analise se o comprovante é válido

#### Passo 4: Atribuir Pontuação

Use o **slider de pontos**:
- Arraste para definir pontuação de 0 a 5
- 0 pontos: Não atende critérios
- 1-2 pontos: Atende parcialmente
- 3 pontos: Atende adequadamente
- 4 pontos: Atende plenamente
- 5 pontos: Excelente, excepcional

**Critérios de Pontuação:**
- Relevância da atividade
- Carga horária
- Qualidade do comprovante
- Alinhamento com objetivos APO

#### Passo 5: Tomar Decisão

**Opção A: Aprovar**
1. Defina os pontos (1-5)
2. Adicione comentário opcional (recomendado)
3. Clique em **"Aprovar e Encaminhar"**
4. Item vai para a Comissão

**Opção B: Devolver**
1. Clique em **"Devolver ao Aluno"**
2. Adicione comentário obrigatório explicando o motivo
3. Exemplos de motivos:
   - "Comprovante ilegível, envie documento em melhor qualidade"
   - "Faltam informações sobre carga horária"
   - "Atividade não se enquadra nos critérios APO"
4. Clique em **"Confirmar Devolução"**
5. Item retorna ao aluno

### 4.5 Histórico de Avaliações

Para ver atividades já avaliadas:
1. Clique em **"Ver Histórico"** (se disponível)
2. Filtre por status: "Aprovados" ou "Devolvidos"

### 4.6 Boas Práticas

- Avalie em até 3 dias úteis
- Sempre justifique devoluções
- Seja objetivo nos comentários
- Verifique autenticidade dos comprovantes
- Utilize os critérios de pontuação estabelecidos

---

## 5. Perfil: Comissão APO

### 5.1 Como Fazer Login

1. Na página inicial, clique em **"Login Comissão"**
2. Insira e-mail e senha
3. Clique em **"Entrar"**

**Credenciais de teste:**
- E-mail: `comissao@teste.com`
- Senha: `123456`

### 5.2 Dashboard da Comissão

O dashboard exibe:

- **Itens Aprovados pelo Orientador:** Lista de atividades para validação
- **Alerta de Prioridade:** Itens há mais de 3 dias aguardando
- **Fluxo de Aprovação:** Visualização do estágio atual

### 5.3 Fluxo de Validação

A comissão é responsável por:
- Verificar conformidade com normas APO
- Validar documentação técnica
- Garantir que critérios regulamentares foram atendidos

### 5.4 Validar Atividade

#### Passo 1: Selecionar Item
1. Clique no card da atividade
2. Modal de validação abrirá

#### Passo 2: Revisar Avaliação do Orientador

Você verá:
- Comentário do orientador
- Pontuação atribuída
- Data da aprovação
- Dados completos da atividade

#### Passo 3: Análise Técnica

**Checklist de Validação:**
- Atividade se enquadra nas categorias APO?
- Carga horária está documentada?
- Comprovante é oficial/válido?
- Pontuação está coerente?
- Atende normas da instituição?

#### Passo 4: Emitir Parecer

**Opção A: Validar**
1. Clique em **"Validar e Encaminhar"**
2. Adicione parecer técnico (obrigatório)
3. Exemplo: "Documentação conforme Resolução APO 01/2024. Atividade validada."
4. Item vai para Coordenação

**Opção B: Devolver ao Orientador**
1. Clique em **"Devolver ao Orientador"**
2. Explique o problema identificado (obrigatório)
3. Exemplos:
   - "Pontuação acima do permitido para este tipo de atividade"
   - "Necessário verificar autenticidade do documento"
   - "Atividade não se enquadra na categoria selecionada"
4. Item retorna ao orientador para reavaliação

### 5.5 Relatórios

Para gerar relatórios:
1. Clique em **"Relatórios"**
2. Selecione período
3. Visualize estatísticas de validação

---

## 6. Perfil: Coordenação

### 6.1 Como Fazer Login

1. Na página inicial, clique em **"Login Coordenação"**
2. Insira e-mail e senha
3. Clique em **"Entrar"**

**Credenciais de teste:**
- E-mail: `coordenacao@teste.com`
- Senha: `123456`

### 6.2 Dashboard da Coordenação

O dashboard apresenta:

- **Itens Validados pela Comissão:** Atividades aguardando aprovação final
- **Visão Executiva:** Resumo de aprovações pendentes
- **Histórico Completo:** Todo o fluxo de cada atividade

### 6.3 Aprovar Finalmente

#### Passo 1: Selecionar Atividade
1. Clique no card desejado
2. Modal de aprovação final abrirá

#### Passo 2: Revisar Histórico Completo

Você terá acesso a:
- Avaliação do orientador
- Parecer da comissão
- Todas as datas de aprovação
- Pontuação final
- Documentos anexados

#### Passo 3: Decisão Executiva

**Opção A: Aprovar Finalmente**
1. Revise todos os dados
2. Clique em **"Aprovar Finalmente"**
3. Adicione observação opcional
4. Item vai para Secretaria (formalização)

**Opção B: Devolver à Comissão**
1. Clique em **"Devolver à Comissão"**
2. Explique o motivo (obrigatório)
3. Exemplos:
   - "Necessário parecer mais detalhado"
   - "Verificar inconsistência na pontuação"
4. Item retorna à comissão

### 6.4 Visualização de Documentos

1. Clique em **"Ver Documento"**
2. Visualize/baixe o comprovante
3. Confira autenticidade se necessário

### 6.5 Gestão de Prazos

- Itens com mais de 3 dias aparecem com alerta
- Priorize avaliações urgentes

---

## 7. Perfil: Secretaria

### 7.1 Como Fazer Login

1. Na página inicial, clique em **"Login Secretaria"**
2. Insira e-mail e senha
3. Clique em **"Entrar"**

**Credenciais de teste:**
- E-mail: `secretaria@teste.com`
- Senha: `123456`

### 7.2 Dashboard da Secretaria

O dashboard contém:

- **Aguardando Formalização:** Itens aprovados pela coordenação
- **Gestão de Assinaturas:** Status das assinaturas DocuSign
- **Consulta por Aluno:** Buscar arquivos por matrícula
- **Registro Acadêmico:** Formalização final

### 7.3 Processo de Formalização

O processo completo envolve:

1. **Envio para DocuSign** (simulado)
2. **Coleta de assinaturas**
3. **Upload do documento assinado**
4. **Registro acadêmico automático**

### 7.4 Enviar para Assinatura (DocuSign)

#### Passo 1: Selecionar Item
1. Clique em **"Enviar para Assinatura"** no card do item

#### Passo 2: Confirmar Signatários

O sistema mostra:
- Aluno
- Orientador
- Coordenador

#### Passo 3: Simular Envio

1. Clique em **"Enviar para DocuSign"**
2. Sistema simula criação do envelope
3. Status muda para "Aguardando Assinaturas"

**Nota:** Em produção, integração real com DocuSign API será utilizada.

### 7.5 Gerenciar Assinaturas

#### Ver Status de Assinaturas
1. Clique em **"Ver Assinaturas"** no item
2. Um modal mostra:
   - Lista de signatários
   - Status de cada um (pendente/assinado)
   - Data de assinatura (quando aplicável)

#### Enviar Lembretes
1. Para assinaturas pendentes, clique em **"Enviar Lembrete"**
2. Sistema envia notificação automática
3. Confirmação: "Lembrete enviado com sucesso"

### 7.6 Upload de Documento Assinado

#### Quando Todas as Assinaturas Forem Coletadas

1. Clique em **"Upload Documento Assinado"**
2. Selecione o arquivo PDF assinado do seu computador
3. Clique em **"Enviar"**

#### O Sistema Automaticamente:
- Salva o documento assinado
- Atualiza os pontos do aluno
- Registra no histórico acadêmico
- Muda status para "Aprovado Final"
- Envia notificação ao aluno

### 7.7 Consultar Arquivos por Aluno

#### Buscar por Matrícula

1. Na seção **"Consulta de Arquivos"**
2. Digite a matrícula do aluno
3. Clique em **"Buscar"**

#### Resultado da Busca

Sistema exibe todos os arquivos do aluno:

**Para cada atividade:**
- Título
- Tipo
- Pontos
- Status
- Link para comprovante original
- Link para documento assinado (se disponível)

#### Download de Arquivos

1. Clique em **"Baixar Original"** ou **"Baixar Assinado"**
2. Arquivo abre em nova aba ou é baixado

### 7.8 Visualização de Documentos

#### Ver Comprovante Original
- Clique em **"Ver Arquivo"**
- Visualize o documento enviado pelo aluno

#### Ver Documento Assinado
- Clique em **"Ver Assinado"**
- Visualize o documento com todas as assinaturas

### 7.9 Relatórios da Secretaria

#### Gerar Relatório de Pontos

1. Clique em **"Relatórios"**
2. Selecione:
   - Período
   - Curso/turma
   - Status desejado
3. Clique em **"Gerar Relatório"**
4. Exporte em PDF ou Excel

#### Relatório de Pendências

- Lista alunos com documentos aguardando assinatura
- Mostra há quanto tempo está pendente
- Permite envio de lembretes em lote

---

## 8. Funcionalidades Comuns a Todos os Perfis

### 8.1 Alteração de Senha

1. Clique em seu nome no topo da página
2. Selecione **"Alterar Senha"**
3. Digite senha atual
4. Digite nova senha
5. Confirme nova senha
6. Clique em **"Salvar"**

### 8.2 Notificações

#### Ver Notificações
- Ícone 🔔 no canto superior direito
- Número vermelho indica notificações não lidas
- Clique para expandir lista

#### Tipos de Notificações
- Aprovações
- Devoluções
- Novas submissões (staff)
- Lembretes de prazo
- Documentos assinados

### 8.3 Suporte/Ajuda

1. Clique em **"Ajuda"** (rodapé)
2. Acesse:
   - FAQ
   - Tutorial em vídeo
   - Manual completo (este documento)
   - Contato do suporte

---

## 9. Dicas e Boas Práticas

### Para Alunos
- Submeta atividades assim que concluí-las
- Use comprovantes claros e legíveis
- Preencha descrições detalhadas
- Acompanhe o status regularmente
- Corrija rapidamente atividades devolvidas
- Mantenha cópias dos seus comprovantes

### Para Orientadores
- Avalie em até 3 dias úteis
- Seja claro nas justificativas
- Utilize critérios consistentes de pontuação
- Verifique autenticidade dos documentos
- Priorize itens mais antigos

### Para Comissão
- Verifique conformidade regulamentar
- Documente pareceres técnicos
- Seja objetivo nas devoluções
- Mantenha registro de decisões
- Atualize normas periodicamente

### Para Coordenação
- Revise todo o histórico antes de aprovar
- Mantenha visão estratégica do processo
- Identifique padrões de problemas
- Garanta qualidade das aprovações
- Priorize itens urgentes

### Para Secretaria
- Organize documentos sistematicamente
- Acompanhe status de assinaturas
- Envie lembretes proativamente
- Mantenha arquivos organizados
- Faça backup regular dos documentos

---

## 10. Resolução de Problemas

### 10.1 Não Consigo Fazer Login

**Possíveis Causas:**
- Senha incorreta
- E-mail incorreto
- Perfil errado selecionado

**Soluções:**
1. Verifique se está usando o login correto para seu perfil
2. Confirme se o e-mail está correto
3. Tente redefinir a senha
4. Entre em contato com o suporte

### 10.2 Upload de Arquivo Falha

**Possíveis Causas:**
- Arquivo muito grande (> 16 MB)
- Formato não suportado
- Conexão instável

**Soluções:**
1. Reduza o tamanho do arquivo
2. Converta para PDF
3. Verifique sua conexão
4. Tente novamente

### 10.3 Não Vejo Minha Atividade

**Possíveis Causas:**
- Filtro ativo
- Status diferente do esperado
- Erro no carregamento

**Soluções:**
1. Recarregue a página (F5)
2. Verifique filtros aplicados
3. Limpe o cache do navegador
4. Faça logout e login novamente

### 10.4 Documento Não Abre

**Possíveis Causas:**
- Arquivo corrompido
- Bloqueador de pop-ups ativo
- Problema no servidor

**Soluções:**
1. Desabilite bloqueador de pop-ups
2. Tente em outro navegador
3. Baixe o arquivo ao invés de visualizar
4. Entre em contato com o suporte

---

## 11. FAQ

### Geral

**P: Preciso instalar algum programa?**
R: Não, o sistema funciona totalmente no navegador.

**P: Posso acessar de dispositivos móveis?**
R: Sim, o sistema é responsivo e funciona em smartphones e tablets.

**P: Minhas informações estão seguras?**
R: Sim, o sistema utiliza protocolos de segurança modernos.

### Para Alunos

**P: Quantos pontos preciso para completar APO?**
R: Geralmente 12 pontos, mas confirme com sua instituição.

**P: Posso submeter a mesma atividade duas vezes?**
R: Não, cada atividade deve ser única e diferente.

**P: Quanto tempo leva para minha atividade ser aprovada?**
R: O processo completo geralmente leva de 7 a 15 dias úteis.

**P: Posso editar uma atividade já submetida?**
R: Somente se ela for devolvida. Atividades em avaliação não podem ser editadas.

### Para Staff

**P: Posso avaliar atividades de qualquer aluno?**
R: Sim, se estiverem pendentes na sua etapa do fluxo.

**P: Como faço se identificar um documento falso?**
R: Entre em contato com a instituição emissora ou com a coordenação.

**P: Posso delegar minhas atividades?**
R: Depende das políticas da sua instituição. Consulte a coordenação.

---

## 12. Glossário

| Termo | Definição |
|-------|-----------|
| **APO** | Atividades Práticas Orientadas |
| **Comprovante** | Documento que prova realização da atividade |
| **Dashboard** | Painel principal do usuário |
| **DocuSign** | Plataforma de assinatura digital |
| **Formalização** | Processo final de registro acadêmico |
| **Item** | Cada atividade submetida no sistema |
| **Modal** | Janela sobreposta com informações detalhadas |
| **Status** | Situação atual da atividade no fluxo |
| **Upload** | Envio de arquivo para o sistema |

---

## 13. Política de Privacidade

### 13.1 Dados Coletados
- Informações pessoais (nome, e-mail, matrícula)
- Documentos enviados
- Histórico de atividades
- Logs de acesso

### 13.2 Uso dos Dados
- Gerenciamento de atividades APO
- Comunicação sobre o processo
- Relatórios institucionais
- Melhorias no sistema

### 13.3 Segurança
- Dados criptografados
- Acesso restrito por perfil
- Backup regular
- Conformidade com LGPD

---

**Sistema APO - Versão 1.0**
*Última atualização: Novembro/2025*
