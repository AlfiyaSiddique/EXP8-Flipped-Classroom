const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const state = { replicas: 3, pipelineRuns: 18 };

function renderPods() {
  const podList = $('#podList');
  const metricsTable = $('#metricsTable');
  const pods = Array.from({ length: state.replicas }, (_, index) => `clusterpilot-web-${String.fromCharCode(97 + index)}${(index + 2) * 173}`);
  podList.innerHTML = pods.map((pod) => `<div class="pod"><span class="pod-name">${pod}</span><span class="pod-state">Running</span></div>`).join('');
  metricsTable.innerHTML = pods.map((pod, index) => `<tr><td>${pod}</td><td class="healthy">● Running</td><td>${(18 + index * 4.7).toFixed(1)}m</td><td>${30 + index * 3}Mi</td><td>0</td></tr>`).join('');
  $('#runningPods').textContent = `${state.replicas} / ${state.replicas}`;
  $('#rolloutStatus').textContent = state.replicas === 5 ? 'Successfully rolled out' : 'Progressing';
  $('#rolloutStatus').style.color = state.replicas === 5 ? 'var(--green)' : 'var(--orange)';
}

$$('.tab').forEach((tab) => tab.addEventListener('click', () => {
  $$('.tab').forEach((item) => item.classList.remove('active'));
  $$('[data-panel]').forEach((panel) => panel.classList.remove('active'));
  tab.classList.add('active');
  $(`#${tab.dataset.tab}`).classList.add('active');
}));

$$('[data-scroll]').forEach((button) => button.addEventListener('click', () => {
  $(button.dataset.scroll).scrollIntoView({ behavior: 'smooth' });
}));

$('#replicaSlider').addEventListener('input', (event) => {
  $('#replicaValue').textContent = event.target.value;
});

$('#scaleButton').addEventListener('click', () => {
  state.replicas = Number($('#replicaSlider').value);
  renderPods();
  $('#scaleMessage').innerHTML = `Applied <code>kubectl scale deployment clusterpilot-web --replicas=${state.replicas}</code>`;
});

$('#runPipeline').addEventListener('click', (event) => {
  const button = event.currentTarget;
  button.disabled = true;
  button.textContent = '◌ Running pipeline...';
  setTimeout(() => {
    state.pipelineRuns += 1;
    button.disabled = false;
    button.textContent = `✓ Run #${state.pipelineRuns} passed`;
  }, 1100);
});

$$('[data-copy]').forEach((button) => button.addEventListener('click', async () => {
  await navigator.clipboard.writeText(button.dataset.copy);
  const original = button.textContent;
  button.textContent = 'Copied!';
  setTimeout(() => { button.textContent = original; }, 1200);
}));

renderPods();
