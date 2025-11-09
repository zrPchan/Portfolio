// 簡単な in-memory 問題データ
const problems = [
  {
    id: 1,
    title: "JavaScript の変数宣言で使うキーワードはどれ？",
    text: "次のうち変数宣言で使うキーワードを1つ選んでください。",
    choices: ["if", "const", "for", "return"],
    answerIndex: 1
  },
  {
    id: 2,
    title: "HTML の見出しタグはどれ？",
    text: "見出しを表すタグを選んでください。",
    choices: ["<p>", "<div>", "<h1>", "<span>"],
    answerIndex: 2
  }
];

const el = id => document.getElementById(id);
const create = (tag, cls) => {
  const t = document.createElement(tag);
  if (cls) t.className = cls;
  return t;
};

function renderProblemList(){
  const container = el('problem-list');
  container.innerHTML = '';
  problems.forEach(p => {
    const card = create('div','card');
    const h = create('h2');
    h.textContent = p.title;
    const desc = create('p','small');
    desc.textContent = p.text;
    const open = create('button','btn');
    open.textContent = '解く';
    open.onclick = () => showProblem(p.id);
    card.appendChild(h);
    card.appendChild(desc);
    card.appendChild(open);
    container.appendChild(card);
  });
}

let currentProblem = null;

function showProblem(id){
  const p = problems.find(x => x.id === id);
  currentProblem = p;
  const area = el('problem-area');
  area.innerHTML = '';
  const card = create('div','card');
  const h = create('h2'); h.textContent = p.title;
  const t = create('p'); t.textContent = p.text;
  card.appendChild(h);
  card.appendChild(t);

  // 選択肢
  const form = create('form');
  p.choices.forEach((c, idx) => {
    const label = create('label','option');
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'choice';
    radio.value = idx;
    label.appendChild(radio);
    label.appendChild(document.createTextNode(' ' + c));
    form.appendChild(label);
  });

  const submit = create('button','btn');
  submit.type = 'button';
  submit.textContent = '提出';
  submit.onclick = () => grade(form);
  const back = create('button');
  back.type = 'button';
  back.textContent = '戻る';
  back.onclick = () => { el('problem-area').classList.add('hidden'); el('problem-list').classList.remove('hidden'); el('result').classList.add('hidden'); };

  card.appendChild(form);
  card.appendChild(submit);
  card.appendChild(back);
  area.appendChild(card);

  el('problem-list').classList.add('hidden');
  area.classList.remove('hidden');
  el('result').classList.add('hidden');
}

function grade(form){
  const checked = form.querySelector('input[name="choice"]:checked');
  const result = el('result');
  result.innerHTML = '';
  result.classList.remove('hidden');

  if (!checked){
    result.textContent = '選択肢が選ばれていません。';
    return;
  }
  const selected = Number(checked.value);
  const ok = selected === currentProblem.answerIndex;
  const msg = create('p');
  msg.textContent = ok ? '正解！' : `不正解。正しい答えは: ${currentProblem.choices[currentProblem.answerIndex]}`;
  result.appendChild(msg);

  // 次へボタン
  const next = create('button','btn');
  next.textContent = '次の問題へ';
  next.onclick = () => {
    const idx = problems.findIndex(p => p.id === currentProblem.id);
    const nextProblem = problems[idx+1];
    if (nextProblem) showProblem(nextProblem.id);
    else {
      el('problem-area').classList.add('hidden');
      el('problem-list').classList.remove('hidden');
      result.classList.add('hidden');
      alert('全問終了！');
    }
  };
  result.appendChild(next);
}

window.addEventListener('DOMContentLoaded', () => {
  renderProblemList();
});