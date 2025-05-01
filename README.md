# ðŸŽµ Djavanear

**Djavanear** Ã© um app interativo que celebra a obra poÃ©tica de Djavan.  
VocÃª pode gerar versos aleatÃ³rios, testar se reconhece de qual mÃºsica vÃªm, e explorar cada Ã¡lbum visualmente.

---

## âœ¨ Funcionalidades

- GeraÃ§Ã£o de versos aleatÃ³rios
- Jogo: adivinhe a mÃºsica
- PontuaÃ§Ã£o persistente
- Dica visual (imagem do Ã¡lbum)
- Tema dinÃ¢mico por Ã¡lbum (com base em cores da capa)
- Tema claro/escuro
- Responsividade total
- AnimaÃ§Ãµes suaves com framer-motion
- PÃ¡gina institucional com homenagem e crÃ©ditos

---

## ðŸ“¦ Tecnologias

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [JSON](https://www.json.org/) para base de letras
- CSS Variables para temas visuais
- [Color Thief (via Python)] para extraÃ§Ã£o de cores das capas

---

## ðŸš€ Como rodar localmente

```bash
git clone https://github.com/seuusuario/djavanear
cd djavanear
npm install
npm run dev
```

Abra no navegador: `http://localhost:3000`

---

## ðŸ§  Estrutura do Projeto

```
/public/assets         â†’ imagens das capas + temas.json
/pages/index.js        â†’ pÃ¡gina inicial do verso
/pages/game.js         â†’ modo de jogo (GameClient)
/pages/sobre.js        â†’ landing institucional
/components/           â†’ GameClient.jsx
/letras_agrupadas/     â†’ arquivos .json com versos agrupados por mÃºsica
```

---

## ðŸ™ CrÃ©ditos

- Letras e capas: obras de **Djavan**, utilizadas com fins **educacionais e culturais**
- Desenvolvimento: [@paiva_sk8](https://www.instagram.com/paiva_sk8)
- Projeto com carinho para celebrar a arte

---

## ðŸ“« Contato

Siga no Instagram: [@paiva_sk8](https://www.instagram.com/paiva_sk8)

---

## ðŸ“„ LicenÃ§a

Uso nÃ£o-comercial.  
Para qualquer uso com fins comerciais, entre em contato com os detentores dos direitos autorais das obras.