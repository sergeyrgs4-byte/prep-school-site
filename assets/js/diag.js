const questions = [
  { id:'attention_1', title:'Найди одинаковые: выбери пару предметов, которые одинаковые.', answers:['🍎 и 🍎','🍎 и 🍐','🍌 и 🍇','🍐 и 🍉'], correctIndex:0, skill:'attention' },
  { id:'numeracy_1',  title:'Сосчитай: сколько звёзд? ⭐ ⭐ ⭐', answers:['2','3','4'], correctIndex:1, skill:'numeracy' },
  { id:'phonics_1',   title:'Какой звук в начале слова «мама»?', answers:['С','М','Л'], correctIndex:1, skill:'phonics' },
  { id:'shapes_1',    title:'Выбери круг.', answers:['⬜ Квадрат','🔺 Треугольник','⚪ Круг'], correctIndex:2, skill:'shapes' },
  { id:'sequence_1',  title:'Что дальше в ряду: 1, 2, 3, …?', answers:['2','4','5'], correctIndex:1, skill:'logic' } // 4
];

let state = { i:0, selected:null, score:{ attention:0, numeracy:0, phonics:0, shapes:0, logic:0 } };

const elTitle   = document.getElementById('qTitle');
const elAnswers = document.getElementById('answers');
const elNext    = document.getElementById('nextBtn');
const elBar     = document.getElementById('bar');
const elResult  = document.getElementById('result');
const elSummary = document.getElementById('summary');

function render(){
  const q = questions[state.i];
  elTitle.textContent = `Задание ${state.i+1} из ${questions.length}: ${q.title}`;
  elAnswers.innerHTML = '';
  q.answers.forEach((t, idx) => {
    const b = document.createElement('button');
    b.className = 'btn' + (state.selected === idx ? ' sel' : '');
    b.textContent = t;
    b.onclick = () => { state.selected = idx; render(); };
    elAnswers.appendChild(b);
  });
  elBar.style.width = `${(state.i/questions.length)*100}%`;
  elNext.textContent = state.i < questions.length-1 ? 'Дальше' : 'Показать результат';
}

function next(){
  const q = questions[state.i];
  if (state.selected === null) { speak('Сначала выбери ответ'); return; }
  if (state.selected === q.correctIndex) { state.score[q.skill] += 1; speak('Молодец!'); }
  else { speak('Ничего, идём дальше!'); }
  state.i += 1;
  state.selected = null;
  if (state.i >= questions.length) finish(); else render();
}

function finish(){
  elBar.style.width = '100%';
  const s = state.score, total = questions.length;
  elSummary.textContent = `Баллы: внимание ${s.attention}, счёт ${s.numeracy}, звуки ${s.phonics}, формы ${s.shapes}, логика ${s.logic}. На основе этого мы предложим план на неделю.`;
  elResult.style.display = 'block';
  localStorage.setItem('readiness_result_v1', JSON.stringify({ date:new Date().toISOString(), score:s, total }));
  speak('Отлично! Диагностика завершена.');
}

elNext.addEventListener('click', next);
render();
