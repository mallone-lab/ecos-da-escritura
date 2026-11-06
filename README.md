# Ecos da Escritura — vídeos bíblicos pintados em código

Código-fonte dos vídeos do canal **Ecos da Escritura** (YouTube @ecosdaescrituraoficial): histórias da Bíblia em estilo pintura a óleo com espátula, narradas em português, com legendas, trilha original e efeitos sonoros — tudo gerado por código, sem imagens de IA nem banco de imagens.

## O que tem aqui

| Pasta | Conteúdo |
|---|---|
| `jonas/` | **Jonas — o homem que fugiu de Deus** (vídeo longo, 2:24) e a versão Short |
| `shorts/` | Framework para Shorts verticais e vídeos horizontais + 15 histórias prontas |
| `skill/ecos-da-escritura/SKILL.md` | A "skill": como produzir um vídeo novo no estilo do canal (para usar com o Claude Code) |

Histórias em `shorts/stories/`:
- **Shorts verticais:** Daniel, José do Egito, Mar Vermelho, Sansão, Filho pródigo, Noé, Torre de Babel, Elias, Pedro sobre as águas, Zaqueu
- **Horizontais:** Davi e Golias, Ester, Rute, Gideão e os 300, Lázaro

## Como gerar um vídeo

Requer a biblioteca [Lemo-Opuscar](https://github.com/lemomo-ai/lemo-opuscar) instalada (com `deps`, `deps voice` e as amostras `vsco2ce` e `vcsl`), Node 20+, ffmpeg 7+ e Python 3.11+.

```sh
export LIB=~/lemo-opuscar          # onde está a biblioteca
cd shorts
sh build.sh daniel                 # Short vertical  -> stories/daniel/daniel.mp4
sh build.sh davi 1920x1080         # vídeo horizontal -> stories/davi/davi.mp4
cd ../jonas && sh build.sh         # Jonas longo + Short
```

A voz é gerada na hora (edge-tts, precisa de internet) e fica em cache em `stories/<slug>/voice/`.

## Usar como skill no Claude Code

Copie `skill/ecos-da-escritura/` para `~/.claude/skills/` e peça: *"faça um Short do Ecos da Escritura sobre a história de …"*.

## Licenças e créditos

- Motor de pintura `engine/impasto.js` e `engine/plate.js`: Lemo-Opuscar (LemoLab), licença MIT — ver `engine/LICENSE-LemoLab-MIT.txt`.
- Amostras de instrumentos (baixadas pela biblioteca): VS Chamber Orchestra CE e VCSL (Versilian Studios), CC0.
- Fonte Cormorant Garamond: SIL Open Font License 1.1 (`fonts/OFL.txt`).
- Narração: Microsoft Edge neural TTS (pt-BR-AntonioNeural) — confira os termos da Microsoft para uso comercial.
- Textos bíblicos: paráfrases próprias com citações curtas, referências indicadas em cada vídeo.
