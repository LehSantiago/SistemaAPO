# Plano de Testes – Submeter Item de APO

**Objetivo:** Testar o caso de uso "Submeter Item de APO" garantindo que todas as regras e validações sejam cumpridas.

---

# Cenário 1: Submissão bem-sucedida

**Preparação:**

* Aluno cadastrado com e-mail `11234567@mackenzista.com.br` e senha `Senha123!`.
* Arquivo a ser submetido: `relatorio_APO.pdf`.
* Todos os campos obrigatórios preenchidos.

**Pré-requisitos:**

* O aluno deve estar cadastrado no sistema.
* Todos os campos devem ser preenchidos corretamente.
* O aluno deve ter um arquivo a ser submetido.

**Script de Teste:**

1. O aluno acessa o sistema.
2. Digita o e-mail `11234567@mackenzista.com.br`.
3. Digita a senha `Senha123!`.
4. Clica em **Entrar**.
5. No menu, clica em **Submeter Item de APO**.
6. Preenche:
   - Título: `Relatório Final APO`
   - Descrição: `Relatório detalhado do projeto de pesquisa`
   - Disciplina: `Sistemas de Informação II`
   - Orientador: `Prof. Dr. João Silva`
7. Seleciona o arquivo `relatorio_APO.pdf`.
8. Clica em **Enviar**.


**Resultado Esperado:**  

* Mensagem: `Item de APO enviado com sucesso`.
* Item registrado no sistema com status `Submetido`.

---

## Cenário 2: Campos obrigatórios não preenchidos

**Preparação:**

* Aluno cadastrado com e-mail `17654321@mackenzista.com.br` e senha `Senha321!`.
* Tentativa de submissão sem preencher a disciplina.

**Pré-requisitos:**

* O aluno deve estar cadastrado no sistema.
* Todos os campos devem ser preenchidos corretamente.
* O aluno deve ter um arquivo a ser submetido.

**Script de Teste:**

1. Login com e-mail `17654321@mackenzista.com.br` e senha `Senha321!`.
2. Acessa **Submeter Item de APO**.
3. Preenche:
   - Título: `Resumo APO`
   - Descrição: `Resumo do projeto`
   - Disciplina: **deixa em branco**
   - Orientador: `Prof. Ana Souza`
4. Seleciona arquivo `resumo_APO.pdf`.
5. Clica em **Enviar**.

**Resultado Esperado:**  

* Mensagem: `Por favor, preencha todos os campos obrigatórios`.
* Item não registrado até que todos os campos estejam preenchidos.

---

## Cenário 3: Login inválido

**Preparação:**

* Tentativa de login com e-mail ou senha incorretos.

**Pré-requisitos:**

* O aluno deve estar cadastrado no sistema.
* Todos os campos devem ser preenchidos corretamente.
* O aluno deve ter um arquivo a ser submetido.

**Script de Teste:**

1. Digita e-mail `10000000@mackenzista.com.br`.
2. Digita senha `SenhaErrada!`.
3. Clica em **Entrar**.

**Resultado Esperado:**  

* Mensagem de erro: `E-mail ou senha incorretos`.
* Não é possível acessar o sistema.

---

## Cenário 4: Envio de arquivo inválido

**Preparação:**

* Aluno cadastrado `12345678@mackenzista.com.br` com senha `Senha456!`.
* Arquivo `arquivo.txt` (formato não permitido).

**Pré-requisitos:**

* O aluno deve estar cadastrado no sistema.
* Todos os campos devem ser preenchidos corretamente.
* O aluno deve ter um arquivo a ser submetido.

**Script de Teste:**

1. Login com e-mail `12345678@mackenzista.com.br` e senha `Senha456!`.
2. Acessa **Submeter Item de APO**.
3. Preenche todos os campos obrigatórios.
4. Seleciona arquivo `arquivo.txt`.
5. Clica em **Enviar**.

**Resultado Esperado:**  

* Mensagem: `Formato de arquivo não permitido. Envie PDF ou DOCX`.
* Item não registrado.

---

## Cenário 5: Campos excedendo limite de caracteres

**Preparação:**

