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
});
