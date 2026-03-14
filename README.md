# Tarô Sakura 🌸

Uma aplicação web interativa de leitura de Tarô inspirada no universo de Sakura Card Captor. O projeto foi desenvolvido para ser totalmente estático, sem custos de API e com todos os recursos (incluindo imagens) armazenados localmente.

## ✨ Funcionalidades

- **Leitura de 3 Cartas:** Passado, Presente e Futuro.
- **Interpretações Estáticas:** Significados e conselhos detalhados para cada uma das 52 cartas.
- **Resumo da Jornada:** Lógica personalizada para gerar um resumo da leitura.
- **Imagens Locais:** Todas as cartas estão armazenadas na pasta `public/cards/`, garantindo que o app funcione offline e sem dependências externas.
- **Design Responsivo:** Interface moderna e fluida utilizando Tailwind CSS e animações com Motion.

## 🚀 Tecnologias Utilizadas

- **React 19**
- **Vite**
- **Tailwind CSS 4**
- **Motion** (Framer Motion)
- **Lucide React** (Ícones)
- **TypeScript**

## 🛠️ Como Executar o Projeto

1. **Clone o repositório:**
   ```bash
   git clone <url-do-seu-repositorio>
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acesse no navegador:**
   O projeto estará disponível em `http://localhost:3000`.

## 📦 Build para Produção

Para gerar a versão otimizada para deploy:
```bash
npm run build
```
Os arquivos serão gerados na pasta `dist/`.

## 🛡️ Segurança

O projeto não utiliza chaves de API sensíveis. O arquivo `.env.example` está presente apenas como referência para configurações de ambiente, mas não é necessário para o funcionamento básico da aplicação estática.

---
Desenvolvido com ❤️ para fãs de Sakura Card Captor.