* Limites de caracteres estabelecidos:
  - Título: 100 caracteres
  - Disciplina: 50 caracteres
  - Orientador: 50 caracteres
  - Descrição: 500 caracteres (maior limite)
* Aluno cadastrado `13456789@mackenzista.com.br` com senha `Senha789!`.
* Arquivo: `trabalho_APO.pdf`.

**Pré-requisitos:**

* O aluno deve estar cadastrado no sistema.
* Todos os campos devem ser preenchidos corretamente.
* O aluno deve ter um arquivo a ser submetido.


**Script de Teste:**

1. Login com e-mail `13456789@mackenzista.com.br` e senha `Senha789!`.
2. Acessa **Submeter Item de APO**.
3. Preenche:
   - Título com 101 caracteres: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum fermentum diam nec velit cursus`
   - Descrição com 501 caracteres: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. ... (continua até exceder 500 caracteres)`
   - Disciplina com 51 caracteres: `Sistemas de Informação II - Exemplo Extendido de Nome`
   - Orientador com 51 caracteres: `Prof. Dr. João Silva e Equipe de Orientação Completa`
4. Seleciona arquivo `trabalho_APO.pdf`.
5. Clica em **Enviar**.

**Resultado Esperado:**  

* Mensagem: `Um ou mais campos excedem o limite de caracteres permitido`.
* Submissão não concluída até corrigir todos os campos.

---

## Cenário 6: Submissão duplicada

**Preparação:**

* Aluno cadastrado `19876543@mackenzista.com.br` com senha `Senha987!`.
* Já enviou `projeto_APO.pdf` anteriormente.

**Pré-requisitos:**

* O aluno deve estar cadastrado no sistema.
* Todos os campos devem ser preenchidos corretamente.
* O aluno deve ter um arquivo a ser submetido.


**Script de Teste:**

1. Login com e-mail `19876543@mackenzista.com.br` e senha `Senha987!`.
2. Acessa **Submeter Item de APO**.
3. Preenche todos os campos obrigatórios com os mesmos dados do item anterior.
4. Seleciona arquivo `projeto_APO.pdf`.
5. Clica em **Enviar**.

**Resultado Esperado:**  

* Mensagem: `Este item já foi submetido anteriormente`.
* Sistema não permite duplicidade de submissão.

---

## Cenário 7: Submissão com conexão instável

**Preparação:**

* Aluno cadastrado `11223344@mackenzista.com.br` com senha `Senha1122!`.
* Conexão instável durante upload de arquivo `relatorio_APO.pdf`.

**Pré-requisitos:**

* O aluno deve estar cadastrado no sistema.
* Todos os campos devem ser preenchidos corretamente.
* O aluno deve ter um arquivo a ser submetido.

**Script de Teste:**

1. Login com e-mail `11223344@mackenzista.com.br` e senha `Senha1122!`.
2. Acessa **Submeter Item de APO**.
3. Preenche todos os campos obrigatórios.
4. Inicia upload do arquivo `relatorio_APO.pdf`.
5. Durante upload, a conexão é interrompida.

**Resultado Esperado:**  

* Mensagem: `Falha no envio. Tente novamente`.
* Sistema permite retomar ou reenviar o arquivo.

---

## Cenário 8: Tentativa de envio de múltiplos arquivos

**Preparação:**

* Aluno cadastrado `12349876@mackenzista.com.br` com senha `Senha4321!`.
* Apenas um arquivo é permitido por submissão.

**Pré-requisitos:**

* O aluno deve estar cadastrado no sistema.
* Todos os campos devem ser preenchidos corretamente.
* O aluno deve ter um arquivo a ser submetido.

**Script de Teste:**

1. Login com e-mail `12349876@mackenzista.com.br` e senha `Senha4321!`.
2. Acessa **Submeter Item de APO**.
3. Preenche todos os campos obrigatórios.
4. Tenta selecionar dois arquivos: `relatorio_APO.pdf` e `apendice_APO.pdf`.
5. Clica em **Enviar**.

**Resultado Esperado:**  

* Mensagem: `Apenas um arquivo pode ser enviado por submissão`.
* Submissão não é realizada até selecionar somente um arquivo.
