import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [verso, setVerso] = useState("");
  const [musica, setMusica] = useState("");
  const [numAlbum, setNumAlbum] = useState(1);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [themeLoaded, setThemeLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [historico, setHistorico] = useState([]);
  const [mostrarHistorico, setMostrarHistorico] = useState(false);

  function toggleHistorico() {
    setMostrarHistorico((prev) => !prev);
  }

  // Aplica tema salvo e overlay
  useEffect(() => {
    const temaSalvo = localStorage.getItem("tema");
    const escuro = temaSalvo === "escuro";
    setIsDarkMode(escuro);
    if (escuro) document.body.classList.add("darkmode");
    setThemeLoaded(true); // agora pode mostrar o botão

    const jaSabe = JSON.parse(localStorage.getItem("ja-sabe"));
    if (jaSabe?.["ja clicou"]) {
      setOverlayVisible(false);
    }
  }, []);

  async function fetchVerso() {
    setLoading(true);        // começa o loading
    try {
      const res = await fetch("/api/generate");
      const data = await res.json();
      setVerso(data.verso);
      setHistorico((prev) => {
        const novoItem = {
          verso: data.verso,
          musica: data.musica,
          numAlbum: data.num_album,
          timestamp: Date.now()
        };

        // remove duplicatas consecutivas e limita a 3 itens
        const filtrado = prev.filter(item => item.verso !== data.verso);
        const atualizado = [novoItem, ...filtrado].slice(0, 3);
        return atualizado;
      });
      setMusica(data.musica);
      setNumAlbum(data.num_album || 1);
    } catch (err) {
      console.error("Erro ao gerar verso:", err);
    } finally {
      setLoading(false);     // termina o loading
    }
  }


  function handleClick() {
    localStorage.setItem("ja-sabe", JSON.stringify({ "ja clicou": true }));
    setOverlayVisible(false);
    fetchVerso();
  }

  function toggleTheme() {
    const isNowDark = document.body.classList.toggle("darkmode");
    setIsDarkMode(isNowDark);
    localStorage.setItem("tema", isNowDark ? "escuro" : "claro");
  }

  return (
    <main role="main" className="container">
      {/* Botão de troca de tema com animação */}
      {themeLoaded && (
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

              <motion.svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Zm326-268Z" /></motion.svg>
            )}
          </AnimatePresence>
        </button>
      )}

      {/* Imagem com overlay */}
      <div className="image-wrapper" onClick={handleClick}>
        {overlayVisible && (
          <div className="overlay">
            <h3 className="avisotext">Clique aqui para gerar um verso</h3>
          </div>
        )}
        <img src={`/assets/${numAlbum}.jpg`} alt="Capa do álbum de Djavan" />
      </div>

      <h1 className="titulo">DJAVANEAR</h1>
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.h2
            key="loading"
            className="verso"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Gerando verso…
          </motion.h2>
        ) : verso ? (
          <motion.h2
            key="verso"
            className="verso"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            {verso}
          </motion.h2>
        ) : null}
      </AnimatePresence>
      {!loading && musica && (
        <motion.h3
          className="musica"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          Djavan em : <span>{musica}</span>
        </motion.h3>
      )}
      {historico.length > 0 && (
        <div className="verso-historico">
          <button
            onClick={toggleHistorico}
            style={{
              background: "none",
              border: "none",
              color: "#666",
              fontSize: "1rem",
              cursor: "pointer",
              marginBottom: "0.5rem",
            }}
          >
            {mostrarHistorico ? "⬆️ Esconder versos anteriores" : "⬇️ Mostrar versos anteriores"}
          </button>

          <AnimatePresence>
            {mostrarHistorico && (
              <motion.ul
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {historico.map((item) => (
                  <li
                    key={item.timestamp}
                    style={{
                      marginBottom: "0.4rem",
                      fontSize: "1rem",
                      color: "#777",
                      listStyle: "none",
                    }}
                  >
                    <span style={{ fontStyle: "italic" }}>{item.verso}</span>{" "}
                    <small>({item.musica})</small>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      )}
      <footer className="by">
        by <a href="https://www.instagram.com/paiva_sk8" target="_blank">@paiva_sk8</a>
      </footer>
    </main>
  );
}
