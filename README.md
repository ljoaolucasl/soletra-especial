# Soletra Especial

Um jogo de palavras inspirado no **Soletra**, desenvolvido em **TypeScript + Vite** como uma aplicação totalmente **front-end**.

Este projeto foi criado como um exercício de desenvolvimento e também como um presente pessoal: um jogo especial feito para minha noiva, utilizando palavras que representam momentos importantes da nossa história.

Além do valor sentimental, o projeto foi pensado com foco em **boas práticas de front-end**, organização de código e experiência de usuário em dispositivos móveis.

---

# 🎮 Sobre o jogo

O jogo segue a lógica clássica de formação de palavras utilizando um conjunto limitado de letras.

Cada rodada apresenta um grupo de letras organizadas em formato de colmeia. O jogador deve formar palavras válidas utilizando essas letras.

### Regras

- As palavras devem ter **no mínimo 4 letras**
- **A letra central é obrigatória**
- Apenas as letras exibidas podem ser utilizadas
- Cada rodada possui uma **palavra especial**

Quando a palavra especial é encontrada, a **próxima rodada é desbloqueada**.

---

# Estrutura das rodadas

O jogo é dividido em múltiplas rodadas temáticas:

1. Flores  
2. Noivos  
3. Ela  
4. Nós  
5. Vida com Deus  

Cada rodada possui:

- um conjunto específico de letras
- uma lista de palavras válidas
- uma **palavra especial** responsável por liberar a próxima rodada

---

# ⭐ Mecânicas adicionais

O projeto possui algumas mecânicas extras:

- **Progressão por rodadas**
- **Palavras especiais para desbloqueio**
- **Sistema de pontuação**
- **Ranking baseado no desempenho**
- **Persistência de progresso usando LocalStorage**
- **Final especial ao completar todas as palavras**

Quando todas as palavras de todas as rodadas são encontradas, o jogo entra em um estado especial com pontuação infinita e uma mensagem final personalizada.

---

# 🛠️ Tecnologias utilizadas

O projeto foi desenvolvido utilizando:

- **TypeScript**
- **Vite**
- **SCSS**
- **HTML5**
- **LocalStorage API**

Principais objetivos técnicos:

- aplicação **100% client-side**
- arquitetura modular
- código organizado por responsabilidades
- build otimizado para produção

---

# 📱 Responsividade

A interface foi otimizada principalmente para **dispositivos móveis**, com foco em:

- iPhone 11
- Safari Mobile
- interações touch

Foram feitas otimizações específicas para melhorar a performance no iOS, como:

- redução de efeitos pesados
- ajuste de viewport
- melhoria de áreas de toque

---

# 💾 Persistência de dados

O progresso do jogador é salvo utilizando **LocalStorage**, incluindo:

- rodadas desbloqueadas
- palavras encontradas
- pontuação acumulada

Isso permite que o usuário continue jogando mesmo após fechar o navegador.

---

# 🚀 Deploy

A aplicação é totalmente estática e pode ser publicada facilmente.

Atualmente o projeto está preparado para deploy usando:

- **GitHub Pages**

O build é gerado via:
