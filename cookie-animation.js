(() => {
  const ING = [
    ['Flour','powder','#f2e7d5','A soft flour cloud'],
    ['White sugar','grain','#fffef8','A sparkling sugar shower'],
    ['Brown sugar','clump','#a66a36','Soft brown-sugar clumps'],
    ['Baking powder','fine','#fffafa','A spoonful of fine powder'],
    ['Salt','crystal','#e5edf3','A little sprinkle of salt'],
    ['Butter','butter','#f6d568','Butter cubes tumble in'],
    ['Vanilla extract','liquid','#673513','A ribbon of vanilla'],
    ['Chocolate chips','chip','#3c2419','Chocolate chips tumble in']
  ];
  const caption = d => d === 0 ? 'Ready when we are. Let’s bake!' : d <= 8 ? ING[d-1][3] : d === 9 ? 'Mixing everything into cookie dough' : d === 10 ? 'Into the oven at 350°F' : d === 11 ? 'Fresh from the oven!' : d <= 14 ? `Chocolate chip ${d-11} of 3` : d < 21 ? `Crunch! Bite ${d-14} of 7` : 'Preparation complete. Every last bite!';
  function scene(d) {
    const h = window.React.createElement;
    const el = (tag,props,...kids) => h(tag,props,...kids.flat());
    const circle = (x,y,r,fill,props={}) => el('circle',{cx:x,cy:y,r,fill,...props});
    const chip = (x,y,size=8,props={}) => el('path',{d:`M${x-size} ${y+size/2} Q${x-size} ${y-size/3} ${x} ${y-size} Q${x+size/4} ${y-size/4} ${x+size} ${y+size/2} Q${x} ${y+size} ${x-size} ${y+size/2}`,fill:'#3c2419',stroke:'#24140e',strokeWidth:1,...props});
    const particles = (kind,color,settled=false,index=0) => Array.from({length:kind==='butter'?5:kind==='chip'?12:kind==='clump'?15:kind==='liquid'?9:40},(_,j) => {
      const x=settled ? 115+(j*47+index*23)%174 : 152+(j*31)%90;
      const y=settled ? 186+(j*17+index*7)%39 : 100+(j*13)%35;
      const props={key:j,className:settled?'':'ingredient-particle',style:settled?{}:{'--fall':`${78+(j*11)%43}px`,'--drift':`${(j*7)%37-18}px`,animationDelay:`${.25+j*.035}s`}};
      if(kind==='butter') return el('rect',{x,y,width:20,height:16,rx:3,fill:color,stroke:'#d1a747',strokeWidth:1.5,...props});
      if(kind==='chip') return el('g',props,chip(x,y,settled?6:8));
      if(kind==='liquid') return el('path',{d:`M${x} ${y-10} Q${x-8} ${y+5} ${x} ${y+7} Q${x+8} ${y+5} ${x} ${y-10}`,fill:color,...props});
      if(kind==='clump') return el('path',{d:`M${x-8} ${y} l3 -7 8 1 5 7 -3 6 -10 1Z`,fill:color,stroke:'#8b542c',strokeWidth:1,...props});
      if(kind==='crystal'||kind==='grain') return el('rect',{x,y,width:kind==='crystal'?3:2,height:kind==='crystal'?4:2,fill:color,stroke:'#c1b9a7',strokeWidth:.4,transform:`rotate(${j*19} ${x} ${y})`,...props});
      return circle(x,y,kind==='powder'?3+(j%4):1.5,color,props);
    });
    const kids=[el('defs',{},el('linearGradient',{id:'bowl-glass',x2:0,y2:1},el('stop',{stopColor:'#fce7f0',stopOpacity:.15}),el('stop',{offset:1,stopColor:'#e7a4c4',stopOpacity:.6})),el('radialGradient',{id:'baked-cookie'},el('stop',{stopColor:'#efd09a'}),el('stop',{offset:.8,stopColor:'#dba364'}),el('stop',{offset:1,stopColor:'#b7763b'})),el('clipPath',{id:'bowl-inside'},el('path',{d:'M66 172 Q82 260 200 264 Q318 260 334 172Z'}))),el('ellipse',{cx:200,cy:280,rx:145,ry:11,fill:'#e5d8d2',opacity:.5})];
    if(d<=9) {
      kids.push(el('ellipse',{cx:200,cy:177,rx:139,ry:30,fill:'#f1dce5',stroke:'#b97696',strokeWidth:2}));
      const layers=[];
      for(let i=0;i<Math.min(d,8);i++) {
        const [name,kind,color]=ING[i];
        layers.push(el('g',{key:name},el('ellipse',{cx:200+(i%2?12:-10),cy:238-i*5,rx:90-i*3,ry:16,fill:color}),particles(kind,color,true,i)));
      }
      if(d===9) layers.splice(0,layers.length,el('ellipse',{cx:200,cy:219,rx:120,ry:43,fill:'#d7ac73'}),el('g',{className:'dough-swirl'},el('path',{d:'M120 220 C140 178 280 185 278 220 C270 246 156 246 160 217 C165 201 247 203 240 219',fill:'none',stroke:'#b78149',strokeWidth:6,strokeLinecap:'round'}),[140,190,220,270].map((x,i)=>chip(x,210+i%2*20,6))));
      kids.push(el('g',{clipPath:'url(#bowl-inside)'},layers));
      if(d>0&&d<=8) {
        const [name,kind,color]=ING[d-1];
        const source=kind==='liquid' ? [el('rect',{x:145,y:28,width:31,height:48,rx:5,fill:'#623c24',stroke:'#402215',strokeWidth:2}),el('rect',{x:152,y:12,width:17,height:18,rx:2,fill:'#33221c'}),el('rect',{x:148,y:42,width:25,height:19,rx:2,fill:'#fff2cf'}),el('text',{x:160,y:55,textAnchor:'middle',fontSize:8,fill:'#623c24'},'VANILLA')] : kind==='butter' ? [el('ellipse',{cx:150,cy:63,rx:44,ry:9,fill:'#bde5ef',stroke:'#6b9cab',strokeWidth:2}),[123,145,165].map(x=>el('rect',{x,y:43,width:19,height:16,rx:3,fill:color,stroke:'#d1a747'}))] : [el('path',{d:'M111 20 L176 20 L184 76 Q148 90 112 76Z',fill:kind==='powder'?'#f3e1bf':kind==='clump'?'#bc874e':kind==='chip'?'#f7c9e0':'#e4edf0',stroke:'#8d7869',strokeWidth:2}),el('rect',{x:117,y:39,width:56,height:24,rx:4,fill:'#fff8ee'}),el('text',{x:145,y:54,textAnchor:'middle',fontSize:name.length>10?7:9,fill:'#503626',fontWeight:700},name.toUpperCase())];
        kids.push(el('g',{className:'ingredient-source'},source),particles(kind,color));
        if(kind==='powder'||kind==='fine') kids.push(el('g',{className:'flour-puff'},[0,1,2,3,4].map(i=>circle(170+i*16,184-i%2*8,15+i%2*7,'#fff9ed',{opacity:.7}))));
        if(kind==='liquid') kids.push(el('path',{d:'M184 78 Q214 122 203 177',fill:'none',stroke:color,strokeWidth:5,strokeLinecap:'round',className:'vanilla-stream'}));
      }
      if(d===9) kids.push(el('g',{className:'mixing-whisk'},el('path',{d:'M224 68 L202 193',stroke:'#855839',strokeWidth:13,strokeLinecap:'round'}),[12,22,32].map(rx=>el('ellipse',{cx:199,cy:206,rx,ry:31,fill:'none',stroke:'#867f7b',strokeWidth:2.5}))));
      kids.push(el('path',{d:'M62 174 Q80 266 200 268 Q320 266 338 174 Q200 218 62 174Z',fill:'url(#bowl-glass)',stroke:'#b97696',strokeWidth:3}),el('path',{d:'M82 192 Q100 243 147 250',fill:'none',stroke:'#fff',strokeWidth:6,opacity:.65,strokeLinecap:'round'}),el('ellipse',{cx:200,cy:174,rx:138,ry:29,fill:'none',stroke:'#b97696',strokeWidth:4}));
    } else if(d===10) {
      kids.push(el('g',{className:'oven-enter'},el('rect',{x:78,y:35,width:244,height:230,rx:20,fill:'#bde5ef',stroke:'#5895a6',strokeWidth:3}),[110,145,180].map(x=>circle(x,62,8,'#fff')),el('text',{x:269,y:68,fill:'#2c4b52',fontSize:17,textAnchor:'middle'},'350°F'),el('rect',{x:99,y:92,width:202,height:148,rx:12,fill:'#3d291f'}),el('rect',{x:105,y:98,width:190,height:135,rx:8,fill:'#f4ab5f',className:'oven-heat'}),el('path',{d:'M114 209H286',stroke:'#aba5a0',strokeWidth:8}),[148,200,252].map(x=>el('ellipse',{cx:x,cy:194,rx:22,ry:13,fill:'#d7a76e',className:'oven-cookie'})),el('path',{d:'M122 106H278',stroke:'#d6edf3',strokeWidth:8,strokeLinecap:'round'})));
    } else {
      const bites=Math.min(7,Math.max(0,d-14));
      const centers=[[301,90],[300,190],[239,249],[139,242],[93,162],[130,70]];
      kids.push(el('defs',{},el('mask',{id:'cookie-bites',maskUnits:'userSpaceOnUse',x:0,y:0,width:400,height:300},el('rect',{width:400,height:300,fill:'white'}),centers.slice(0,bites).map(([x,y],i)=>el('g',{key:i,className:i===bites-1?'cookie-bite':''},circle(x,y,48,'black'),[-1,0,1].map(n=>circle(x-27,y+n*25,19,'black')))),bites===7?el('rect',{width:400,height:300,fill:'black'}):null)));
      kids.push(el('g',{mask:'url(#cookie-bites)'},el('g',{className:d===11?'fresh-cookie':''},circle(200,150,110,'url(#baked-cookie)',{stroke:'#a76e38',strokeWidth:3}),Array.from({length:65},(_,i)=>circle(120+i*37%160,74+i*23%153,1+i%3,'#ad753e',{opacity:.22})),[0,1,2].slice(0,Math.max(0,d-11)).map((i)=>el('g',{key:i,className:d===12+i?'chip-pop':''},chip([155,240,190][i],[110,135,205][i],15))))));
      if(bites) kids.push(el('g',{className:'cookie-crumbs'},Array.from({length:9},(_,i)=>circle(105+i*29%190,257+i*7%24,2+i%3,'#c08b51'))));
      if(bites===7) kids.push(el('text',{x:200,y:149,textAnchor:'middle',fontFamily:'Fredoka, sans-serif',fontWeight:600,fontSize:28,fill:'#583e2e',className:'chip-pop'},'Every last bite!'));
    }
    return el('svg',{key:d,viewBox:'0 0 400 300',width:'100%',height:'100%',role:'img','aria-label':caption(d),className:'cookie-scene'},kids);
  }
  window.CookieBake={scene,caption};
})();
