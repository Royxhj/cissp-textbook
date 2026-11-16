/* CISSP 이해형 교재 공통 스크립트. 서버 없이 파일을 직접 열어도 동작한다. */
(function(){
  var $=function(s){return document.querySelector(s)}, $$=function(s){return [].slice.call(document.querySelectorAll(s))};
  var store={get:function(k){try{return localStorage.getItem(k)}catch(e){return null}},set:function(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
  var root=document.documentElement, body=document.body;
  var BASE=body.getAttribute('data-base')||'', ME=body.getAttribute('data-unit')||'';
  var UNITS=window.CISSP_UNITS||[], DOMS=window.CISSP_DOMAINS||{}, INDEX=window.CISSP_INDEX||[];

  // 글자 크기·밝기
  var fs=parseInt(store.get('cissp.fs'),10)||17;
  function applyFs(){fs=Math.max(14,Math.min(23,fs));root.style.setProperty('--fs',fs+'px');store.set('cissp.fs',fs)}
  applyFs();
  $('#fsUp').onclick=function(){fs++;applyFs()}; $('#fsDn').onclick=function(){fs--;applyFs()};
  var th=store.get('cissp.th')||((window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light');
  function applyTh(){root.setAttribute('data-theme',th);store.set('cissp.th',th)}
  applyTh(); $('#thBtn').onclick=function(){th=th==='dark'?'light':'dark';applyTh()};

  function ht(h){var s=h.querySelector('.n');return s?s.textContent+'. '+h.textContent.slice(s.textContent.length).trim():h.textContent.trim()}
  if(window.innerWidth<600) $('#q').placeholder='검색 (예: ALE)';

  // 단원 내 목차
  var heads=$$('article h2[id], article h3[id]').filter(function(h){return !h.closest('details')});
  var toc=$('#toc'), links={};
  heads.forEach(function(h){
    var shortcut=$('#side .side-shortcuts a[href="#'+h.id+'"]');
    if(shortcut){
      links[h.id]=shortcut;
      return;
    }
    var li=document.createElement('li'); if(h.tagName==='H3') li.className='l3';
    var a=document.createElement('a'); a.href='#'+h.id; a.textContent=ht(h); li.appendChild(a); toc.appendChild(li); links[h.id]=a;
  });
  if(!heads.length){ var t0=$('#tocTitle'); if(t0) t0.style.display='none'; }

  // 도메인별 목차
  var dt=$('#dtoc'), curDom=ME?ME.split('.')[0]:'';
  function addUnitShortcut(row,u,anchor,label){
    var link=document.createElement('a');
    link.className='side-unit-shortcut'; link.href=BASE+u.id+'.html#'+anchor;
    link.textContent=label; link.setAttribute('aria-label',u.id+' '+u.s+' '+label);
    row.appendChild(link);
  }
  Object.keys(DOMS).forEach(function(d){
    var det=document.createElement('details'); if(d===curDom) det.open=true;
    var sm=document.createElement('summary'); sm.textContent=d+' '+DOMS[d]; det.appendChild(sm);
    var ul=document.createElement('ul');
    UNITS.filter(function(u){return u.id.split('.')[0]===d}).forEach(function(u){
      var li=document.createElement('li'), el;
      if(u.done){ el=document.createElement('a'); el.href=BASE+u.id+'.html'; el.className='done'; if(u.id===ME) el.className='done here'; }
      else { el=document.createElement('span'); el.title='제작 예정'; }
      el.textContent=u.id.slice(1)+' '+u.s+(u.id===ME?' ← 현재':''); li.appendChild(el);
      if(u.glossary||u.questions){
        var shortcuts=document.createElement('div'); shortcuts.className='side-unit-shortcuts';
        if(u.glossary) addUnitShortcut(shortcuts,u,'glossary','용어');
        if(u.questions) addUnitShortcut(shortcuts,u,'questions','문제 '+u.questions+'개');
        li.appendChild(shortcuts);
      }
      ul.appendChild(li);
    });
    det.appendChild(ul); dt.appendChild(det);
  });

  function closeMenu(){body.classList.remove('open')}
  $('#side').addEventListener('click',function(e){if(e.target.closest('a'))closeMenu()});
  $('#menuBtn').onclick=function(){body.classList.toggle('open')};
  $('#shade').onclick=closeMenu;
  var glossary=$('#glossary + details');
  if(glossary){
    function showGlossary(){glossary.open=true}
    $$('a').filter(function(link){return link.hash==='#glossary' && link.pathname===location.pathname})
      .forEach(function(link){link.addEventListener('click',showGlossary)});
    function showLinkedGlossary(){if(location.hash==='#glossary')showGlossary()}
    showLinkedGlossary();
    window.addEventListener('hashchange',showLinkedGlossary);
  }

  // 현재 위치 표시 + 진행 막대
  var cur=null;
  function onScroll(){
    if(heads.length){
      var y=window.scrollY+110, now=heads[0];
      for(var i=0;i<heads.length;i++){ if(heads[i].getBoundingClientRect().top+window.scrollY<=y) now=heads[i]; else break; }
      if(now!==cur){ if(cur) links[cur.id].classList.remove('cur'); cur=now; var a=links[cur.id]; a.classList.add('cur');
        var sb=$('#side'); if(a.offsetTop<sb.scrollTop+40||a.offsetTop>sb.scrollTop+sb.clientHeight-60) sb.scrollTop=a.offsetTop-sb.clientHeight/2; }
    }
    var d=root.scrollHeight-window.innerHeight; $('#prog').style.width=(d>0?window.scrollY/d*100:0)+'%';
  }
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();

  // 검색: 이 단원(화면의 요소) + 다른 단원(색인 파일)
  var local=[];
  $$('article p, article li, article tr, article pre, article h2, article h3, article summary').forEach(function(el){
    if(el.tagName==='LI'&&el.querySelector('p,ul,ol')) return;
    if(el.closest('.nav,.question-list')) return;
    var t=el.textContent.replace(/\s+/g,' ').trim(); if(t.length<2) return;
    var h=el; while(h&&!((h.tagName==='H2'||h.tagName==='H3')&&h.id)){ h=h.previousElementSibling||h.parentElement; if(h&&h.tagName==='ARTICLE'){h=null;break} }
    local.push({el:el,t:t,l:t.toLowerCase(),hid:h?h.id:'',w:h?ht(h):'머리말',fold:!!el.closest('details.ans')});
  });
  var remote=INDEX.filter(function(r){return r[0]!==ME}).map(function(r){return {u:r[0],hid:r[1],w:r[2],t:r[3],l:r[3].toLowerCase()}});
  var box=$('#results'), q=$('#q');
  function esc(s){return s.replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function row(o,k,label,fn){
    var p=o.l.indexOf(k), s=Math.max(0,p-28), e=Math.min(o.t.length,p+k.length+50);
    var b=document.createElement('button'); b.className='r'; b.type='button';
    b.innerHTML='<div class="w">'+esc(label)+'</div><div class="s">'+(s>0?'…':'')+esc(o.t.slice(s,p))+'<mark>'+esc(o.t.slice(p,p+k.length))+'</mark>'+esc(o.t.slice(p+k.length,e))+(e<o.t.length?'…':'')+'</div>';
    b.onclick=fn; box.appendChild(b);
  }
  function search(){
    var raw=q.value.trim(), k=raw.toLowerCase(); box.innerHTML='';
    if(k.length<2){box.classList.remove('on');return}
    var a=local.filter(function(o){return o.l.indexOf(k)>=0}), b=remote.filter(function(o){return o.l.indexOf(k)>=0});
    if(!a.length&&!b.length){box.innerHTML='<div class="none">“'+esc(raw)+'” 검색 결과가 없습니다.</div>';box.classList.add('on');return}
    var cap=document.createElement('div'); cap.className='none'; cap.textContent=(ME?'이 단원 '+a.length+'건 · ':'')+'다른 단원 '+b.length+'건'+(a.length+b.length>80?' (앞 80건만 표시)':''); box.appendChild(cap);
    a.slice(0,40).forEach(function(o){ row(o,k,(ME?ME+' · ':'')+o.w+(o.fold?' · 접힌 해설 안':''),function(){go(o.el)}) });
    b.slice(0,80-Math.min(a.length,40)).forEach(function(o){ row(o,k,o.u+' · '+o.w+' ↗',function(){ location.href=BASE+o.u+'.html#'+o.hid+'?q='+encodeURIComponent(raw) }) });
    box.classList.add('on');
  }
  function go(el){
    box.classList.remove('on'); closeMenu();
    var d=el.closest('details'); while(d){d.open=true;d=d.parentElement&&d.parentElement.closest('details')}
    el.scrollIntoView({block:'center'}); el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
  }
  q.addEventListener('input',search); q.addEventListener('focus',search);
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'){box.classList.remove('on');q.blur()} if(e.key==='/'&&document.activeElement!==q&&!/INPUT|TEXTAREA/.test(document.activeElement.tagName)){e.preventDefault();q.focus()} });
  document.addEventListener('click',function(e){ if(!box.contains(e.target)&&e.target!==q) box.classList.remove('on') });

  // 다른 단원의 검색 결과에서 넘어온 경우: #제목id?q=검색어
  function fromHash(){
    var h=location.hash.slice(1), i=h.indexOf('?q='); if(i<0) return;
    var hid=h.slice(0,i), k;
    try{k=decodeURIComponent(h.slice(i+3)).toLowerCase()}catch(e){return}
    if(!k)return;
    var hit=local.filter(function(o){return o.hid===hid&&o.l.indexOf(k)>=0})[0]||local.filter(function(o){return o.l.indexOf(k)>=0})[0];
    if(hit) setTimeout(function(){go(hit.el)},60);
  }
  fromHash(); window.addEventListener('hashchange',fromHash);
})();
