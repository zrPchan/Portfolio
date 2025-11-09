// main.js
// Top-page login modal + Firebase email/password auth (index.html)
document.addEventListener('DOMContentLoaded', ()=>{
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

	// --- Diagnostic: top-actions visibility helper ---
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
			// Add a temporary bright outline to help visually locate it (removed after 6s)
			const prevOutline = ta.style.outline;
			ta.style.outline = '3px solid lime';
			setTimeout(()=>{ ta.style.outline = prevOutline; }, 6000);
		} else {
			console.warn('DEBUG: .top-actions element not found in DOM');
		}
		// Add a temporary top-right debug badge at extremely high z-index to test stacking
		const badge = document.createElement('div');
		badge.id = 'top-actions-debug-badge';
		badge.textContent = 'TOP';
		Object.assign(badge.style, {
			position: 'fixed',
			top: '8px',
			right: '8px',
			width: '56px',
			height: '28px',
			lineHeight: '28px',
			textAlign: 'center',
			background: '#ff2d55',
			color: '#fff',
			fontWeight: '700',
			borderRadius: '6px',
			padding: '0 8px',
			zIndex: '2147483647',
			pointerEvents: 'none',
			boxShadow: '0 6px 18px rgba(0,0,0,0.3)'
		});
		document.body.appendChild(badge);
		setTimeout(()=>{ const b = document.getElementById('top-actions-debug-badge'); b && b.remove(); }, 6000);
	} catch(e){ console.warn('DEBUG: error while running top-actions diagnostic', e); }
});
