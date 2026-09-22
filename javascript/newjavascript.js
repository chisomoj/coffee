// Verdant Brew — shop, pastries, cart, pour animation
const COFFEES = [
  { id:'eth', name:'Ethiopian Yirgacheffe', notes:'Jasmine • Apricot • Honey', price:21, roast:'light', tag:'Best Seller',
    img:'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=800&auto=format&fit=crop' },
  { id:'hui', name:'Colombia Huila Reserve', notes:'Cacao Nib • Cherry • Caramel', price:19, roast:'medium', tag:'Single Origin',
    img:'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop' },
  { id:'chi', name:'Chiapas Dark Roast', notes:'Dark Chocolate • Smoke • Molasses', price:18, roast:'dark', tag:'Espresso Pick',
    img:'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=800&auto=format&fit=crop' },
  { id:'house', name:'Verdant House Blend', notes:'Hazelnut • Brown Sugar • Orange', price:17, roast:'medium', tag:'Crowd Favorite',
    img:'https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=800&auto=format&fit=crop' },
  { id:'decaf', name:'Swiss Water Decaf', notes:'Cocoa • Graham • Dried Fig', price:18, roast:'medium', tag:'Chemical-Free',
    img:'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800&auto=format&fit=crop' },
  { id:'cold', name:'Cold Brew Coarse Ground', notes:'Black Cherry • Vanilla • Low Acid', price:20, roast:'dark', tag:'Summer',
    img:'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=800&auto=format&fit=crop' },
];

const PASTRIES = [
  { id:'cro', name:'Butter Croissant', desc:'72-hour laminated, French butter', price:4.5, cat:'sweet', tag:'Baked 5am',
    img:'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=800&auto=format&fit=crop' },
  { id:'cardamom', name:'Cardamom Morning Bun', desc:'Swedish-style, pearl sugar', price:5.0, cat:'sweet', tag:'Staff Pick',
    img:'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop' },
  { id:'muffin', name:'Blueberry Oat Muffin', desc:'Organic oats, lemon glaze', price:4.0, cat:'sweet', tag:'Whole Grain',
    img:'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?q=80&w=800&auto=format&fit=crop' },
  { id:'scone', name:'Cheddar & Herb Scone', desc:'Aged cheddar, rosemary', price:5.5, cat:'savory', tag:'Savory',
    img:'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?q=80&w=800&auto=format&fit=crop' },
  { id:'vegban', name:'Vegan Banana Bread', desc:'Flax, walnut, coconut sugar', price:4.5, cat:'vegan', tag:'Vegan',
    img:'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?q=80&w=800&auto=format&fit=crop' },
  { id:'vegavo', name:'Vegan Avocado Toast Box', desc:'Sourdough, seed crunch', price:8.5, cat:'vegan', tag:'Vegan',
    img:'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?q=80&w=800&auto=format&fit=crop' },
];

let cart = [];
let coffeeFilter = 'all';
let pastryFilter = 'all';

const $ = (s) => document.querySelector(s);
const money = (n) => '$' + n.toFixed(2);

function toast(msg){
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._h);
  t._h = setTimeout(()=> t.classList.remove('show'), 2400);
}

function renderCoffees(){
  const grid = $('#coffeeGrid');
  const q = ($('#searchInput')?.value || '').toLowerCase();
  grid.innerHTML = COFFEES
    .filter(c => coffeeFilter==='all' || c.roast===coffeeFilter)
    .filter(c => !q || (c.name+' '+c.notes).toLowerCase().includes(q))
    .map(c => `
    <article class="card reveal visible">
      <img src="${c.img}" alt="${c.name}" loading="lazy">
      <div class="card-body">
        <span class="badge">${c.tag} • ${c.roast}</span>
        <h3>${c.name}</h3>
        <p class="notes">${c.notes}</p>
        <div class="price-row"><span class="price">${money(c.price)} <small style="font-weight:400">/ 250g</small></span>
        <button class="add-btn" data-add="${c.id}">Add +</button></div>
      </div>
    </article>`).join('') || '<p class="muted">No coffees match your search.</p>';
}

