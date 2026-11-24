# Ksiazka "I Ty mozesz zostac naukowcem" w przegladarce jak katalog (24.11).
# Strony z PDF autora (jakubowski.edu.pl) zrenderowane do img/naukowiec/sNN-{640,960,1280}.webp.
# Skorupa strony (head, naglowek, stopka) brana z katalog.html, zeby zgadzala sie z recznymi poprawkami podstron.
# Uruchomic ponownie po zmianie katalog.html lub publikacje.html.
import html, re

E = html.escape
PDF = 'i-ty-mozesz-zostac-naukowcem.pdf'
STRONA = 'i-ty-mozesz-zostac-naukowcem.html'
TYTUL = 'I Ty możesz zostać naukowcem'

# tytuly stron (alt i spis); kolejnosc jak w PDF
STRONY = ['Okładka', 'Strona tytułowa', 'Strona redakcyjna', 'Wstęp: jak zostać naukowcem?', 'Metoda naukowa, doświadczenia naukowe',
          'Która kartka spadnie wcześniej?', 'Dlaczego balon „dziwnie” się zachowuje?', 'Jak stworzyć warunki nieważkości?',
          'Czy ziemniaki mogą być źródłem prądu elektrycznego?', 'Co jest źródłem dźwięku w „kobzie”?',
          'Dlaczego saszetka z keczupem tonie i wypływa?', 'Dlaczego się pocimy?', 'Czy słodka cola jest kwaśna?',
          'Jak zwiększyć ciśnienie powietrza?', 'Co produkują liście w dzień, a co w nocy?'] + \
         ['Słownik podpowiedzi do doświadczeń'] * 6 + ['Zakończenie: dla rodziców', 'Czujniki PASCO', 'Czujniki PASCO', 'Spis treści', 'Tył okładki']
SPIS = [(0, 'Okładka'), (3, 'Wstęp'), (4, 'Metoda naukowa'), (5, 'Doświadczenia'), (15, 'Słownik'), (21, 'Dla rodziców'), (24, 'Spis treści')]

CSS = '''
/* ksiazka ze stron PDF: kwadratowe kartki, okladka sama po prawej */
.ks-glowa h1{font-size:clamp(26px,2.4vw,44px)}
.ksiazka.kw{--pw:min(calc((var(--w) - 40px)/2),640px,calc(100svh - var(--hh) - var(--nav) - 150px))}
.ksiazka.kw .slot{aspect-ratio:1}
.ksiazka.kw .slot.pusty{background:transparent}
.ksiazka.kw .ks-scena.jedna::after{display:none}
.str.obraz{background:#fff}
.str.obraz img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;-webkit-user-drag:none}
.ks-autor{color:var(--b);font-weight:700;margin-top:6px}
.ks-palce{display:none;text-align:center;color:var(--mut);font-size:.9rem;margin-top:12px}
@media (min-width:900px){
  .ksiazka.kw{--pw:min(calc((var(--w) - 180px)/2),660px,calc(100svh - var(--hh) - var(--nav) - 40px))}
  .ksiazka.kw .ks-ster button.st{top:calc(var(--pw)*.5 - 30px)}
}
@media screen and (max-width:899px){
  .ksiazka.kw .slot.l{aspect-ratio:1;min-height:0}
  .ksiazka.kw .slot.l .str.on{position:absolute}
  .ks-palce{display:block}
}
'''


def obraz(i):
    n = f'img/naukowiec/s{i + 1:02d}'
    return (f'<article class="str obraz" data-tytul="{E(STRONY[i])}"><img src="{n}-640.webp" '
            f'srcset="{n}-640.webp 640w, {n}-960.webp 960w, {n}-1280.webp 1280w" '
            f'sizes="(min-width:900px) min(660px, 46vw), 94vw" width="1280" height="1280" '
            f'alt="{E(TYTUL)}, strona {i + 1}: {E(STRONY[i])}" loading="lazy" decoding="async" draggable="false"></article>')


def main_html():
    mag = ''.join(obraz(i) for i in range(len(STRONY)))
    spis = ''.join(f'<button type="button" data-idz="{i}">{E(n)}</button>' for i, n in SPIS)
    return f'''<main>
<div class="wrap"><nav class="okr" aria-label="Jesteś tutaj"><ol><li><a href="index.html">Sklep</a></li><li><a href="publikacje.html">Publikacje</a></li><li><span aria-current="page">{E(TYTUL)}</span></li></ol></nav></div>
<section class="ksiazka-sek" aria-labelledby="h-ks"><div class="wrap">
<div class="ks-glowa"><div><h1 id="h-ks">{E(TYTUL)}</h1><p class="ks-autor">Rafał Jakubowski, Mirosław Łoś, Kazimierz Paprzycki &middot; Pomyśl i zrób. Doświadczenia naukowe</p><p>Dziesięć doświadczeń dla dzieci: od pytania badawczego i hipotezy do wniosków, ze słownikiem pojęć i zjawisk. Przewracaj strony strzałkami, klawiaturą albo palcem. Całą książkę pobierzesz w PDF.</p></div></div>
<div class="ksiazka kw" data-ksiazka data-okladka data-start="0">
  <div class="ks-mag" hidden>{mag}</div>
  <div class="ks-scena"><div class="slot l"></div><div class="slot r"></div></div>
  <div class="ks-ster"><button class="st" type="button" data-ks="-1" aria-label="Poprzednia strona"><svg aria-hidden="true"><use href="#lewo"/></svg></button><span class="ks-licz" aria-live="polite"></span><button class="st" type="button" data-ks="1" aria-label="Następna strona"><svg aria-hidden="true"><use href="#prawo"/></svg></button></div>
  <p class="ks-palce">Przesuń palcem, aby przewrócić stronę. Rozsuń palce, aby powiększyć tekst.</p>
  <div class="ks-spis">{spis}</div>
  <div class="ks-akcje"><a class="btn" href="{PDF}" download><svg width="20" height="20" aria-hidden="true"><use href="#pobierz"/></svg>Pobierz książkę PDF (3 MB)</a><a class="btn nieb" href="publikacje.html">Wszystkie publikacje</a></div>
</div></div></section>
</main>'''


