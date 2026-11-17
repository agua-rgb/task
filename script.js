(() => {
  const buttons = [...document.querySelectorAll('.tab-btn')];
  const panels = [...document.querySelectorAll('.task-panel')];

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const n = btn.dataset.task;
      buttons.forEach(b => b.classList.toggle('active', b === btn));
      panels.forEach(p => p.hidden = p.id !== `task-${n}`);
      if (n === 'results') renderResults();
    });
  });

  const STORAGE_KEY = 'field_tasks_synthetic_results';

  function getResults() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  }

  function saveResult(entry) {
    const rows = getResults();
    rows.push(entry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
  }

  function renderResults() {
    const rows = getResults();
    const body = document.getElementById('resultsBody');
    const empty = document.getElementById('resultsEmpty');
    const wrap = document.getElementById('resultsTableWrap');

    if (!body || !empty || !wrap) return;

    body.innerHTML = '';

    if (!rows.length) {
      empty.hidden = false;
      wrap.hidden = true;
      return;
    }

    empty.hidden = true;
    wrap.hidden = false;

    rows.slice().reverse().forEach(row => {
      const tr = document.createElement('tr');
      [
        row.time,
        row.employeeId,
        row.email,
        row.accessKey,
        row.diagnosticId,
        row.status
      ].forEach(value => {
        const td = document.createElement('td');
        td.textContent = value;
        tr.appendChild(td);
      });
      body.appendChild(tr);
    });
  }

  const unlock = document.getElementById('unlockBtn');
  if (unlock) {
    unlock.addEventListener('click', () => {
      const employeeId = document.getElementById('employeeId').value.trim();
      const email = document.getElementById('email').value.trim();
      const accessKey = document.getElementById('accessKey').value.trim();
      const diagnosticId = document.getElementById('diagnosticId').value.trim();
      const status = document.getElementById('challengeStatus');

      const ok =
        employeeId === 'TEST-4821' &&
        email === 'alex.rivera@example.test' &&
        accessKey === 'QA-7429' &&
        diagnosticId === 'SYNTH-2030';

      const statusText = ok ? 'Accepted' : 'Rejected';
      status.textContent = ok ? 'Challenge unlocked.' : 'Submitted values were not accepted.';

      saveResult({
        time: new Date().toLocaleString(),
        employeeId,
        email,
        accessKey,
        diagnosticId,
        status: statusText
      });
    });
  }

  const clear = document.getElementById('clearResultsBtn');
  if (clear) {
    clear.addEventListener('click', () => {
      localStorage.removeItem(STORAGE_KEY);
      renderResults();
    });
  }

  renderResults();
})();
