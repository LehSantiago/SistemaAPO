# 🎓 Sistema APO  

<div align="center">

**Sistema Full Stack para Automatização de Processos Acadêmicos**

[Demo](#-demonstração) • [Funcionalidades](#-funcionalidades) • [Tecnologias](#-tecnologias) • [Documentação](#-documentação)

</div>

---

## 📋 Sobre o Projeto

O **Sistema APO (Atividades Práticas Orientadas)** é uma solução completa de automação para gestão de atividades complementares acadêmicas. Desenvolvido para resolver um problema real enfrentado por instituições de ensino, o sistema digitaliza todo o fluxo de aprovação, tornando-o mais ágil, transparente e auditável.

### 🎯 O Problema

Instituições de ensino enfrentam desafios significativos no processo de aprovação de atividades complementares:

- 📄 **Burocracia manual** - Documentos físicos e formulários em papel
- ⏳ **Processos lentos** - Aprovações que levam semanas ou meses
- ❌ **Falta de transparência** - Alunos sem visibilidade do status
- 🔄 **Retrabalho constante** - Informações duplicadas entre setores
- 📊 **Dificuldade de auditoria** - Histórico fragmentado e difícil de rastrear

### 💡 A Solução

Sistema web completo que automatiza **100%** do fluxo acadêmico com:

✅ **Processo totalmente digital**  
✅ **Rastreabilidade em tempo real**  
✅ **Notificações automáticas**  
✅ **Dashboards personalizados por perfil**  
✅ **Controle de acesso granular**  
✅ **Auditoria completa de todas as ações**

---

## 🔄 Fluxo de Trabalho

```
┌─────────────┐
│   ALUNO     │ Submete atividade com documentação
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ ORIENTADOR  │ Avalia e emite parecer técnico
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  COMISSÃO   │ Valida conformidade acadêmica
└──────┬──────┘
       │
       ▼
┌─────────────┐
│COORDENAÇÃO  │ Aprova ou rejeita solicitação
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ SECRETARIA  │ Formaliza e encerra processo
└─────────────┘
```

Cada transição é registrada, auditável e notificada automaticamente.

---

## ✨ Funcionalidades

### 🔐 Controle de Acesso
- Sistema de autenticação robusto
- 5 perfis distintos de usuário
- Permissões granulares por rota e ação
- Proteção de rotas no frontend e backend

### 📊 Dashboards Inteligentes
- Visualizações customizadas por perfil
- Métricas em tempo real
- Filtros avançados
- Histórico completo de atividades

### 📎 Gestão de Documentos
- Upload de arquivos PDF
- Validação automática de formatos
- Armazenamento organizado
- Preview de documentos

### 🔔 Sistema de Notificações
- Alertas automáticos por mudança de status
- Notificações por e-mail (planejado)
- Centro de notificações no dashboard

### 🔍 Rastreabilidade Total
- Log de todas as ações
- Histórico de aprovações
- Auditoria completa do fluxo
- Exportação de relatórios

### ✍️ Assinatura Digital
- Validação de pareceres
- Registro de aprovadores
- Timestamping de ações

---

## 👥 Perfis de Usuário

| Perfil | Responsabilidades | Principais Ações |
|--------|-------------------|------------------|
| **👨‍🎓 Aluno** | Submissão de atividades | Criar solicitação, Upload de documentos, Acompanhar status |
| **👨‍🏫 Orientador** | Avaliação técnica | Analisar atividade, Emitir parecer, Aprovar/Reprovar |
| **👥 Comissão** | Validação acadêmica | Verificar conformidade, Validar documentação |
| **👔 Coordenação** | Decisão final | Aprovação executiva, Análise estratégica |
| **📋 Secretaria** | Formalização | Registro oficial, Encerramento de processo |

---

## 🛠️ Tecnologias

### Frontend
```
Next.js 14      │ Framework React de última geração
React 18        │ Biblioteca UI com hooks modernos
TypeScript      │ Tipagem estática (planejado)
Tailwind CSS    │ Estilização utilitária
Shadcn/UI       │ Componentes acessíveis
```

### Backend
```
Python 3.8+     │ Linguagem principal
Flask           │ Framework web minimalista
Flask-CORS      │ Gerenciamento de CORS
Pandas          │ Manipulação de dados
```