function renderPastries(){
  const grid = $('#pastryGrid');
  const q = ($('#searchInput')?.value || '').toLowerCase();
  grid.innerHTML = PASTRIES
    .filter(p => pastryFilter==='all' || p.cat===pastryFilter || (pastryFilter==='sweet' && p.cat==='sweet'))
    .filter(p => !q || (p.name+' '+p.desc).toLowerCase().includes(q))
    .map(p => `
    <article class="card reveal visible">
      <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=800&auto=format&fit=crop'">
      <div class="card-body">
        <span class="badge ${p.cat}">${p.tag} • ${p.cat}</span>
        <h3>${p.name}</h3>
        <p class="notes">${p.desc}</p>
        <div class="price-row"><span class="price">${money(p.price)}</span>
        <button class="add-btn" data-add="${p.id}">Add +</button></div>
      </div>
    </article>`).join('') || '<p class="muted">No pastries in this category today.</p>';
}

function findProduct(id){
  return [...COFFEES, ...PASTRIES, {id:'box', name:'Pastry + Coffee Box', price:19, img:'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?q=80&w=800&auto=format&fit=crop'}].find(p=>p.id===id);
}

function addToCart(id){
  const ex = cart.find(i=>i.id===id);
  if(ex) ex.qty++;
  else cart.push({id, qty:1});
  updateCart();
  const p = findProduct(id);
  toast(`Added ${p.name} to basket 🧺`);
  openCart();
}

function cartTotal(){
  return cart.reduce((s,i)=> s + findProduct(i.id).price * i.qty, 0);
}

function updateCart(){
  const count = cart.reduce((s,i)=>s+i.qty,0);
  $('#cartCount').textContent = count;
  const box = $('#cartItems');
  if(!cart.length){
    box.innerHTML = '<p class="muted">Your basket is empty. Add a fresh roast or warm croissant 🥐</p>';
  } else {
    box.innerHTML = cart.map(i=>{
      const p = findProduct(i.id);
      return `<div class="cart-item">
        <img src="${p.img}" alt="${p.name}">
        <div><strong>${p.name}</strong><br><span class="muted">${money(p.price)} each</span>
          <div class="qty"><button data-dec="${i.id}">−</button><span>${i.qty}</span><button data-inc="${i.id}">+</button></div>
        </div>
        <strong>${money(p.price*i.qty)}</strong>
      </div>`;
    }).join('');
  }
  const total = cartTotal();
  $('#cartTotal').textContent = money(total);
  $('#shipMsg').textContent = total >= 50 ? '🎉 You unlocked FREE carbon-neutral shipping!' : `Add ${money(50-total)} more for free shipping`;
}

function openCart(){
  $('#cartDrawer').classList.add('open');
  $('#cartDrawer').setAttribute('aria-hidden','false');
  $('#overlay').hidden = false;
}
function closeCart(){
  $('#cartDrawer').classList.remove('open');
  $('#cartDrawer').setAttribute('aria-hidden','true');
  $('#overlay').hidden = true;
}

// Pour animation controls
function restartPour(){
  const scene = $('#pourScene');
  scene.style.animation = 'none';
  // restart child animations by re-triggering reflow
  const els = scene.querySelectorAll('.kettle-wrap,.stream,.coffee-fill,.pour-progress-fill,.splash span');
  els.forEach(el=>{ el.style.animation='none'; void el.offsetWidth; el.style.animation=''; });
  void scene.offsetWidth;
  scene.style.animation='';
  $('#pourTimer').textContent = '0:00';
  toast('Brewing fresh pour-over… ☕');
}

let seconds = 0;
setInterval(()=>{
  seconds = (seconds+1)%480;
  const m = Math.floor(seconds/60), s = String(seconds%60).padStart(2,'0');
  const el = $('#pourTimer');
  if(el) el.textContent = `${m}:${s}`;
}, 1000);

