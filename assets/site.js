(() => {
  'use strict';
  const ns = 'http://www.w3.org/2000/svg';
  const make = (tag, attrs, text) => {
    const el = document.createElementNS(ns, tag);
    Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
    if (text) el.textContent = text;
    return el;
  };
  // Both panels use the same natural roots. Only the dyed lengths differ.
  const createDiagram = (svg, blended) => {
    const strands = [];
    svg.append(make('text', {x: 150, y: 23, 'text-anchor':'middle', fill:'#625c53', 'font-size':13}, '根元'));
    for(let i=0; i<24; i++) {
      const gray = [1,2,5,8,9,12,15,16,19,22].includes(i);
      const x = 34 + i * 9.7;
      const tip = make('line', {x1:x, x2:x, y1:40, y2:212, stroke:blended ? (gray ? '#d9d2c3' : '#625c53') : '#625c53', 'stroke-width':9.9});
      const root = make('line', {x1:x, x2:x, y1:40, y2:40, stroke:gray ? '#faf8f2' : '#625c53', 'stroke-width':9.9});
      svg.append(tip, root);
      strands.push(root);
    }
    const boundary = make('line', {x1:20,x2:282,y1:40,y2:40,stroke:'#706a5b','stroke-width':1,'stroke-dasharray':'4 4'});
    const bracket = make('path', {fill:'none',stroke:'#706a5b','stroke-width':1.2});
    svg.append(boundary, bracket);
    svg.append(make('text',{x:150,y:234,'text-anchor':'middle',fill:'#625c53','font-size':12}, blended ? '明るさをなじませた毛先' : '暗く染めた毛先'));
    return (week) => {
      const y = 40 + week * 8;
      strands.forEach(line=>line.setAttribute('y2', y));
      boundary.setAttribute('y1',y); boundary.setAttribute('y2',y);
      boundary.setAttribute('opacity',week ? '.65':'0');
      bracket.setAttribute('d',`M 25 40 H 19 V ${y} H 25`);
      bracket.setAttribute('opacity',week ? '1':'0');
    };
  };
  const input = document.getElementById('weeks');
  if(input) {
    const setDye = createDiagram(document.getElementById('cmpDye'), false);
    const setBlend = createDiagram(document.getElementById('cmpBlur'), true);
    const presets = [...document.querySelectorAll('[data-week]')];
    const update = () => {
      const week = Number(input.value);
      const label = week ? `${week}週間後` : '染めた当日';
      document.getElementById('weeksOut').textContent=label;
      input.setAttribute('aria-valuetext',label);
      setDye(week); setBlend(week);
      document.getElementById('txtDye').textContent=week ? '白い根元と暗い毛先の境目が見えやすくなります。' : '白髪をカバーして、均一な暗い髪色に。';
      document.getElementById('txtBlur').textContent=week ? '白髪と毛先の明るさが近く、境目がやわらかく見えます。' : '白髪の明るさに合わせて、毛先にも明るさを残します。';
      presets.forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.week)===week)));
    };
    input.addEventListener('input',update);
    presets.forEach(button=>button.addEventListener('click',()=>{input.value=button.dataset.week;update();}));
    update();
  }
  const dialog=document.getElementById('caseDialog');
  if(dialog && typeof dialog.showModal==='function') {
    document.querySelectorAll('[data-case]').forEach(link=>link.addEventListener('click',event=>{
      if(event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const card=link.closest('.case');
      const photos=card.querySelectorAll('.case-image img');
      document.getElementById('dialogTitle').textContent=card.querySelector('h3').textContent;
      document.getElementById('dialogDescription').textContent=card.querySelector('.case-copy h3 + p').textContent;
      ['dialogBefore','dialogAfter'].forEach((id,i)=>{const image=document.getElementById(id);image.src=photos[i].src;image.alt=photos[i].alt;});
      dialog.showModal();
    }));
    dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
    dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left || event.clientX>rect.right || event.clientY<rect.top || event.clientY>rect.bottom)dialog.close();}});
  }
})();
