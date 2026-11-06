---
name: ecos-da-escritura
description: Produce a new animated Bible-story video for the YouTube channel "Ecos da Escritura" (Portuguese, faceless/dark channel) in the house style — palette-knife oil painting (Lemo-Opuscar "impasto" engine), grey world that turns to colour at the story's turning point, pt-BR narration, burned-in subtitles, original score — as a vertical Short (1080x1920, ~50–60 s) or a horizontal video (1920x1080, ~1:20–2:30), plus cover and posting copy for YouTube, TikTok and Instagram. Use when the user asks for a new Bible story video, Short, cover or posting texts for this channel.
---

# Ecos da Escritura — produzir um vídeo novo

Pipeline em código: cada vídeo é uma página que pinta cada quadro com pinceladas de espátula (`engine/impasto.js`), uma timeline que alimenta imagem, voz, legenda, trilha e mixagem, e um `build.sh` que gera o MP4 final a −14 LUFS.

## Pré-requisitos

- Biblioteca **Lemo-Opuscar** clonada (padrão `~/lemo-opuscar`, ou `LIB=<pasta>`) com `deps`, `deps voice` e as amostras `vsco2ce` + `vcsl` (`sh tools/fetch.sh instruments vsco2ce`, idem `vcsl`).
- Node 20+, ffmpeg 7+, Python 3.11+. No Windows/Git Bash: `export MSYS_NO_PATHCONV=1 PYTHONIOENCODING=utf-8`.
- Voz: edge-tts `pt-BR-AntonioNeural`, `--rate=-6% --pitch=-4Hz` (precisa de internet). Conferir os termos da Microsoft antes de monetizar.

## Estrutura

```
shorts/                 framework de Shorts e vídeos horizontais (uma página para todas as histórias)
  runner.js             pinta, transições, legendas, referência bíblica, título-gancho, card final, modo capa,
                        e mantém a câmera dentro da pintura automaticamente
  engine/               motor impasto (MIT, LemoLab)
  scenes/actors.js      pessoa (túnica listrada, cabelo longo, venda, coroa, elmo, lança), peixe, navio, mar, raios, chuva, raio
  scenes/actors2.js     leão, porco, carro de guerra, muralha de água, coluna que cai
  stories/<slug>/       lines.json (roteiro), plan.mjs (tempo/música/som), story.js (pinturas e cenas)
  tools/                make_timeline.mjs, score.py (trilha por "humor"), mix.py, cover.py, textos*.py, organizar.py
  build.sh              sh build.sh <slug> [1920x1080]
jonas/                  o primeiro vídeo longo (2:24), código próprio
```

## Fluxo para uma história nova

1. **Roteiro** — `stories/<slug>/lines.json`: 8–10 falas (Short) ou 11–14 (horizontal). Gancho na 1ª fala, virada no meio, última fala = lição + pergunta ao espectador. Números como dígitos em `text` e por extenso em `say`. Falas longas podem ter `subs` (divisão manual da legenda). Conferir cada fato e citação na Bíblia.
2. **Voz** — `core/tts/tts_zh.py lines.json voice --voice pt-BR-AntonioNeural --rate=-6% --pitch=-4Hz`; depois `core/tts/asr_check.py ... --lang pt --model small`. Nomes próprios o Whisper erra (aceitar). Reescrever quando duas palavras se fundem ("Mas Zaqueu" → "aqui eu", "o quão longe" → "qual monge", "Nenhuma torre" → "Nenhum ator", "O que em você").
3. **Plano** — `plan.mjs`: `SHOTS` (cada corte ancorado a uma fala), `TRANS` (cortes com pincelada), `T` (momentos-chave), `SILENCE` (silêncio total antes da virada), `MUSIC` (dark, call, walk, tension, storm, turn, warm, rise, triumph, end, ring, silence), `HITS`, `SFX`, `BEDS`. Horizontal: `MAXC = 70`.
4. **Cenas** — `story.js`: `PLATES` (pinturas de referência → pinceladas; vertical 1188x2112, horizontal 2112x1188) e `S[shot](t, x, K)`. Exportar `HOOK`, `COVER`, `COVER_T`, `BOOK`, `REFS`, `QUOTES`.
5. **Revisão** — `node tools/make_timeline.mjs <slug>` e stills com `core/render/still.mjs <shorts> <t…> --size … --q 'story=<slug>'`; montar folha com `core/render/sheet.py` e olhar antes de renderizar.
6. **Render** — `sh build.sh <slug>` (vertical) ou `sh build.sh <slug> 1920x1080`.
7. **Capa** — `still.mjs <shorts> 0 --q 'story=<slug>&cover=1'` (escolher `COVER_T` num quadro **colorido**; capa cinza não vende). Horizontal: reduzir para 1280x720.
8. **Textos** — seguir `tools/textos2.py` (título com gancho, descrição, pergunta, referência, capítulos ≥10 s entre si e começando em 00:00, tags ≤ 500 caracteres; TikTok e Instagram com hashtags).

## Regras de estilo do canal (não mudar)

- Mundo em **cinza** (`K.grey`) até a virada; uma única coisa colorida antes (luz de Deus, janela, túnica, cabelo, tocha, cetro); na virada, onda de cor (`reveal` + `revC`) com luz rasante e raios dourados; depois tudo colorido (`WARM`).
- Gancho em texto grande no topo nos primeiros segundos; referência bíblica pequena no canto; card final "ECOS DA ESCRITURA".
- Legendas: Short `bottom:300px` (acima da interface do app); horizontal `bottom:58px`; mínimo 1,8 s por legenda; nunca deixar "Mas," / "E você," sozinhos no fim de uma linha.
- Personagens acima da faixa da legenda; câmera dentro da pintura (o runner já limita).
- Pintura: o céu deve **descer abaixo** do topo do chão (senão aparece uma emenda marrom de tela no horizonte).
- Ondas na frente de personagens: dividir o mar em "atrás dos pés" e "na frente dos pés".
- Áudio: voz ~10 dB acima da música, música abaixa sob a voz, um raspar de espátula em cada transição, −14 LUFS.

## Antes de entregar

`blackdetect` (só o fade final pode ser escuro), loudness ≈ −14 LUFS, legendas do `.srt` = legendas queimadas, conferir a última frase e o card final.
