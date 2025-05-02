import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";

export default function Home() {
  const [verso, setVerso] = useState("");
  const [musica, setMusica] = useState("");
  const [numAlbum, setNumAlbum] = useState(Math.floor(Math.random() * 28) + 1);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [themeLoaded, setThemeLoaded] = useState(false);
  const [historico, setHistorico] = useState([]);
  const [mostrarHistorico, setMostrarHistorico] = useState(false);
  const router = useRouter();
  async function aplicarTemaDoAlbum(numAlbum) {
    try {
      const res = await fetch("/assets/temas.json");
      const temas = await res.json();
      const tema = temas[numAlbum?.toString()];
      if (tema) {
        for (const key in tema) {
          document.documentElement.style.setProperty(key, tema[key]);
        }
      }
    } catch (error) {
      console.error("Erro ao aplicar tema:", error);
    }
  }
  useEffect(() => {
    aplicarTemaDoAlbum(numAlbum);
    setThemeLoaded(true);

    const jaSabe = JSON.parse(localStorage.getItem("ja-sabe"));
    if (jaSabe?.["ja clicou"]) {
      setOverlayVisible(false);
    }
  }, [numAlbum]);

  async function fetchVerso() {
    try {
      const res = await fetch("/api/generate");
      const data = await res.json();
      setVerso(data.verso);
      setMusica(data.musica);
      setNumAlbum(data.num_album || 1);
      aplicarTemaDoAlbum(data.num_album || 1);

      setHistorico((prev) => {
        const novo = {
          verso: data.verso,
          musica: data.musica,
          timestamp: Date.now(),
        };
        const semRepetir = prev.filter((v) => v.verso !== data.verso);
        return [novo, ...semRepetir].slice(0, 3);
      });
    } catch (err) {
      console.error("Erro ao gerar verso:", err);
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
    <main className="container">
      <div className="main-content">
        {/* Botão para ir ao jogo */}
        <button id="game-switch" onClick={() => router.push("/game")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="var(--color-bg)"
          >
            <path d="M189-160q-60 0-102.5-43T42-307q0-9 1-18t3-18l84-336q14-54 57-87.5t98-33.5h390q55 0 98 33.5t57 87.5l84 336q2 9 3.5 18.5T919-306q0 61-43.5 103.5T771-160q-42 0-78-22t-54-60l-28-58q-5-10-15-15t-21-5H385q-11 0-21 5t-15 15l-28 58q-18 38-54 60t-78 22Zm351-360q17 0 28.5-11.5T580-560q0-17-11.5-28.5T540-600q-17 0-28.5 11.5T500-560q0 17 11.5 28.5T540-520Zm80-80q17 0 28.5-11.5T660-640q0-17-11.5-28.5T620-680q-17 0-28.5 11.5T580-640q0 17 11.5 28.5T620-600Zm0 160q17 0 28.5-11.5T660-480q0-17-11.5-28.5T620-520q-17 0-28.5 11.5T580-480q0 17 11.5 28.5T620-440Zm80-80q17 0 28.5-11.5T740-560q0-17-11.5-28.5T700-600q-17 0-28.5 11.5T660-560q0 17 11.5 28.5T700-520Zm-360 60q13 0 21.5-8.5T370-490v-40h40q13 0 21.5-8.5T440-560q0-13-8.5-21.5T410-590h-40v-40q0-13-8.5-21.5T340-660q-13 0-21.5 8.5T310-630v40h-40q-13 0-21.5 8.5T240-560q0 13 8.5 21.5T270-530h40v40q0 13 8.5 21.5T340-460Z" />
          </svg>
        </button>

        {/* Botão de tema */}
        {/* {themeLoaded && (
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
        )} */}

        <div className="image-wrapper" onClick={handleClick}>
          {overlayVisible && (
            <div className="overlay">
              <h3 className="avisotext">Clique aqui para gerar um verso</h3>
            </div>
          )}
          <img src={`/assets/${numAlbum}.jpg`} alt="Capa do álbum" />
        </div>

        <h1 className="titulo">DJAVANEAR</h1>
        {verso && <h2 className="verso">&quot;{verso}&quot;</h2>}
        {musica && (
          <h3 className="musica">
            <span>Djavan em: </span>
            {musica}
          </h3>
        )}
      </div>

      {historico.length > 0 && (
        <div className="verso-historico">
          <button
            onClick={() => setMostrarHistorico(!mostrarHistorico)}
            className="dica-botao"
          >
            {mostrarHistorico
              ? "⬆ Esconder versos anteriores"
              : "⬇ Mostrar versos anteriores"}
          </button>
          {mostrarHistorico && (
            <ul>
              {historico.map((item) => (
                <li key={item.timestamp}>
                  “{item.verso}” <small>({item.musica})</small>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <footer className="by">
        by{" "}
        <a href="https://www.instagram.com/paiva_sk8" target="_blank">
          @paiva_sk8
        </a>
      </footer>
    </main>
  );
}
