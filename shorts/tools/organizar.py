# Gather both deliveries into one posting folder, in posting order, with uniform names + a calendar + all texts in one file.
import os, shutil, datetime, re
ROOT = r'\\?' + '\\' + os.path.abspath(os.getcwd()); OUT = os.path.join(ROOT, 'Ecos_da_Escritura_PARA_POSTAR')
# (source folder, short name, title for the calendar, format, platforms)
H = 'Horizontal (vídeo longo)'; V = 'Vertical (Short)'
YT = 'YouTube'; ALL = 'YouTube Shorts · TikTok · Instagram Reels'
ORDER = [
 ('ENTREGA/01_Jonas_video_longo', 'Jonas', 'Jonas — o homem que fugiu de Deus', H, YT),
 ('ENTREGA/02_Jonas_short', 'Jonas_Short', 'Jonas (Short)', V, ALL),
 ('ENTREGA/03_Daniel_cova_dos_leoes', 'Daniel', 'Daniel na cova dos leões', V, ALL),
 ('ENTREGA_2/13_Davi_e_Golias', 'Davi_e_Golias', 'Davi e Golias', H, YT),
 ('ENTREGA_2/11_Pedro_sobre_as_aguas', 'Pedro_sobre_as_aguas', 'Pedro anda sobre as águas', V, ALL),
 ('ENTREGA/05_Moises_Mar_Vermelho', 'Mar_Vermelho', 'Moisés e o Mar Vermelho', V, ALL),
 ('ENTREGA_2/14_Ester', 'Ester', 'Ester', H, YT),
 ('ENTREGA_2/08_Noe_e_a_arca', 'Noe', 'Noé e a arca', V, ALL),
 ('ENTREGA/04_Jose_do_Egito', 'Jose_do_Egito', 'José do Egito', V, ALL),
 ('ENTREGA_2/16_Gideao_e_os_300', 'Gideao', 'Gideão e os 300', H, YT),
 ('ENTREGA_2/10_Elias_fogo_do_ceu', 'Elias', 'Elias e o fogo do céu', V, ALL),
 ('ENTREGA/06_Sansao', 'Sansao', 'Sansão', V, ALL),
 ('ENTREGA_2/15_Rute', 'Rute', 'Rute', H, YT),
 ('ENTREGA_2/12_Zaqueu', 'Zaqueu', 'Zaqueu', V, ALL),
 ('ENTREGA_2/09_Torre_de_Babel', 'Torre_de_Babel', 'A torre de Babel', V, ALL),
 ('ENTREGA_2/17_Lazaro', 'Lazaro', 'A ressurreição de Lázaro', H, YT),
 ('ENTREGA/07_Filho_Prodigo', 'Filho_Prodigo', 'O filho pródigo', V, ALL),
]
if os.path.exists(OUT): shutil.rmtree(OUT)
os.makedirs(OUT)
start = datetime.date(2026, 11, 5)
DIAS = ['seg', 'ter', 'qua', 'qui', 'sex', 'sáb', 'dom']
cal, alltexts = [], []
for i, (src, name, title, fmt, plat) in enumerate(ORDER, 1):
    S = os.path.join(ROOT, *src.split('/')); n = f'{i:02d}'
    d = os.path.join(OUT, f'{n}_{name}'); os.makedirs(d)
    files = os.listdir(S)
    mp4 = [f for f in files if f.endswith('.mp4')][0]; srt = [f for f in files if f.endswith('.srt')][0]
    cap = [f for f in files if f.startswith('capa')][0]
    shutil.copy2(os.path.join(S, mp4), os.path.join(d, f'{n}_{name}_VIDEO.mp4'))
    shutil.copy2(os.path.join(S, cap), os.path.join(d, f'{n}_{name}_CAPA.jpg'))
    shutil.copy2(os.path.join(S, srt), os.path.join(d, f'{n}_{name}_LEGENDA.srt'))
    txt = open(os.path.join(S, 'textos_para_publicar.md'), encoding='utf-8').read()
    open(os.path.join(d, f'{n}_{name}_TEXTOS.md'), 'w', encoding='utf-8').write(txt)
    # plain .txt too, for copying from a phone
    open(os.path.join(d, f'{n}_{name}_TEXTOS.txt'), 'w', encoding='utf-8').write(re.sub(r'\*\*(.+?)\*\*', r'\1', txt).replace('## ', '').replace('# ', ''))
    day = start + datetime.timedelta(days=i - 1)
    cal.append((n, day, title, fmt, plat))
    alltexts.append(f"\n\n{'=' * 70}\n{n} · {title} · {fmt}\nPostar em {day.strftime('%d/%m')} ({DIAS[day.weekday()]}) — {plat}\n{'=' * 70}\n\n" + txt)
