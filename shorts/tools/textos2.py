# Publishing copy for batch 2 (5 vertical Shorts + 5 horizontal videos) -> <out>/<video>/textos_para_publicar.md
import os, sys
OUT = sys.argv[1]
TAGS_BASE = "histórias da bíblia, bíblia, ecos da escritura, histórias bíblicas, fé, deus, jesus, estudo bíblico, devocional, palavra de deus, animação bíblica, cristão, evangélico, reflexão cristã"
V = [
 dict(dir='08_Noe_e_a_arca', name='Noé e a arca', short=True, ref='Gênesis 6–9', title='Todos zombaram dele… até a primeira gota cair #shorts',
  desc="O mundo estava cheio de violência, mas Noé andava com Deus. Ele construiu uma arca sem nunca ter visto um dilúvio. Os animais entraram dois a dois, o Senhor fechou a porta, e choveu 40 dias e 40 noites. Depois, o arco-íris: o sinal da promessa.",
  tags='noé, arca de noé, dilúvio, arco-íris, gênesis, obediência, promessa de deus', hash_yt='#shorts #Noé #Bíblia',
  hook='Todo mundo riu dele… até a primeira gota cair 🌧️🛶', tt='#noé #arcadenoé #bíblia #fé #obediência #cristão #fyp', q='O que Deus está pedindo para você construir?'),
 dict(dir='09_Torre_de_Babel', name='A torre de Babel', short=True, ref='Gênesis 11:1–9', title='Eles queriam chegar ao céu com tijolos #shorts',
  desc="Depois do dilúvio, todos falavam uma só língua. E decidiram construir uma torre que tocasse o céu, para tornar famoso o próprio nome. Mas o Senhor desceu, confundiu a língua deles, e a obra parou.",
  tags='torre de babel, babel, gênesis 11, orgulho, línguas, histórias do antigo testamento', hash_yt='#shorts #TorreDeBabel #Bíblia',
  hook='Eles tentaram construir uma torre até o céu… e Deus desceu 🧱', tt='#torredebabel #bíblia #fé #orgulho #deus #cristão #fyp', q='O que você está tentando construir sozinho?'),
 dict(dir='10_Elias_fogo_do_ceu', name='Elias e o fogo do céu', short=True, ref='1 Reis 18', title='1 homem contra 450 profetas — e o fogo caiu do céu #shorts',
  desc="Três anos sem chuva. No monte Carmelo, Elias desafiou os 450 profetas de Baal: o Deus que responder com fogo, esse é Deus. Eles gritaram o dia inteiro. Elias encharcou o altar três vezes, orou — e o fogo do Senhor caiu.",
  tags='elias, monte carmelo, profetas de baal, fogo do céu, 1 reis 18, profeta elias, oração', hash_yt='#shorts #Elias #FogoDoCéu',
  hook='1 contra 450… e o altar estava ENCHARCADO 🔥', tt='#elias #montecarmelo #bíblia #fé #oração #cristão #fyp', q='Em quem você está confiando hoje?'),
 dict(dir='11_Pedro_sobre_as_aguas', name='Pedro anda sobre as águas', short=True, ref='Mateus 14:22–33', title='Ele andou sobre a água… até olhar para o vento #shorts',
  desc="No meio da tempestade, os discípulos viram Jesus andando sobre as águas. Pedro pediu: manda-me ir até aí. E Jesus disse: vem. Pedro andou sobre a água — até olhar para o vento e começar a afundar. Senhor, salva-me! E Jesus estendeu a mão.",
  tags='pedro anda sobre as águas, jesus anda sobre as águas, mateus 14, tempestade, fé, medo, pedro', hash_yt='#shorts #Jesus #Fé',
  hook='Ele ANDOU sobre a água… até fazer isso 🌊', tt='#jesus #pedro #fé #medo #bíblia #cristão #fyp', q='Para onde você está olhando?'),
 dict(dir='12_Zaqueu', name='Zaqueu', short=True, ref='Lucas 19:1–10', title='O homem mais odiado da cidade subiu numa árvore #shorts',
  desc="Zaqueu era chefe dos cobradores de impostos em Jericó — rico e odiado. Baixinho, subiu numa figueira para ver Jesus passar. Jesus parou, olhou para cima e o chamou pelo nome: hoje preciso ficar na sua casa. E a vida de Zaqueu mudou.",
  tags='zaqueu, jesus e zaqueu, lucas 19, figueira, salvação, graça, jericó', hash_yt='#shorts #Zaqueu #Jesus',
  hook='Ele era o homem mais odiado da cidade… e Jesus parou por ELE 🌳', tt='#zaqueu #jesus #graça #bíblia #fé #cristão #fyp', q='Você sabia que Jesus sabe o seu nome?'),
 dict(dir='13_Davi_e_Golias', name='Davi e Golias', short=False, ref='1 Samuel 17', title='Davi e Golias: o gigante caiu com uma só pedra | História bíblica animada',
  desc="Quase três metros de altura, armadura de bronze, e um exército inteiro com medo. Até que chegou um jovem pastor com uma funda e cinco pedras lisas. Nesta animação pintada como um quadro a óleo, a história de Davi e Golias — e a frase que muda tudo: a batalha pertence ao Senhor.",
  chapters="00:00 O gigante\n00:15 40 dias de medo\n00:27 Chega Davi\n00:39 Diante do rei Saul\n00:50 Cinco pedras e uma funda\n01:10 A pedra\n01:20 A batalha pertence ao Senhor",
  tags='davi e golias, davi, golias, 1 samuel 17, gigante, coragem, fé, funda, rei saul', hash_yt='#DaviEGolias #HistóriasDaBíblia #Fé',
  hook='Quase 3 metros… e um menino com uma funda 🪨', tt='#davi #golias #daviegolias #bíblia #fé #coragem #cristão #fy', q='Qual gigante você vai enfrentar hoje?'),
 dict(dir='14_Ester', name='Ester', short=False, ref='Livro de Ester', title='Ester: "se eu morrer, morri" — a rainha que salvou seu povo | História bíblica animada',
  desc="Uma jovem órfã que virou rainha. Um decreto para destruir todo o seu povo. E uma lei que podia custar a sua vida. Nesta animação pintada como um quadro a óleo, a história de Ester: o jejum, a entrada no salão do trono, o cetro de ouro — e o dia de morte que virou festa.",
  chapters="00:00 Um decreto de morte\n00:14 A nova rainha\n00:30 O decreto de Hamã\n00:43 Se eu morrer, morri\n00:57 O cetro de ouro\n01:11 O plano de Hamã cai\n01:22 Para um momento como este",
  tags='ester, rainha ester, livro de ester, mardoqueu, hamã, para um momento como este, coragem, purim', hash_yt='#Ester #HistóriasDaBíblia #Coragem',
  hook='Ela podia morrer só por entrar naquela sala 👑', tt='#ester #rainhaester #bíblia #fé #coragem #cristã #fy', q='Qual é a sua coragem hoje?'),
 dict(dir='15_Rute', name='Rute', short=False, ref='Livro de Rute', title='Rute: "aonde você for, eu irei" — a história de fidelidade | História bíblica animada',
  desc="Ela podia voltar para casa. Mas escolheu ficar. Nesta animação pintada como um quadro a óleo, a história de Rute e Noemi: a perda, a estrada para Belém, os campos de Boaz — e uma fidelidade que entrou na linhagem de Jesus.",
  chapters="00:00 Ela escolheu ficar\n00:10 Moabe\n00:22 Orfa e Rute\n00:34 Aonde você for, eu irei\n00:49 Os campos de Boaz\n01:00 Da descendência de Rute, Jesus",
  tags='rute, rute e noemi, livro de rute, boaz, aonde você for eu irei, fidelidade, lealdade, belém', hash_yt='#Rute #HistóriasDaBíblia #Fidelidade',
  hook='Ela podia ir embora… mas disse ISSO 🌾', tt='#rute #ruteenoemi #bíblia #fé #fidelidade #cristã #fy', q='Quem precisa da sua fidelidade hoje?'),
 dict(dir='16_Gideao_e_os_300', name='Gideão e os 300', short=False, ref='Juízes 6–7', title='Gideão e os 300: Deus disse "é gente demais" | História bíblica animada',
  desc="32 mil soldados — e Deus disse: é gente demais. Nesta animação pintada como um quadro a óleo, a história de Gideão: o homem mais fraco da família, escolhido por Deus, que venceu um exército inteiro com 300 homens, trombetas, jarros e tochas.",
  chapters="00:00 32 mil é demais\n00:13 Homem valente?\n00:29 O exército diminui\n00:44 Os 300\n01:01 Jarros e tochas\n01:13 Deus não precisa de muitos",
  tags='gideão, gideão e os 300, juízes 7, 300 de gideão, midianitas, fé, coragem, tochas e jarros', hash_yt='#Gideão #HistóriasDaBíblia #Fé',
  hook='Deus olhou para 32 mil soldados e disse: é DEMAIS ⚔️', tt='#gideão #gideaoeos300 #bíblia #fé #coragem #cristão #fy', q='Você acha que é pouco demais para Deus usar?'),
 dict(dir='17_Lazaro', name='A ressurreição de Lázaro', short=False, ref='João 11', title='Lázaro, vem para fora! Jesus chegou 4 dias "atrasado" | História bíblica animada',
  desc="Lázaro estava morto havia quatro dias. E Jesus chegou atrasado — de propósito. Nesta animação pintada como um quadro a óleo: Marta, Maria, o túmulo, Jesus chorando — e o grito que trouxe um morto de volta à vida.",
  chapters="00:00 Quatro dias depois\n00:18 Dois dias de espera\n00:32 Eu sou a ressurreição e a vida\n00:46 Lázaro, vem para fora!\n01:04 Muitos creram",
  tags='lázaro, ressurreição de lázaro, joão 11, jesus chorou, eu sou a ressurreição e a vida, marta e maria, milagre', hash_yt='#Lázaro #Jesus #Fé',
  hook='Ele estava morto havia 4 dias… e Jesus gritou o nome dele 🪨✨', tt='#lázaro #jesus #milagre #bíblia #fé #cristão #fy', q='O que dentro de você precisa voltar à vida?'),
]
for v in V:
    d = os.path.join(OUT, v['dir']); os.makedirs(d, exist_ok=True)
    tags = v['tags'] + ', ' + TAGS_BASE + (', shorts, shorts bíblicos' if v['short'] else ', história bíblica animada')
    tags = ', '.join(dict.fromkeys(t.strip() for t in tags.split(',')))
    while len(tags) > 490: tags = ', '.join(tags.split(', ')[:-1])
    ch = ('\n\n⏱️ Capítulos\n' + v['chapters']) if not v['short'] else ''
    ig = v['tt'].replace(' #fyp', '').replace(' #fy', '') + ' #reelscristao #versiculododia #palavradedeus #devocional #historiasbiblicas #animacao'
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

{ig}
"""
    open(os.path.join(d, 'textos_para_publicar.md'), 'w', encoding='utf-8').write(md)
print('textos ok:', len(V))
