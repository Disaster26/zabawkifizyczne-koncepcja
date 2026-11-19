(function(){
  var desk=window.matchMedia('(min-width:900px)');
  var ruch=!window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* ---------- kategoria: filtr dzialow i sortowanie ---------- */
  var lista=document.getElementById('lista');
  if(lista){
    var chipy=[].slice.call(document.querySelectorAll('.chip')),karty=[].slice.call(lista.children),kol=karty.slice();
    chipy.forEach(function(c){c.addEventListener('click',function(){
      chipy.forEach(function(x){x.setAttribute('aria-pressed',x===c?'true':'false')});
      var f=c.getAttribute('data-f');
      karty.forEach(function(k){k.hidden=!!f&&k.getAttribute('data-dzial')!==f});
    })});
    var so=document.getElementById('sortuj');
    so.addEventListener('change',function(){
      var v=so.value,arr=kol.slice();
      if(v)arr.sort(function(a,b){var x=+a.dataset.cena,y=+b.dataset.cena;return v==='r'?x-y:y-x});
      arr.forEach(function(k){lista.appendChild(k)});
    });
  }

  /* ---------- przelacznik sklep / katalog ---------- */
  var ws=document.getElementById('w-sklep'),wk=document.getElementById('w-katalog');
  function tryb(t,przewin){
    if(!ws||!wk)return;
    var kat=t==='katalog';
    ws.hidden=kat;wk.hidden=!kat;
    document.querySelectorAll('.tryb a').forEach(function(a){a.setAttribute('aria-current',a.getAttribute('data-tryb')===t?'true':'false')});
    if(kat)ksiazki.forEach(function(k){k.rysuj()});
    if(przewin){var tr=kat?wk.querySelector('.ksiazka'):document.querySelector('.tryb');if(tr){var y=tr.getBoundingClientRect().top+pageYOffset-(document.getElementById('top').offsetHeight)-12;scrollTo({top:Math.max(0,y),behavior:'auto'})}}
  }
  document.querySelectorAll('[data-tryb]').forEach(function(a){a.addEventListener('click',function(e){
    e.preventDefault();var t=a.getAttribute('data-tryb');history.replaceState(null,'','#'+t);tryb(t,true);
  })});

  /* ---------- galeria produktu ---------- */
  var zd=document.getElementById('zdjecia');
  if(zd){
    var figs=[].slice.call(zd.children),minis=[].slice.call(document.querySelectorAll('.miniatury button')),kr=[].slice.call(document.querySelectorAll('.kropki i')),akt=0;
    function zaznacz(i){akt=i;minis.forEach(function(m,j){m.setAttribute('aria-current',j===i?'true':'false')});kr.forEach(function(k,j){k.classList.toggle('on',j===i)})}
    minis.forEach(function(m,i){m.addEventListener('click',function(){zd.scrollTo({left:i*zd.clientWidth,behavior:ruch?'smooth':'auto'});zaznacz(i)})});
    var tk=false;zd.addEventListener('scroll',function(){if(tk)return;tk=true;requestAnimationFrame(function(){tk=false;var i=Math.round(zd.scrollLeft/zd.clientWidth);if(i!==akt)zaznacz(i)})},{passive:true});
    // lupa przy najezdzie myszka - tylko do natywnej rozdzielczosci zdjecia (bez rozciagania)
    figs.forEach(function(f){
      var im=f.querySelector('img'),duze=false;
      f.addEventListener('mouseenter',function(){if(!duze&&matchMedia('(hover:hover)').matches){im.srcset='';im.src=im.getAttribute('data-duze');duze=true}});
      f.addEventListener('mousemove',function(e){
        if(!matchMedia('(hover:hover)').matches)return;
        var s=900/im.getBoundingClientRect().width*(im.style.transform?1:1);
        var w=im.offsetWidth;s=900/w;if(s<1.08)return;
        var r=f.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*100,y=(e.clientY-r.top)/r.height*100;
        f.classList.add('lupa');im.style.transformOrigin=x+'% '+y+'%';im.style.transform='scale('+s.toFixed(3)+')';
      });
      f.addEventListener('mouseleave',function(){f.classList.remove('lupa');im.style.transform=''});
    });
    var pw=document.getElementById('powieksz');
    if(pw)pw.addEventListener('click',function(){figs[akt].click()});
  }
  // ilosc
  var il=document.getElementById('ilosc');
  document.querySelectorAll('[data-il]').forEach(function(b){b.addEventListener('click',function(){var v=Math.min(99,Math.max(1,(parseInt(il.value,10)||1)+(+b.getAttribute('data-il'))));il.value=v})});

  /* ---------- katalog: ksiazka przewracana ---------- */
  var ksiazki=[];
  document.querySelectorAll('[data-ksiazka]').forEach(function(el){
    var mag=[].slice.call(el.querySelectorAll('.ks-mag .str')),N=mag.length,sc=el.querySelector('.ks-scena'),L=el.querySelector('.slot.l'),R=el.querySelector('.slot.r');
    var licz=el.querySelector('.ks-licz'),bp=el.querySelector('[data-ks="-1"]'),bn=el.querySelector('[data-ks="1"]'),spis=[].slice.call(el.querySelectorAll('.ks-spis button'));
    var p=parseInt(el.getAttribute('data-start'),10)||0,anim=false;
    function kl(i){var c=mag[i].cloneNode(true);c.classList.add('on');return c}
    function wstaw(slot,i){slot.innerHTML='';if(i>=0&&i<N)slot.appendChild(kl(i))}
    function lewa(i){return i-(i%2)}
    function opis(){
      if(desk.matches){var a=lewa(p);licz.textContent='Strony '+(a+1)+'-'+Math.min(N,a+2)+' z '+N;bp.disabled=a<=0;bn.disabled=a+2>=N}
      else{licz.textContent='Strona '+(p+1)+' z '+N;bp.disabled=p<=0;bn.disabled=p>=N-1}
      var a2=lewa(p);spis.forEach(function(b){b.classList.toggle('on',+b.getAttribute('data-idz')===a2)});
    }
    function rysuj(){if(desk.matches){var a=lewa(p);wstaw(L,a);wstaw(R,a+1)}else{wstaw(L,p);R.innerHTML=''}opis()}
    function idz(n){
      if(anim)return;
      if(desk.matches){
        var a=lewa(p),b=lewa(n);if(b===a||b<0||b>=N)return;
        if(!ruch){p=b;rysuj();return}
        anim=true;var nx=b>a,fl=document.createElement('div');fl.className='flip '+(nx?'nx':'pv');
        var fr=document.createElement('div');fr.className='fc fr';var bk=document.createElement('div');bk.className='fc bk';
        if(nx){fr.appendChild(kl(a+1));bk.appendChild(kl(b));wstaw(R,b+1)}
        else{fr.appendChild(kl(a));if(b+1<N)bk.appendChild(kl(b+1));wstaw(L,b)}
        fl.appendChild(fr);fl.appendChild(bk);sc.appendChild(fl);
        fl.getBoundingClientRect();
        requestAnimationFrame(function(){fl.style.transform='rotateY('+(nx?-180:180)+'deg)'});
        var kon=function(){fl.removeEventListener('transitionend',kon);p=b;rysuj();fl.remove();anim=false};
        fl.addEventListener('transitionend',kon);setTimeout(function(){if(anim)kon()},1100);
        p=b;opis();
      }else{
        if(n<0||n>=N)return;p=n;rysuj();
        var y=el.getBoundingClientRect().top+pageYOffset-document.getElementById('top').offsetHeight-10;if(y<pageYOffset)scrollTo({top:y});
      }
    }
    bp.addEventListener('click',function(){idz(desk.matches?lewa(p)-2:p-1)});
    bn.addEventListener('click',function(){idz(desk.matches?lewa(p)+2:p+1)});
    spis.forEach(function(b){b.addEventListener('click',function(){idz(+b.getAttribute('data-idz'))})});
    sc.addEventListener('click',function(e){var b=e.target.closest('[data-idz]');if(b)idz(+b.getAttribute('data-idz'))});
    // palcem
    var x0=null,y0=0;
    sc.addEventListener('touchstart',function(e){x0=e.touches[0].clientX;y0=e.touches[0].clientY},{passive:true});
    sc.addEventListener('touchend',function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0,dy=e.changedTouches[0].clientY-y0;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.3)(dx<0?bn:bp).click();x0=null});
    // mysza: przeciagniecie strony
    var mx=null;sc.addEventListener('pointerdown',function(e){if(e.pointerType==='mouse')mx=e.clientX});
    addEventListener('pointerup',function(e){if(mx===null)return;var dx=e.clientX-mx;mx=null;if(Math.abs(dx)>60)(dx<0?bn:bp).click()});
    // klawiatura
    addEventListener('keydown',function(e){if(el.offsetParent===null||document.getElementById('lb').classList.contains('otw'))return;if(e.key==='ArrowRight')bn.click();if(e.key==='ArrowLeft')bp.click()});
    desk.addEventListener('change',rysuj);
    ksiazki.push({rysuj:rysuj});
    rysuj();
  });

  if(ws&&wk){tryb(location.hash==='#katalog'?'katalog':'sklep',location.hash==='#katalog');addEventListener('hashchange',function(){tryb(location.hash==='#katalog'?'katalog':'sklep',true)})}
})();
