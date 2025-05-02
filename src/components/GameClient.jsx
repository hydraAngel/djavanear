import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";

export default function GameClient() {
  const [verso, setVerso] = useState("");
  const [respostaCorreta, setRespostaCorreta] = useState("");
  const [opcoes, setOpcoes] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [pontos, setPontos] = useState(0);
  const [numAlbum, setNumAlbum] = useState(null);
  const [mostrarDica, setMostrarDica] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [temaInicializado, setTemaInicializado] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const temaSalvo = localStorage.getItem("tema");
    const escuro = temaSalvo === "escuro";
    setIsDarkMode(escuro);
    if (escuro) document.body.classList.add("darkmode");
    setTemaInicializado(true);

    const pontosSalvos = parseInt(localStorage.getItem("pontos"), 10);
    if (!isNaN(pontosSalvos)) {
      setPontos(pontosSalvos);
    }

    carregarPergunta();
  }, []);

  useEffect(() => {
    const topo = document.querySelector(".main-content");
    if (topo) topo.scrollTo({ top: 0, behavior: "smooth" });
  }, [verso]);

  async function carregarPergunta() {
    setFeedback("");
    setCarregando(true);
    setMostrarDica(false);

    const res = await fetch("/api/generate");
    const data = await res.json();

    setVerso(data.verso);
    setRespostaCorreta(data.musica);
    setOpcoes(data.opcoes);
    setNumAlbum(data.num_album || 1);
    setCarregando(false);
  }

  function responder(musicaEscolhida) {
    if (musicaEscolhida === respostaCorreta) {
      setFeedback("✅ Acertou!");
      setPontos((p) => {
        const novo = p + 1;
        localStorage.setItem("pontos", novo.toString());
        return novo;
      });
    } else {
      setFeedback(`❌ Errou! Era: ${respostaCorreta}`);
    }

    setTimeout(() => {
      carregarPergunta();
    }, 2000);
  }

  function toggleTheme() {
    const isNowDark = document.body.classList.toggle("darkmode");
    setIsDarkMode(isNowDark);
    localStorage.setItem("tema", isNowDark ? "escuro" : "claro");
  }

  return (
    <main className="container">
      <div className="main-content">
        {/* Botão Voltar */}
        <button
          onClick={() => router.push("/")}
          id="game-switch"
          aria-label="Voltar à home"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 0 24 24"
            width="24px"
          >
            <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>

        {/* Botão de tema */}
        {temaInicializado && (
          <button id="theme-switch" onClick={toggleTheme}>
            <AnimatePresence mode="wait" initial={false}>
              {isDarkMode ? (
                <motion.svg
                  key="moon"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                  transition={{ duration: 0.3 }}
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
                </motion.svg>
              ) : (
                <motion.svg
                  key="sun"
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#e3e3e3"
                  initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                  transition={{ duration: 0.3 }}
                >
                  <path d="M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Zm326-268Z" />
                </motion.svg>
              )}
            </AnimatePresence>
          </button>
        )}

        <h1 className="titulo">🎵 Jogo Djavanear</h1>
        <p style={{ marginTop: "1rem", color: "#888" }}>Pontuação: {pontos}</p>

        <AnimatePresence mode="wait">
          {carregando ? (
            <motion.p
              key="loading"
              className="verso"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ marginTop: "2rem" }}
            >
              Gerando verso...
            </motion.p>
          ) : (
            <>
              <motion.p
                key={verso}
                className="verso"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                “{verso}”
              </motion.p>

              <motion.div
                className="opcoes"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                style={{
                  display: "grid",
                  gap: "1rem",
                  gridTemplateColumns: "1fr",
                  justifyItems: "center",
                }}
              >
                {opcoes.map((opcao) => (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    key={opcao}
                    onClick={() => responder(opcao)}
                    style={{
                      padding: "0.75rem 1.2rem",
                      borderRadius: "10px",
                      background: "#f5f5f5",
                      border: "1px solid #ccc",
                      fontSize: "1rem",
                      cursor: "pointer",
                      width: "100%",
                      maxWidth: "300px",
                    }}
                  >
                    {opcao}
                  </motion.button>
                ))}
              </motion.div>

              <button onClick={() => setMostrarDica((prev) => !prev)} className="dica-botao">
                {mostrarDica ? "Esconder dica" : "Mostrar dica"}
              </button>

              {mostrarDica && numAlbum && (
                <div className="dica-imagem">
                  <img src={`/assets/${numAlbum}.jpg`} alt="Dica do álbum" />
                </div>
              )}

              {feedback && (
                <motion.div
                  key="feedback"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  style={{ marginTop: "1.5rem", fontSize: "1.1rem", textAlign: "center" }}
                >
                  {feedback}
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}