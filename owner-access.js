(() => {
  let token = '', notify, timer, busy = false, clientId, panel;
  let current = {owner:false,ownerGroups:[],checks:{},publicDone:0};
  const emit = patch => { current = {...current,...patch}; notify?.(current); if(panel){ panel.querySelector('summary').textContent=current.owner ? 'Owner tools' : 'Owner access'; panel.querySelector('#owner-google-button').hidden=current.owner; panel.querySelector('button').hidden=!current.owner; panel.querySelector('p').hidden=current.owner; } };
  async function refresh() {
    try {
      const res = await fetch('/api/progress', {headers:token ? {Authorization:`Bearer ${token}`} : {}, cache:'no-store'});
      const data = await res.json();
      clientId = data.clientId || clientId;
      if (!res.ok) throw new Error(data.error || 'Unable to load progress.');
      if (token && !data.owner) { token = ''; emit({progressStatus:'This account does not have owner access.'}); }
      emit({owner:!!data.owner,ownerGroups:data.groups || [],checks:data.checks || {},publicDone:data.done,progressStatus:'Saved preparation progress'});
    } catch(e) { emit({owner:false,ownerGroups:[],checks:{},progressStatus:e.message}); }
  }
  function ownerPanel() {
    const box = document.createElement('details');
    box.className = 'owner-signin';
    box.innerHTML = '<summary>Owner access</summary><p>Sign in with an authorized Google account to manage the preparation checklist.</p><div id="owner-google-button"></div><p id="owner-login-status" role="status"></p><button type="button">Sign out</button>';
    const mount = document.getElementById('owner-access-mount');
    if (!mount) return;
    panel = box;
    mount.append(box);
    box.querySelector('button').hidden = !current.owner;
    box.querySelector('button').onclick = () => { token=''; window.google?.accounts.id.disableAutoSelect(); emit({owner:false,ownerGroups:[],checks:{},progressStatus:'Signed out'}); refresh(); };
    box.addEventListener('toggle', async () => {
      if (!box.open || box.dataset.loaded) return;
      await refresh();
      const status = box.querySelector('#owner-login-status');
      if (!clientId) { status.textContent='Owner sign-in needs to be configured by the site administrator.'; return; }
      box.dataset.loaded='true';
      const script = document.createElement('script'); script.src='https://accounts.google.com/gsi/client';
      script.onload = () => {
        window.google.accounts.id.initialize({client_id:clientId,callback:async response => {token=response.credential; await refresh(); status.textContent=current.owner ? 'Owner access enabled. Manage your checklist in Resources.' : 'This account is not authorized, or progress is unavailable.'; if(current.owner){box.open=false;document.getElementById('resources')?.scrollIntoView({behavior:'smooth',block:'start'});}}});
        window.google.accounts.id.renderButton(box.querySelector('#owner-google-button'),{theme:'outline',size:'large'});
      };
      script.onerror = () => {status.textContent='Google sign-in could not load. Please try again.';delete box.dataset.loaded;};
      document.head.append(script);
    });
  }
  window.OwnerProgress = {
    connect(fn) { notify=fn; refresh(); if(!timer) {timer=setInterval(() => {if(!busy && !document.hidden) refresh();},30000); ownerPanel();} },
    async toggle(id, done) {
      if (!current.owner || !token || busy) return;
      busy=true; emit({progressStatus:'Saving…'});
      try {
        const res=await fetch('/api/progress',{method:'PATCH',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify({id,done})});
        const data=await res.json();
        if(!res.ok) throw new Error(data.error || 'Save failed.');
        emit({checks:data.checks,publicDone:data.done,progressStatus:'Saved preparation progress'});
      } catch(e) { emit({progressStatus:e.message+' Your change was not saved.'}); }
      finally {busy=false;}
    }
  };
})();
