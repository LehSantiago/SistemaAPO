 **Descrição dos Casos de Uso**
---

**Submeter Item de APO**

**Ator Principal:** Aluno.  
**Atores Secundários:** Orientador e Sistema.

**Objetivo:** Permitir que o aluno submeta um item de APO para avaliação
inicial pelo orientador.

**Fluxo Normal:**

1.  O aluno acessa o sistema e se autentifica.

2.  O aluno preenche as informações do item de APO e envia o arquivo.

3.  O aluno encaminha o item ao orientador.

4.  O sistema confirma o envio e registra a submissão.

**Extensões:**

> 2a. Se o aluno não preencher todos os campos obrigatórios, o sistema
> solicita correção antes do envio.

---

**Avaliar Item de APO**

**Ator Principal:** Orientador.  
**Atores Secundários:** Aluno e Sistema.

**Objetivo:** O orientador avalia o item de APO submetido pelo aluno.

**Fluxo Normal:**

1.  O orientador acessa o sistema e se autentifica.

2.  O orientador analisa o item de APO recebido.

3.  O orientador decide pela aprovação ou devolução ao aluno.

4.  Se aprovado, o orientador encaminha à comissão.

**Extensões:**

> 2a. O sistema manda um e-mail de aviso se o Orientador demorar tempo
> demais para avaliar.
>
> 3a. Se devolvido, o orientador registra justificativa, e o sistema
> notifica o aluno.  
> 4a. Se aprovado, mas houver inconsistências formais, o sistema
> notifica a comissão para revisão.

---

**Avaliar Item de APO**

**Ator Principal:** Comissão.  
**Atores Secundários:** Orientador, Coordenação e Sistema.

**Objetivo:** Permitir que a comissão analise o item aprovado pelo
orientador.

**Fluxo Normal:**

1.  A comissão acessa o sistema.

2.  A comissão avalia o item de APO.

3.  Caso aprove, encaminha o item para coordenação.

**Extensões:**

> 2a. O sistema manda um e-mail de aviso se a Comissão demorar tempo
> demais para avaliar.
>
> 2b. Se reprovado, devolve para o orientador com justificativa.

---

**Avaliar Item de APO**

**Ator Principal:** Coordenação.  
**Atores Secundários:** Comissão e Sistema.

**Objetivo:** Validar e aprovar os itens avaliados pela comissão.

**Fluxo Normal:**

1.  A coordenação acessa o sistema.

2.  Avalia o item APO.

3.  Caso aprove, encaminha para secretaria.

**Extensões:**

> 2a. O sistema manda um e-mail de aviso se a Coordenação demorar tempo
> demais para avaliar.
> 2b. Se reprovado, devolve para a comissão com justificativa.

---

**Formalizar Aprovação**

**Ator Principal:** Secretaria.  
**Atores Secundários:** Coordenação, Orientador, Aluno e Sistema.

**Objetivo:** Formalizar e registrar a aprovação final do item APO.

**Fluxo Normal:**

1.  A secretaria recebe o item aprovado da coordenação.

2.  O sistema gera um documento no DocuSign, assinado por coordenador,
    orientador e aluno.

3.  O sistema lança o registro no sistema acadêmico, somente quando
    atingir 12 pontos.

4.  O sistema arquiva o item aprovado.
