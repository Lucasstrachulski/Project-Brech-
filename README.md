# Engordei Perdi - O Seu Brechó

Site completo para brechó com painel administrativo privado.

## Estrutura do Projeto

```
engordei-perdi/
├── src/
│   ├── config/           # Configurações do projeto
│   │   └── index.js
│   ├── controllers/      # Lógica de negócio
│   │   ├── authController.js
│   │   └── productController.js
│   ├── middleware/        # Middlewares (auth, upload)
│   │   ├── auth.js
│   │   └── upload.js
│   ├── routes/           # Rotas da API
│   │   ├── authRoutes.js
│   │   └── productRoutes.js
│   ├── data/             # Dados JSON
│   │   └── products.json
│   └── server.js         # Arquivo principal
├── public/               # Arquivos estáticos (site público)
│   ├── css/
│   ├── js/
│   ├── img/
│   ├── index.html
│   └── produto.html
├── admin/                # Painel administrativo
│   ├── css/
│   ├── js/
│   └── index.html
├── uploads/              # Imagens enviadas
├── .env                  # Variáveis de ambiente
├── .env.example          # Exemplo de .env
├── .gitignore
├── package.json
└── README.md
```

## Funcionalidades

### Site Público
- Catálogo de roupas com categorias (Feminino, Masculino, Infantil)
- Botão "Falar com a Dona no WhatsApp" em cada peça
- Design responsivo para desktop e mobile

### Painel Administrativo
- Login com senha protegida
- Cadastro de peças (título, descrição, preço, categoria, foto)
- Edição e exclusão de peças
- Upload de imagens

## Como Rodar

1. Instale as dependências:
```bash
npm install
```

2. Configure o arquivo `.env` (opcional):
```bash
PORT=3000
ADMIN_PASSWORD=suasenha
```

3. Inicie o servidor:
```bash
npm start
```

4. Acesse:
- Site público: http://localhost:3000
- Painel admin: http://localhost:3000/admin

## Senha do Admin
- Senha padrão: `brecho2024`

## Tecnologias
- Backend: Node.js + Express
- Frontend: HTML/CSS/JavaScript puro
- Banco de dados: JSON local (arquivo)
- Upload de imagens: Multer
