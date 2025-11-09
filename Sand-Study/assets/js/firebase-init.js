(async function(){
  if(window.__FIREBASE_INITIALIZED__) return;
  function loadScript(src){
    return new Promise((resolve,reject)=>{
      const s = document.createElement('script'); s.src = src; s.async = true;
      s.onload = ()=>resolve(s); s.onerror = (e)=>reject(new Error('failed '+src));
      document.head.appendChild(s);
    });
  }

  function anyFirebaseScriptTagPresent(){
    try{
      const scripts = Array.from(document.getElementsByTagName('script'));
      return scripts.some(s => s.src && /firebase(\.|-|_)app|firebase.*compat/i.test(s.src));
    }catch(e){ return false; }
  }
  try{
    // Load compat SDKs if not present.
    // If another script is likely loading Firebase (script tag exists), wait briefly to avoid duplicate loads.
    if(typeof window.firebase === 'undefined'){
      if(anyFirebaseScriptTagPresent()){
        // wait up to 1s for the other loader to finish
        const start = Date.now();
        while(Date.now() - start < 1000){
          if(typeof window.firebase !== 'undefined') break;
          await new Promise(r => setTimeout(r, 50));
        }
      }
      if(typeof window.firebase === 'undefined'){
        // still not present -> load compat SDKs ourselves
        await loadScript('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
        await loadScript('https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js');
        await loadScript('https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js');
      }
    }
    // Load server-provided config if available
    try{ await loadScript('/assets/js/firebase-config.js'); }catch(_){}
    const cfg = window.FIREBASE_CONFIG || window.__FIREBASE_CONFIG__ || null;
    if(!cfg){
      // no config available — nothing to init here
      console.warn('firebase-init: no firebase config found at /assets/js/firebase-config.js');
      return;
    }
    if(!firebase.apps || !firebase.apps.length) firebase.initializeApp(cfg);
    // ensure auth persistence is LOCAL so sign-in persists across pages and sessions
    try{
      if(firebase && firebase.auth && firebase.auth().setPersistence){
        await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        console.debug('firebase-init: setPersistence LOCAL');
      }
    }catch(e){ console.warn('firebase-init: setPersistence failed', e); }
    window.__FIREBASE_INITIALIZED__ = true;
    // expose init flag for other modules
    console.debug('firebase-init: initialized');
  }catch(e){ console.warn('firebase-init error', e); }
})();
