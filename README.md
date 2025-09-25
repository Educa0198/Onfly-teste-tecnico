
# n8n Custom Random Node & Docker Setup

## Descrição 

Este repositório contém:

Um node customizado para o n8n (Random), que consome o endpoint de inteiros do Random.org.

Um ambiente Docker Compose completo (n8n + PostgreSQL) para desenvolvimento, build e testes.

O projeto foi desenvolvido para o Desafio Técnico da Onfly. Ele permite que você execute todo o ambiente e o build do node customizado sem precisar instalar Node.js ou Jest localmente, embora os comandos para o desenvolvimento local também estejam inclusos.
## 🚀 Sumário
 - Pré‑requisitos

 - 🗺️ Estrutura de Pastas

 - 🔧 Configuração e Instalação (Docker)

 - ⚙️ Ciclo de Desenvolvimento e Testes

 - ✅ Validação na UI

 - 📚 Referências 

 - ⚠️ Troubleshooting

 - Comandos Úteis


## Pré-Requisitos
    Docker e Docker Compose instalados.

    Porta 5678 livre na máquina local.

## 🗺️ Estrutura de Pastas

O ambiente é configurado com três serviços interconectados para isolar a aplicação, o banco de dados e o build do node customizado.                             
O n8n-nodes-Random/ é o projeto do node customizado. O resultado da compilação (dist/) é montado no container do n8n para que o nó seja carregado.

```

.
├─ n8n-docker/                              # Arquivos para a infra Docker
│  ├─ docker-compose.yml                    # Definição dos serviços (n8n, Postgres, builder)
│  ├─  .env.example                         # Exemplo de variáveis de ambiente
|  ├─ n8n-storage/                          # Armazenamento interno do container
│     └─  custom/                           # Copia do node customizado no container
|
├─ n8n-nodes-Random/                        # Projeto do node customizado
│  ├─ Dockerfile                            # Instruções para o Docker buildar o container
│  ├─ jest.config.js                        # Configuração do jest para realização dos testes
│  ├─ dist/                                 # Saída do build (montada no container)
│  ├─ package.json
│  ├─ tsconfig.json
│  └─ nodes/
│     └─ Random/
│        ├─ RandomNumber.node.json          # Configuração do node
│        ├─ RandomNumber.node.test.ts       # Testes unitários
│        ├─ RandomNumber.node.ts            # Implementação do node
│        └─ RandomNumber.svg                # Ícone do node
└─ README.md                                # Documentação do projeto

```

## 🔧 Configuração e Instalação (Docker)
### 1️⃣ Clonar o repositório
```
git clone https://github.com/Educa0198/n8n-nodes-random-number-generator.git
cd n8n-nodes-random-number-generator/n8n-docker
```
### 2️⃣ Configurar Variáveis de Ambiente

Crie o arquivo .env a partir do exemplo e ajuste as credenciais do Postgres e do n8n (o padrão já é funcional):


`cp .env.example .env`

Conteúdo de .env (exemplo):

```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=n8n

POSTGRES_NON_ROOT_USER=n8n
POSTGRES_NON_ROOT_PASSWORD=n8n
```

### 3️⃣ Subir Containers e Rodar o Build
Este comando realiza todo o setup inicial:

`sudo docker compose up -d --build`

Build do node customizado (node_builder).

Roda os testes unitários do node.

Sobe o PostgreSQL.

Inicia o n8n e monta o nó customizado.


Após a execução, a UI do n8n estará acessível em http://localhost:5678.

Observação: O node customizado fica disponível no n8n pois o Docker monta o diretório ./n8n-nodes-Random/dist como /home/node/.n8n/custom dentro do container do n8n.

## ⚙️ Ciclo de Desenvolvimento e Testes
Execução de Testes
Os testes garantem a integridade do nó (intervalo min/max, tratamento de erros, formato de resposta).

Para rodar os testes manualmente (sem reiniciar a infra completa):

Bash

### Executa o Jest dentro do container 'node_builder'

`sudo docker compose run --rm node_builder npm test`


### Desenvolvimento Local (Hot Reload Simples)
Se você modificar o código do node (.ts), siga estes passos:

Acesse a pasta do projeto do node:

```
cd ../n8n-nodes-Random
npm run dev
```

Reinicie o serviço n8n para recarregar o nó customizado a partir do novo dist/:

```
cd ../n8n-docker
sudo docker compose restart n8n
```



Volte à UI e teste o nó atualizado.



## Validar na UI do n8n
```

Abra http://localhost:5678

Crie um workflow e adicione o node Random

Operation: True Random Number Generator

Informe Min e Max (inteiros)

Execute e confira a saída

```

## Referências 

- https://docs.docker.com/

- https://docs.n8n.io/

- https://nodejs.org/docs/latest/api/

- https://www.random.org/clients/http/


## ⚠️ Troubleshooting

| Problema | Solução | Comando para Ajuda |
|----------|--------|------------------|
| n8n não enxerga o nó | Certifique-se de que o `npm run build` foi executado e que você reiniciou o serviço n8n. | ```bash\nsudo docker compose restart n8n\n``` |
| Porta 5678 ocupada | Pare o processo que está usando a porta ou altere o mapeamento de porta no `docker-compose.yml`. | ```bash\nsudo docker compose down # para parar os containers\n``` |
| Verificar arquivos no container | Garanta que o `.js` e o `.svg` foram montados corretamente no container do n8n. | ```bash\nsudo docker exec -it $(docker compose ps -q n8n) ls -la /home/node/.n8n/custom/nodes/Random\n``` |

---

## Comandos Úteis

| Ação | Comando (a partir de `n8n-docker/`) |
|------|------------------------------------|
| Parar e remover todos os containers | ```bash\nsudo docker compose down\n``` |
| Reiniciar apenas o serviço n8n | ```bash\nsudo docker compose restart n8n\n``` |
| Visualizar Logs do n8n | ```bash\nsudo docker logs -f $(docker compose ps -q n8n)\n``` |
| Acessar o Postgres (via CLI) | ```bash\nsudo docker exec -it <nome_do_container_postgres> psql -U <POSTGRES_USER> -d <POSTGRES_DB>\n``` |

