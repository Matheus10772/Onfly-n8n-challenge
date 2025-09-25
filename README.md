# Desafio Técnico Onfly: Conector n8n - True Random Number

Este repositório contém a solução para o desafio técnico da Onfly, que consiste na criação de um conector (node) customizado para o n8n. O node, chamado "Random", utiliza a API pública do Random.org para gerar um número inteiro verdadeiramente aleatório dentro de um intervalo definido pelo usuário.

## Critérios Atendidos

-   **Infraestrutura:** Configuração completa com Docker Compose, utilizando uma imagem oficial do n8n e um banco de dados PostgreSQL para persistência de dados.
-   **Desenvolvimento:** O conector foi desenvolvido em TypeScript, seguindo as melhores práticas e a documentação oficial do n8n para criação de nodes customizados.
-   **Funcionalidades:**
    -   Node chamado `Random`.
    -   Operação única: `True Random Number Generator`.
    -   Inputs `Min` e `Max` (inclusivos) para definir o intervalo.
    -   Utilização obrigatória do endpoint GET de `https://www.random.org/integers/`.
-   **Requisitos Não Funcionais:**
    -   Nomes e descrições amigáveis para o usuário.
    -   Ícone SVG customizado para fácil identificação do node.
    -   Código limpo, organizado e com tratamento de erros.

---

## Pré-requisitos

Antes de começar, garanta que você tenha os seguintes softwares instalados em sua máquina:

-   [Node.js](https://nodejs.org/) v22 (LTS) ou superior
-   [npm](https://www.npmjs.com/) (geralmente instalado com o Node.js)
-   [Docker](https://www.docker.com/products/docker-desktop/)
-   [Docker Compose](https://docs.docker.com/compose/install/)

---

## Guia de Instalação e Execução

Siga os passos abaixo para configurar o ambiente n8n, instalar o conector customizado e testar a solução.

### 1. Clonar o Repositório

```bash
git clone https://github.com/Matheus10772/Onfly-n8n-challenge.git
cd onfly-n8n-challenge
```

### 2. Subir a Infraestrutura n8n

A infraestrutura do n8n, com o banco de dados PostgreSQL, é gerenciada pelo Docker Compose.

```bash
# Navegue até a pasta da infraestrutura
cd n8n-infra

# Inicie os containers em background
docker-compose up -d
```

Após alguns instantes, o n8n estará rodando e acessível em `http://localhost:5678`.

### 3. Instalar e Ativar o Conector Customizado

Para que o n8n reconheça nosso conector, precisamos compilá-lo e linká-lo na pasta de desenvolvimento do n8n.

**3.1. Crie a pasta de conectores customizados (se não existir):**

```bash
mkdir -p ~/.n8n/custom
```

**3.2. Compile e link o pacote do conector:**

```bash
# Navegue até a pasta do código do node
cd ../n8n-nodes-random

# Instale as dependências
npm install

# Compile o código TypeScript para JavaScript
npm run build

# Crie um link simbólico global para este pacote
npm link
```

**3.3. Faça o n8n "enxergar" o conector:**

```bash
# Navegue até a pasta de conectores customizados do n8n
cd ~/.n8n/custom

# Link o pacote que acabamos de disponibilizar globalmente
npm link n8nrandom
```

### 4. Reinicie o n8n e Teste

O n8n precisa ser reiniciado para carregar os novos conectores.

```bash
# Estando na pasta n8n-infra
docker-compose restart n8n
```

Agora, acesse `http://localhost:5678`, crie um novo workflow e procure pelo node **"Random"**. Adicione-o ao seu canvas, configure os valores de `Min` e `Max` e execute para ver o resultado!

---

## Estrutura do Projeto

```
.
├── n8n-infra/              # Contém a configuração do Docker para o n8n
│   └── docker-compose.yml
├── n8nnoderandom/       # Projeto do conector customizado
│   ├── nodes/
│   │   └── Random/
│   │       ├── Random.node.ts  # Lógica principal e definição do node
│   │       └── random.svg      # Ícone do node
│   └── ...
└── README.md               # Este guia de instalação e uso
```
