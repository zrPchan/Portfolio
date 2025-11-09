// main.js
// Top-page login modal + Firebase email/password auth (index.html)

// Dynamically load Firebase compat SDKs and optional local config at /assets/js/firebase-config.js
function loadScript(src){
	return new Promise((resolve, reject)=>{
		const s = document.createElement('script');
		s.src = src;
		s.async = true;
		s.onload = ()=>resolve(s);
		s.onerror = (e)=>reject(new Error('Failed to load '+src));
		document.head.appendChild(s);
	});
}

async function tryInitFirebase(){
	if(typeof window.firebase !== 'undefined') return true;
	try{
		// load compat SDKs (stable recommended version)
		await loadScript('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
		await loadScript('https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js');
		await loadScript('https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js');
		// try to load local config (optional) which should set window.FIREBASE_CONFIG
		try{
			await loadScript('/assets/js/firebase-config.js');
		}catch(_){
			// no local config — that's fine, we just won't initialize automatically
		}
		if(window.FIREBASE_CONFIG && typeof firebase !== 'undefined'){
			try{ firebase.initializeApp(window.FIREBASE_CONFIG); console.info('Firebase initialized from /assets/js/firebase-config.js'); return true; }catch(e){ console.warn('Firebase init failed', e); }
		}
	}catch(e){ console.warn('Failed to load Firebase SDKs', e); }
	return false;
}

document.addEventListener('DOMContentLoaded', async ()=>{
	// attempt background init; main auth handlers will still check for window.firebase
	tryInitFirebase().then(ok=>{
		if(!ok) console.info('Firebase not initialized. To enable auth, create /assets/js/firebase-config.js based on assets/js/firebase-config.example.js');
	});
	const btn = document.getElementById('topBtnSignIn');
	const modal = document.getElementById('loginModal');
	const btnClose = document.getElementById('topBtnClose');
	const btnLogin = document.getElementById('topBtnLogin');
	const btnRegister = document.getElementById('topBtnRegister');
	const statusEl = document.getElementById('topLoginStatus');
	const emailEl = document.getElementById('topAuthEmail');
	const passEl = document.getElementById('topAuthPassword');

	function showModal(){ if(modal){ modal.setAttribute('aria-hidden','false'); } }
	function hideModal(){ if(modal){ modal.setAttribute('aria-hidden','true'); } }

	btn?.addEventListener('click', (e)=>{ e.preventDefault(); showModal(); if(emailEl) emailEl.focus(); });
	btnClose?.addEventListener('click', (e)=>{ e.preventDefault(); hideModal(); });

	async function trySignIn(){
		const email = emailEl && emailEl.value && emailEl.value.trim();
		const password = passEl && passEl.value || '';
		if(!email || !password){ alert('メールとパスワードを入力してください'); return; }
		if(typeof window.firebase === 'undefined' || !window.firebase.auth){ alert('Firebase が読み込まれていません。設定してください。'); return; }
		try{
			await firebase.auth().signInWithEmailAndPassword(email, password);
			statusEl && (statusEl.textContent = 'サインインに成功しました');
			hideModal();
		}catch(err){ alert('サインイン失敗: '+(err && err.message || err)); }
	}

	async function tryRegister(){
		const email = emailEl && emailEl.value && emailEl.value.trim();
		const password = passEl && passEl.value || '';
		if(!email || !password){ alert('メールとパスワードを入力してください'); return; }
		if(typeof window.firebase === 'undefined' || !window.firebase.auth){ alert('Firebase が読み込まれていません。設定してください。'); return; }
		try{
			await firebase.auth().createUserWithEmailAndPassword(email, password);
			statusEl && (statusEl.textContent = 'アカウント作成とログインに成功しました');
			hideModal();
		}catch(err){ alert('登録失敗: '+(err && err.message || err)); }
	}

	btnLogin?.addEventListener('click', (e)=>{ e.preventDefault(); trySignIn(); });
	btnRegister?.addEventListener('click', (e)=>{ e.preventDefault(); tryRegister(); });

	// Optional: update UI on auth state change
	if(typeof window.firebase !== 'undefined' && window.firebase.auth){
		firebase.auth().onAuthStateChanged(user => {
			if(user){
				if(btn) btn.textContent = 'サインアウト';
				btn.removeEventListener('click', showModal);
				btn.addEventListener('click', async (e)=>{ e.preventDefault(); try{ await firebase.auth().signOut(); btn.textContent='ログイン'; btn.addEventListener('click', (ev)=>{ ev.preventDefault(); showModal(); }); }catch(err){ console.warn(err); } });
			} else {
				if(btn) btn.textContent = 'ログイン';
			}
		});
	}

	// --- Diagnostic: top-actions visibility helper (logging only) ---
	try{
		const ta = document.querySelector('.top-actions');
		if(ta){
			const cs = window.getComputedStyle(ta);
			console.log('DEBUG: .top-actions computed style', {
				display: cs.display,
				visibility: cs.visibility,
				opacity: cs.opacity,
				transform: cs.transform,
				zIndex: cs.zIndex,
				position: cs.position,
				top: cs.top,
				right: cs.right,
				boundingClientRect: ta.getBoundingClientRect()
			});
		} else {
			console.warn('DEBUG: .top-actions element not found in DOM');
		}
	} catch(e){ console.warn('DEBUG: error while running top-actions diagnostic', e); }
});
