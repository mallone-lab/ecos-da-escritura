# Publishing copy (YouTube / TikTok / Instagram) for every video -> ENTREGA/<video>/textos_para_publicar.md
import os, sys
OUT = sys.argv[1]
TAGS_BASE = "histórias da bíblia, bíblia, ecos da escritura, histórias bíblicas, fé, deus, jesus, estudo bíblico, devocional, palavra de deus, animação bíblica, cristão, evangélico, reflexão cristã"
V = [
 dict(dir='01_Jonas_video_longo', name='Jonas (vídeo longo)', title='O que Jonas fez dentro do peixe? | A história de Jonas animada', ref='Jonas 1–4', short=False,
  desc="Três dias e três noites no escuro, dentro de um grande peixe. Como um profeta de Deus foi parar ali?\n\nNesta animação pintada como um quadro a óleo, contamos a história de Jonas: o chamado para Nínive, a fuga para Társis, a tempestade, o grande peixe — e a oração que mudou tudo.",
  chapters="00:00 Três dias no escuro\n00:16 O chamado de Deus\n00:31 A fuga para Társis\n00:42 A tempestade\n01:05 Lançado ao mar\n01:16 A oração no ventre do peixe\n01:33 A segunda chance\n01:43 Nínive se arrepende\n02:02 A lição para hoje",
  tags='jonas, jonas e o grande peixe, jonas e a baleia, história de jonas, nínive, profeta jonas, livro de jonas', hash_yt='#Jonas #HistóriasDaBíblia #Fé',
  hook='Ele passou 3 dias dentro de um peixe… e o que ele fez lá mudou tudo 🐋🙏', tt='#jonas #bíblia #fé #deus #históriasdabíblia #cristão #jesus #fy', q='De que chamado você está fugindo?'),
 dict(dir='02_Jonas_short', name='Jonas (Short)', title='Engolido por um peixe: o que Jonas fez lá dentro? #shorts', ref='Jonas 1–2', short=True,
  desc="Jonas fugiu de Deus, foi lançado ao mar e engolido por um grande peixe. Lá no fundo, ele fez o que ainda não tinha feito: orou.",
  tags='jonas, jonas e o grande peixe, jonas e a baleia, história de jonas', hash_yt='#shorts #Jonas #Bíblia',
  hook='3 dias no escuro dentro de um peixe… 🐋 até que ele fez ISSO', tt='#jonas #bíblia #fé #deus #históriasdabíblia #cristão #fyp', q='De que chamado você está fugindo?'),
 dict(dir='03_Daniel_cova_dos_leoes', name='Daniel na cova dos leões', title='Uma noite trancado com leões famintos — e ele sobreviveu #shorts', ref='Daniel 6', short=True,
  desc="Daniel orava três vezes por dia, com as janelas abertas para Jerusalém. Quando uma lei proibiu a oração, ele orou mesmo assim — e foi lançado na cova dos leões. Ao amanhecer: \"O meu Deus enviou o seu anjo, e fechou a boca dos leões.\"",
  tags='daniel, daniel na cova dos leões, cova dos leões, rei dario, profeta daniel, livro de daniel, oração', hash_yt='#shorts #Daniel #Bíblia',
  hook='Jogado numa cova com leões famintos por causa de UMA oração 🦁🙏', tt='#daniel #covadosleões #bíblia #fé #oração #cristão #fyp', q='O que você faria se orar custasse caro?'),
 dict(dir='04_Jose_do_Egito', name='José do Egito', title='Vendido pelos irmãos… e chegou ao palácio #shorts', ref='Gênesis 37–50', short=True,
  desc="José ganhou uma túnica colorida, foi jogado num poço pelos próprios irmãos, vendido como escravo e preso injustamente. Mas Deus estava com ele. Anos depois, os irmãos se curvaram diante dele — e ele os perdoou: \"Vocês planejaram o mal contra mim, mas Deus o transformou em bem.\"",
  tags='josé do egito, história de josé, josé e seus irmãos, túnica colorida, perdão, gênesis, faraó', hash_yt='#shorts #JoséDoEgito #Perdão',
  hook='Os próprios irmãos o venderam como escravo… olha onde ele terminou 👑', tt='#josédoegito #perdão #bíblia #fé #deus #cristão #fyp', q='Você consegue perdoar quem te feriu?'),
 dict(dir='05_Moises_Mar_Vermelho', name='Moisés e o Mar Vermelho', title='Um mar à frente, um exército atrás — e Deus abriu o mar #shorts', ref='Êxodo 14', short=True,
  desc="Encurralado entre o mar Vermelho e os carros de guerra do faraó, o povo gritou de medo. Moisés respondeu: \"Não temam. O Senhor lutará por vocês.\" Ele estendeu a mão sobre o mar — e o povo atravessou em terra seca.",
  tags='moisés, mar vermelho, abertura do mar vermelho, êxodo, travessia do mar vermelho, faraó, milagre', hash_yt='#shorts #MarVermelho #Moisés',
  hook='Sem saída: mar na frente, exército atrás… até o mar se ABRIR 🌊', tt='#moisés #marvermelho #bíblia #fé #milagre #cristão #fyp', q='Qual mar está diante de você hoje?'),
 dict(dir='06_Sansao', name='Sansão', title='O homem mais forte do mundo perdeu tudo por um segredo #shorts', ref='Juízes 13–16', short=True,
  desc="Sansão despedaçou um leão e venceu os filisteus — até contar a Dalila o segredo da sua força. Cego e preso, ele orou uma última vez: \"Lembra-te de mim, Senhor.\" E as colunas caíram.",
  tags='sansão, sansão e dalila, história de sansão, juízes, força de sansão, dalila, filisteus', hash_yt='#shorts #Sansão #Bíblia',
  hook='O homem mais forte que existiu perdeu TUDO por causa de um segredo 💪', tt='#sansão #sansãoedalila #bíblia #fé #deus #cristão #fyp', q='Que força você precisa pedir de volta hoje?'),
 dict(dir='07_Filho_Prodigo', name='O filho pródigo', title='Ele gastou tudo… e o pai correu para abraçá-lo #shorts', ref='Lucas 15:11–32', short=True,
  desc="Jesus contou a história de um filho que pediu a herança, gastou tudo e acabou cuidando de porcos. Quando decidiu voltar, o pai o viu de longe, correu, abraçou e o beijou: \"Este meu filho estava morto, e reviveu.\"",
  tags='filho pródigo, parábola do filho pródigo, parábolas de jesus, lucas 15, volta para casa, graça, amor do pai', hash_yt='#shorts #FilhoPródigo #Jesus',
  hook='Ele pediu a herança, gastou tudo… e o pai fez ISSO quando ele voltou 🥹', tt='#filhopródigo #jesus #bíblia #fé #graça #cristão #fyp', q='Você vai voltar?'),
]
for v in V:
    d = os.path.join(OUT, v['dir']); os.makedirs(d, exist_ok=True)
    tags = v['tags'] + ', ' + TAGS_BASE + (', shorts, shorts bíblicos' if v['short'] else '')
    tags = ', '.join(dict.fromkeys(t.strip() for t in tags.split(',')))
    while len(tags) > 490: tags = ', '.join(tags.split(', ')[:-1])
    ch = ('\n\n⏱️ Capítulos\n' + v['chapters']) if not v['short'] else ''
    ig_tags = v['tt'].replace(' #fyp', '').replace(' #fy', '') + ' #reelscristao #versiculododia #palavradedeus #devocional #historiasbiblicas #animacao'
    md = f"""# {v['name']} — textos para publicar

## YouTube{' Shorts' if v['short'] else ''}

**Título**
{v['title']}

**Descrição**
{v['desc']}

💬 {v['q']} Conta pra gente nos comentários.

📖 Leia: {v['ref']}{ch}

🔔 Inscreva-se no Ecos da Escritura — Histórias da Bíblia. Lições para hoje.

{v['hash_yt']}

**Tags** (cole no campo "Tags" do YouTube Studio)
{tags}

---

## TikTok

{v['hook']}
{v['q']} 👇

📖 {v['ref']}
{v['tt']}

---

## Instagram (Reels)

{v['hook']}

{v['desc']}

💬 {v['q']}
Comenta aqui embaixo e manda pra alguém que precisa ouvir isso hoje. 🙏

📖 {v['ref']}
Siga @ecosdaescrituraoficial para mais histórias da Bíblia.

{ig_tags}
"""
    open(os.path.join(d, 'textos_para_publicar.md'), 'w', encoding='utf-8').write(md)
print('textos ok:', len(V))
