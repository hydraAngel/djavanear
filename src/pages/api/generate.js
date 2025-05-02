import fs from "fs/promises";
import path from "path";

export default async function handler(req, res) {
  try {
    const letrasPath = path.join(process.cwd(), "letras_agrupadas");
    const files = await fs.readdir(letrasPath);

    if (!files.length) {
      return res
        .status(500)
        .json({ status: "error", message: "Nenhum arquivo encontrado." });
    }

    // Escolhe um arquivo aleatório
    const index = Math.floor(Math.random() * files.length);
    const file = files[index];
    const filePath = path.join(letrasPath, file);

    const conteudoJson = await fs.readFile(filePath, "utf-8");
    const dados = JSON.parse(conteudoJson);
    const { album, grupos_versos: grupos } = dados;

    if (!Array.isArray(grupos) || grupos.length === 0) {
      return res
        .status(500)
        .json({ status: "error", message: "Arquivo sem grupos de versos." });
    }

    // Seleciona versos aleatórios
    let grupoAleatorio = grupos[Math.floor(Math.random() * grupos.length)];

    if (grupoAleatorio.length === 1) {
      const outroGrupo =
        grupos[(Math.floor(Math.random() * grupos.length) + 1) % grupos.length];
      grupoAleatorio = [grupoAleatorio[0], outroGrupo[0]];
    }

    const versosParaRetornar = grupoAleatorio.slice(0, 2);
    const versoAleatorio = versosParaRetornar.join("; ");
    const letraSemAlbum = grupos.flat().join("\n");

    // Nome da música correta
    const musicaCorreta = file.replace(".json", "");

    // Gera alternativas erradas
    const nomesDisponiveis = files
      .map((f) => f.replace(".json", ""))
      .filter((nome) => nome !== musicaCorreta);

    const alternativasErradas = [];
    while (alternativasErradas.length < 3 && nomesDisponiveis.length > 0) {
      const i = Math.floor(Math.random() * nomesDisponiveis.length);
      alternativasErradas.push(nomesDisponiveis.splice(i, 1)[0]);
    }

    const opcoes = [...alternativasErradas, musicaCorreta].sort(
      () => 0.5 - Math.random()
    );

    // Carrega test1.json para encontrar o número do álbum
    const albunsDataPath = path.join(process.cwd(), "assets", "test1.json");
    const albunsJson = await fs.readFile(albunsDataPath, "utf-8");
    const albunsData = JSON.parse(albunsJson);
    const albums = albunsData.letras?.reverse() || [];

    const albumInfo = albums.find((item) => item.name === album);
    const numAlbum = albumInfo?.num || 1;

    return res.status(200).json({
      status: "ok",
      musica: musicaCorreta,
      letra: letraSemAlbum,
      verso: versoAleatorio,
      num_album: numAlbum,
      opcoes,
    });
  } catch (error) {
    console.error("Erro em /api/generate:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Erro interno no servidor." });
  }
}