rows = '\n'.join(f'| {n} | {day.strftime("%d/%m/%Y")} ({DIAS[day.weekday()]}) | {title} | {fmt} | {plat} |' for n, day, title, fmt, plat in cal)
guide = f"""# Ecos da Escritura — calendário de postagem

17 vídeos, um por dia, alternando vídeos longos (horizontais, só YouTube) e Shorts (verticais, YouTube Shorts + TikTok + Reels).
Horário sugerido: entre 18h e 20h (horário de Brasília), quando o público cristão mais assiste.

| # | Data | Vídeo | Formato | Onde postar |
|---|---|---|---|---|
{rows}

## Em cada pasta

- `..._VIDEO.mp4` — o vídeo pronto (legenda já gravada no vídeo).
- `..._CAPA.jpg` — a capa. Horizontal: suba como **miniatura personalizada** no YouTube Studio. Vertical: no app do YouTube/TikTok/Instagram, escolha a capa ao publicar (ou use como primeiro quadro).
- `..._LEGENDA.srt` — no YouTube Studio: **Legendas → Adicionar idioma (Português) → Enviar arquivo → Com sincronização**. Ajuda o vídeo a aparecer na busca.
- `..._TEXTOS.md` / `.txt` — título, descrição e tags do YouTube; legenda do TikTok; legenda do Instagram. É só copiar e colar.

## Passo a passo rápido

**YouTube (vídeo longo):** Enviar vídeo → título e descrição do arquivo de textos → miniatura = CAPA → em "Mostrar mais", cole as Tags → Legendas = .srt → Público: "Não é conteúdo para crianças" → adicione a uma playlist ("Histórias da Bíblia").
**YouTube Shorts:** Enviar o mesmo vídeo vertical → título já tem #shorts → descrição do arquivo. Depois, em "Vídeo relacionado", ligue o Short ao vídeo longo do mesmo tema quando existir (Jonas).
**TikTok / Instagram Reels:** Enviar o vídeo vertical → cole a legenda da seção do app → escolha a capa → publique.

## Antes de monetizar

A narração usa a voz neural da Microsoft (edge-tts, pt-BR-AntonioNeural). Confira os termos de uso da Microsoft para uso comercial. Os demais materiais estão em CREDITOS.txt (CC0, OFL e MIT).
"""
open(os.path.join(OUT, '00_CALENDARIO_E_COMO_POSTAR.md'), 'w', encoding='utf-8').write(guide)
open(os.path.join(OUT, '00_TODOS_OS_TEXTOS.txt'), 'w', encoding='utf-8').write('ECOS DA ESCRITURA — TODOS OS TEXTOS PARA POSTAR' + re.sub(r'\*\*(.+?)\*\*', r'\1', ''.join(alltexts)))
c1 = open(os.path.join(ROOT, 'ENTREGA', 'CREDITOS.txt'), encoding='utf-8').read()
open(os.path.join(OUT, 'CREDITOS.txt'), 'w', encoding='utf-8').write(c1.replace(c1.split('\n')[0], 'Ecos da Escritura — créditos dos 17 vídeos'))
print('ok', len(ORDER))
