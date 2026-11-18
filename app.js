(function(){
  var top=document.getElementById('top'),bg=document.getElementById('burger');
  function zamknij(){top.classList.remove('open');bg.setAttribute('aria-expanded','false');bg.setAttribute('aria-label','Otwórz menu')}
  function otworz(){top.classList.add('open');bg.setAttribute('aria-expanded','true');bg.setAttribute('aria-label','Zamknij menu')}
  bg.addEventListener('click',function(){top.classList.contains('open')?zamknij():otworz()});
  document.getElementById('mszuk').addEventListener('click',function(){otworz();setTimeout(function(){document.getElementById('mszuk-in').focus()},120)});
  document.querySelectorAll('.nav a').forEach(function(a){a.addEventListener('click',zamknij)});
  addEventListener('keydown',function(e){if(e.key==='Escape')zamknij()});
  var tk=false;function sc(){if(tk)return;tk=true;requestAnimationFrame(function(){top.classList.toggle('sc',window.pageYOffset>40);tk=false})}
  addEventListener('scroll',sc,{passive:true});

  var links=[].slice.call(document.querySelectorAll('.nav a[href^="#"]'));
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(l){l.classList.toggle('on',l.getAttribute('href')==='#'+e.target.id)})}})},{rootMargin:'-45% 0px -50% 0px'});
    ['start','fizyka','kategorie','ponadczasowe','kieszonkowe','doswiadczenie','dostawa','kontakt'].forEach(function(id){var t=document.getElementById(id);if(t)io.observe(t)});
  }

  // leniwe ladowanie zdjec
  function laduj(i){if(i.dataset.srcset)i.srcset=i.dataset.srcset;i.src=i.dataset.src;i.classList.remove('lz')}
  var lz=[].slice.call(document.querySelectorAll('img.lz'));
  if('IntersectionObserver' in window){var lo=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){laduj(e.target);lo.unobserve(e.target)}})},{rootMargin:'300px 400px'});lz.forEach(function(i){lo.observe(i)})}else lz.forEach(laduj);

  // pasy przesuwane palcem i mysza
  document.querySelectorAll('[data-tor]').forEach(function(tor){
    var down=false,sx=0,sl=0,moved=false;
    function step(){var k=tor.children[0];return k?k.getBoundingClientRect().width+parseFloat(getComputedStyle(tor).columnGap||0):300}
    tor.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse'||tor.scrollWidth<=tor.clientWidth+2)return;down=true;moved=false;sx=e.clientX;sl=tor.scrollLeft});
    addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-sx;if(Math.abs(dx)>4){moved=true;tor.classList.add('drag')}tor.scrollLeft=sl-dx});
    addEventListener('pointerup',function(){if(!down)return;down=false;tor.classList.remove('drag');if(moved){var w=step();tor.scrollTo({left:Math.round(tor.scrollLeft/w)*w,behavior:'smooth'})}setTimeout(function(){moved=false},0)});
    tor.addEventListener('click',function(e){if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);
    tor.addEventListener('dragstart',function(e){e.preventDefault()});
    var nav=document.querySelector('[data-nav="'+tor.id+'"]');
    if(nav){var bs=nav.querySelectorAll('button');
      bs[0].addEventListener('click',function(){tor.scrollBy({left:-step(),behavior:'smooth'})});
      bs[1].addEventListener('click',function(){tor.scrollBy({left:step(),behavior:'smooth'})});
      function st(){bs[0].disabled=tor.scrollLeft<4;bs[1].disabled=tor.scrollLeft+tor.clientWidth>=tor.scrollWidth-4}
      tor.addEventListener('scroll',st,{passive:true});addEventListener('resize',st);st();
    }
  });

  // koszyk - tylko wyglad
  var toast=document.getElementById('toast'),tt;
  document.querySelectorAll('[data-kosz]').forEach(function(b){b.addEventListener('click',function(){
    toast.textContent='To podgląd wyglądu - koszyk i zamówienia zadziałają w nowym sklepie.';
    toast.classList.add('on');clearTimeout(tt);tt=setTimeout(function(){toast.classList.remove('on')},2600);
  })});

  // lightbox
  var lb=document.getElementById('lb'),lim=lb.querySelector('img'),lp=lb.querySelector('p'),grp=[],ix=0,last=null;
  function pokaz(){var b=grp[ix];lim.src=b.getAttribute('data-lb');lim.alt=b.getAttribute('aria-label')||'';lp.textContent=(b.getAttribute('data-t')||'')+(grp.length>1?'  ('+(ix+1)+'/'+grp.length+')':'')}
  document.querySelectorAll('[data-lb]').forEach(function(b){b.addEventListener('click',function(){
    var box=b.closest('[data-tor], .siatka, .kolba');grp=box?[].slice.call(box.querySelectorAll('[data-lb]')):[b];ix=grp.indexOf(b);last=b;pokaz();lb.classList.add('otw');lb.querySelector('.x').focus()})});
  function zam(){lb.classList.remove('otw');lim.removeAttribute('src');if(last)last.focus()}
  lb.querySelector('.x').addEventListener('click',zam);
  lb.querySelector('.p').addEventListener('click',function(){ix=(ix-1+grp.length)%grp.length;pokaz()});
  lb.querySelector('.n').addEventListener('click',function(){ix=(ix+1)%grp.length;pokaz()});
  lb.addEventListener('click',function(e){if(e.target===lb)zam()});
  addEventListener('keydown',function(e){if(!lb.classList.contains('otw'))return;if(e.key==='Escape')zam();if(e.key==='ArrowLeft')lb.querySelector('.p').click();if(e.key==='ArrowRight')lb.querySelector('.n').click()});
  var x0=null;lb.addEventListener('touchstart',function(e){x0=e.touches[0].clientX},{passive:true});
  lb.addEventListener('touchend',function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>50)lb.querySelector(dx<0?'.n':'.p').click();x0=null});
})();
