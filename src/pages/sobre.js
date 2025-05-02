import { useEffect, useState } from "react";

export default function Sobre() {
  const [numAlbum, setNumAlbum] = useState(null);

  useEffect(() => {
    async function aplicarTemaAleatorio() {
      try {
        const res = await fetch("/assets/temas.json");
        const temas = await res.json();
        const chaves = Object.keys(temas);
        const escolha = chaves[Math.floor(Math.random() * chaves.length)];
        const tema = temas[escolha];

        for (const key in tema) {
          document.documentElement.style.setProperty(key, tema[key]);
        }

        setNumAlbum(parseInt(escolha));
      } catch (err) {
        console.error("Erro ao aplicar tema aleatório:", err);
      }
    }

    aplicarTemaAleatorio();
  }, []);

  return (
    <main
      className="container"
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "2rem",
        display: "flex",
        flexWrap: "wrap",
        gap: "2rem",
        justifyContent: "center",
      }}
    >
      <div style={{ flex: "1 1 300px", minWidth: "300px" }}>
        <h1 className="titulo">Sobre o Projeto Djavanear</h1>

        <p className="verso" style={{ marginBottom: "1.5rem" }}>
          Djavanear é uma experiência musical interativa que celebra a poesia de
          Djavan. Aqui você pode descobrir versos, testar seu conhecimento e
          explorar as cores sonoras de cada álbum.
        </p>

        <p>
          Desenvolvido por <strong>Paiva</strong>, este projeto une React,
          Next.js e carinho pelo Djavan. <br />
          Todas as letras são usadas com propósito educativo e cultural.
        </p>

        <p style={{ marginTop: "1rem" }}>
          Acesse o projeto no{" "}
          <a href="https://github.com/seuusuario/djavanear" target="_blank">
            GitHub
          </a>{" "}
          ou me siga no{" "}
          <a href="https://www.instagram.com/paiva_sk8" target="_blank">
            @paiva_sk8
          </a>
          .
        </p>

        <p style={{ fontSize: "0.9rem", marginTop: "2rem", color: "#888" }}>
          As capas dos álbuns e as letras são obras de seus respectivos autores.
        </p>
      </div>
      {console.log(numAlbum)}
      {numAlbum && (
        <div style={{ flex: "0 1 240px", textAlign: "center" }}>
          <img
            src={`/assets/${numAlbum}.jpg`}
            alt={`Álbum ${numAlbum}`}
            style={{
              width: "100%",
              aspectRatio: "1 / 1",
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              objectFit: "cover",
              marginBottom: "0.5rem",
            }}
          />
          <p style={{ fontSize: "0.95rem", color: "var(--color-text-title)" }}>
            ← Esse é o tema visual baseado neste álbum
          </p>
        </div>
      )}
    </main>
  );
}