document.addEventListener('DOMContentLoaded', ()=>{
  renderCoffees();
  renderPastries();
  updateCart();

  // filters
  document.querySelectorAll('[data-filter]').forEach(b=> b.addEventListener('click', ()=>{
    document.querySelectorAll('[data-filter]').forEach(x=>x.classList.remove('active'));
    b.classList.add('active'); coffeeFilter = b.dataset.filter; renderCoffees();
  }));
  document.querySelectorAll('[data-pastryfilter]').forEach(b=> b.addEventListener('click', ()=>{
    document.querySelectorAll('[data-pastryfilter]').forEach(x=>x.classList.remove('active'));
    b.classList.add('active'); pastryFilter = b.dataset.pastryfilter; renderPastries();
  }));
  document.querySelectorAll('[data-ordertype]').forEach(b=> b.addEventListener('click', ()=>{
    document.querySelectorAll('[data-ordertype]').forEach(x=>x.classList.remove('active'));
    b.classList.add('active'); toast(`Order type: ${b.textContent.trim()}`);
  }));

  // add / qty (delegation)
  document.addEventListener('click', (e)=>{
    const add = e.target.closest('[data-add]');
    if(add) addToCart(add.dataset.add);
    const inc = e.target.closest('[data-inc]');
    if(inc){ cart.find(i=>i.id===inc.dataset.inc).qty++; updateCart(); }
    const dec = e.target.closest('[data-dec]');
    if(dec){
      const it = cart.find(i=>i.id===dec.dataset.dec);
      it.qty--; if(it.qty<=0) cart = cart.filter(i=>i.id!==it.id);
      updateCart();
    }
  });

  $('#boxBtn').addEventListener('click', ()=> addToCart('box'));
  document.querySelectorAll('.sub-btn').forEach(b=> b.addEventListener('click', ()=>{
    toast(`${b.dataset.plan} selected — checkout to confirm 🎉`);
    $('#modalSummary').textContent = b.dataset.plan;
    $('#checkoutModal').hidden = false;
  }));

  // cart open/close
  $('#cartOpen').addEventListener('click', openCart);
  $('#cartClose').addEventListener('click', closeCart);
  $('#continueBtn').addEventListener('click', closeCart);
  $('#overlay').addEventListener('click', closeCart);

  // checkout
  $('#checkoutBtn').addEventListener('click', ()=>{
    if(!cart.length){ toast('Your basket is empty — add something tasty first'); return; }
    $('#modalSummary').textContent = `${cart.reduce((s,i)=>s+i.qty,0)} items • Total ${money(cartTotal())}`;
    $('#checkoutModal').hidden = false;
  });
  function closeModal(){
    $('#checkoutModal').hidden = true;
  }
  $('#modalClose').addEventListener('click', (e)=>{ e.stopPropagation(); closeModal(); });
  $('#checkoutModal').addEventListener('click', (e)=>{ if(e.target.id==='checkoutModal') closeModal(); });
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape'){ closeModal(); closeCart(); } });
  $('#checkoutForm').addEventListener('submit', (e)=>{
    e.preventDefault();
    $('#checkoutModal').hidden = true; closeCart();
    toast('Order placed! See you at pickup ☕🥐');
    cart = []; updateCart(); e.target.reset();
  });

  // search
  $('#searchBtn').addEventListener('click', ()=>{
    const bar = $('#searchBar'); bar.hidden = !bar.hidden;
    if(!bar.hidden) $('#searchInput').focus();
  });
  $('#searchInput')?.addEventListener('input', ()=>{ renderCoffees(); renderPastries(); });

  // mobile nav
  $('#hamburger').addEventListener('click', ()=>{
    const nav = $('#mainNav');
    const open = nav.classList.toggle('open');
    $('#hamburger').setAttribute('aria-expanded', open);
  });
  document.querySelectorAll('#mainNav a').forEach(a=> a.addEventListener('click', ()=> $('#mainNav').classList.remove('open')));

  // pour controls
  $('#pourBtn').addEventListener('click', restartPour);
  const strength = $('#strength'), label = $('#strengthLabel');
  strength.addEventListener('input', ()=>{
    label.textContent = strength.value==='1' ? 'Light & floral' : strength.value==='2' ? 'Balanced' : 'Bold & syrupy';
    $('#pourStream').style.width = strength.value==='1' ? '7px' : strength.value==='2' ? '10px' : '14px';
  });

  // newsletter
  $('#newsForm').addEventListener('submit', (e)=>{
    e.preventDefault();
    toast(`Welcome! 15% code sent to ${$('#newsEmail').value} 🌱`);
    e.target.reset();
  });
  $('#tourBtn').addEventListener('click', ()=> toast('Roastery tours: Saturdays 10am — book in store 🎥'));

  // reveal on scroll
  const io = new IntersectionObserver((es)=> es.forEach(en=>{ if(en.isIntersecting) en.target.classList.add('visible'); }), {threshold:.12});
  document.querySelectorAll('.card, .review, .value').forEach(el=>{ el.classList.add('reveal'); io.observe(el); });
});
