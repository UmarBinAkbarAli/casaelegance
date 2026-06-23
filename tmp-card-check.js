const { chromium } = require('C:/Users/sysadmin/AppData/Local/npm-cache/_npx/420ff84f11983ee5/node_modules/playwright');
const URL='http://127.0.0.1:8080/index.html';
(async()=>{
  const b=await chromium.launch();const c=await b.newContext({viewport:{width:1440,height:900}});const p=await c.newPage();
  const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
  let all=[];
  for(let i=1;i<=6;i++){
    await p.goto(URL,{waitUntil:'load'});
    await p.waitForSelector('[data-hero-viewport] .swiper-slide-active');
    await p.waitForTimeout(1100); // allow reveal transition (0.75s+delay)
    const r=await p.evaluate(()=>{
      const active=document.querySelector('[data-hero-viewport] .swiper-slide-active');
      const hasIsActive=active.classList.contains('is-active');
      const title=active.querySelector('.mrittik-hero__title');
      const eyebrow=active.querySelector('.mrittik-hero__eyebrow');
      const btn=active.querySelector('.mrittik-hero__button');
      const op=el=>el?parseFloat(getComputedStyle(el).opacity):null;
      return {hasIsActive, titleOp:op(title), eyebrowOp:op(eyebrow), btnOp:op(btn), titleText:title?.textContent?.slice(0,24),
        isActiveCount:document.querySelectorAll('[data-hero-viewport] .mrittik-hero__slide.is-active').length};
    });
    const ok = r.hasIsActive && r.titleOp>0.95 && r.eyebrowOp>0.95 && r.btnOp>0.95 && r.isActiveCount===1;
    console.log(`${ok?'PASS':'FAIL'} #${i} is-active=${r.hasIsActive} count=${r.isActiveCount} titleOp=${r.titleOp} eyebrowOp=${r.eyebrowOp} btnOp=${r.btnOp} "${r.titleText}"`);
    all.push(ok);
    if(i===1) await p.screenshot({path:'tmp-card.png'});
  }
  console.log('\nSUMMARY:', all.every(Boolean)?'ALL PASS ✅':'FAIL ❌', '| errors:', errs.length?errs:'none');
  await b.close();
})();