s = open('katalog.html', encoding='utf-8').read()
s = re.sub(r'<main>.*?</main>', lambda m: main_html(), s, count=1, flags=re.S)
s = re.sub(r'<title>.*?</title>', f'<title>{E(TYTUL)} - książka PDF | Zabawki Fizyczne</title>', s, count=1)
s = re.sub(r'<meta name="description" content="[^"]*">',
           '<meta name="description" content="Książka Rafała Jakubowskiego, Mirosława Łosia i Kazimierza Paprzyckiego: dziesięć doświadczeń naukowych dla dzieci. Do przeglądania online i pobrania w PDF.">', s, count=1)
s = s.replace('<a href="katalog.html" class="on" aria-current="page">', '<a href="katalog.html">')
s = s.replace('<a href="publikacje.html">Publikacje</a></li><li><a href="pomysl', '<a href="publikacje.html" class="on" aria-current="page">Publikacje</a></li><li><a href="pomysl', 1)
s = s.replace('</style>', CSS + '</style>', 1)
assert 'aria-current="page">Publikacje' in s
open(STRONA, 'w', encoding='utf-8').write(s)

# publikacje.html: karta ksiazki z okladka i przyciskami do przegladarki i PDF
p = open('publikacje.html', encoding='utf-8').read()
stara = re.search(r'<article class="pub"><div class="okl-pdf[^"]*" aria-hidden="true"><svg><use href="#znak"/></svg><b>I Ty możesz zostać naukowcem</b>.*?</article>', p, re.S)
nowa = (f'<article class="pub pub-ks"><a class="okl-img" href="{STRONA}" tabindex="-1" aria-hidden="true"><img src="img/naukowiec/okladka-260.webp" width="260" height="260" alt="" loading="lazy"></a>'
        f'<div class="pub-t"><span class="pub-m">Książka &middot; PDF &middot; 3,0 MB &middot; 26 stron</span><h3><a href="{STRONA}">{E(TYTUL)}</a></h3>'
        '<p>R. Jakubowski, M. Łoś, K. Paprzycki, Ostrów Wielkopolski 2018. Dziesięć doświadczeń naukowych dla dzieci, do przewracania jak książka.</p>'
        f'<div class="pub-a"><a class="btn nieb" href="{STRONA}"><svg width="20" height="20" aria-hidden="true"><use href="#ksiega"/></svg>Czytaj w przeglądarce</a>'
        f'<a class="btn" href="{PDF}" download><svg width="20" height="20" aria-hidden="true"><use href="#pobierz"/></svg>Pobierz</a></div></div></article>')
if stara:
    p = p.replace(stara.group(0), nowa)
else:
    p = re.sub(r'<article class="pub pub-ks">.*?</article>', lambda m: nowa, p, count=1, flags=re.S)
CSS_PUB = '''
/* okladka ksiazki z PDF (kwadrat) */
.okl-img{flex:none;align-self:flex-start;display:block;width:clamp(110px,8.4vw,130px);border-radius:3px 10px 10px 3px;overflow:hidden;box-shadow:inset 6px 0 0 rgba(0,0,0,.18),0 8px 18px rgba(20,33,63,.16)}
.okl-img img{width:100%;height:auto}
.pub h3 a{text-decoration:none}.pub h3 a:hover{text-decoration:underline;text-decoration-color:var(--y);text-decoration-thickness:3px}
@media (max-width:480px){.okl-img{width:88px}}
'''
if '.okl-img{' not in p:
    p = p.replace('</style>', CSS_PUB + '</style>', 1)
p = p.replace('W demo działa pobieranie katalogu-książki. Pozostałe tytuły',
              'W demo działa przeglądanie i pobieranie katalogu-książki oraz książki „I Ty możesz zostać naukowcem”. Pozostałe tytuły')
open('publikacje.html', 'w', encoding='utf-8').write(p)

for f in (STRONA, 'publikacje.html'):
    t = open(f, encoding='utf-8').read()
    assert '—' not in t and '–' not in t, f
print('ok')
