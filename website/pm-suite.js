/**
 * Project Progress & Expenditure Management Suite
 * Planning, Scheduling, Resources, Monitoring, Alerting, Budget, Timeline
 */
(function() {
  const BUDGET_TOTAL = 1265000;
  const WEEKS_TOTAL = 60;
  const PHASES = [
    { id: 1, name: 'Foundation', start: 1, end: 12, budget: 180000 },
    { id: 2, name: 'BI Layer', start: 13, end: 28, budget: 240000 },
    { id: 3, name: 'Commercial & Medical', start: 29, end: 48, budget: 320000 },
    { id: 4, name: 'AI Augmentation', start: 49, end: 60, budget: 200000 }
  ];
  const GANTT_TASKS = [
    { name: '1.1 SAP BTP setup', start: 1, end: 4 },
    { name: '1.2 Datasphere design', start: 5, end: 8 },
    { name: '1.3 BI architecture', start: 7, end: 12 },
    { name: '2.1 SAC tenant', start: 13, end: 16 },
    { name: '2.2 Core data models', start: 15, end: 22 },
    { name: '2.3 Brand dashboard', start: 20, end: 26 },
    { name: '2.4 SFE & HCP', start: 24, end: 28 },
    { name: '3.1 Patient funnel', start: 29, end: 36 },
    { name: '3.2 Campaign analytics', start: 34, end: 42 },
    { name: '3.3 MSL & KOL', start: 38, end: 46 },
    { name: '4.1 Invoice PoC', start: 49, end: 54 },
    { name: '4.2 Forecast Copilot', start: 51, end: 56 },
    { name: '4.3 HR Assistant', start: 53, end: 58 }
  ];
  const RESOURCES = [
    { name: 'Senior Architect', role: 'Architecture', p1: 100, p2: 80, p3: 60, p4: 100 },
    { name: 'BI Developer 1', role: 'BI Dev', p1: 50, p2: 100, p3: 100, p4: 40 },
    { name: 'BI Developer 2', role: 'BI Dev', p1: 0, p2: 80, p3: 100, p4: 60 },
    { name: 'Data Engineer', role: 'Data Eng', p1: 100, p2: 80, p3: 60, p4: 20 },
    { name: 'AI/ML Engineer', role: 'AI/ML', p1: 20, p2: 40, p3: 60, p4: 100 },
    { name: 'Pharma BA', role: 'BA', p1: 80, p2: 60, p3: 100, p4: 40 }
  ];
  const BUDGET_VARIANCE = [
    { account: 'GCC-SAP-001', planned: 40000, actual: 38500 },
    { account: 'GCC-SAP-002', planned: 120000, actual: 120000 },
    { account: 'GCC-SAP-003', planned: 150000, actual: 162000 },
    { account: 'GCC-SAP-004', planned: 280000, actual: 245000 },
    { account: 'GCC-SAP-005', planned: 120000, actual: 95000 },
    { account: 'GCC-SAP-006', planned: 25000, actual: 22000 }
  ];

  let state = {
    currentWeek: 18,
    spentBudget: 312500,
    progress: 28,
    alerts: [
      { id: 1, msg: 'Phase 2 BI development ahead of schedule', severity: 'info', date: '2026-03-15' },
      { id: 2, msg: 'GCC-SAP-003 over budget by 8% - review architect allocation', severity: 'warning', date: '2026-03-14' },
      { id: 3, msg: 'SAC tenant connectivity delayed 3 days', severity: 'info', date: '2026-03-10' }
    ],
    adjustments: [
      { date: 'Baseline', desc: 'Initial 60-week schedule approved', impact: '—' },
      { date: '2026-02-15', desc: 'Phase 1 extended for governance review', impact: '+1 week' }
    ]
  };

  function $(sel, el = document) { return el.querySelector(sel); }
  function $$(sel, el = document) { return el.querySelectorAll(sel); }

  function initTabs() {
    $$('.pm-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        $$('.pm-tab').forEach(t => t.classList.remove('active'));
        $$('.pm-tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        $('#tab-' + tab.dataset.tab)?.classList.add('active');
      });
    });
  }

  function updateKPIs() {
    const pct = Math.round((state.progress / 100) * 100);
    $('#pmProgress').textContent = state.progress + '%';
    $('#pmProgressBar').style.width = state.progress + '%';
    $('#pmBudget').textContent = '$' + (state.spentBudget / 1000).toFixed(0) + 'K / $1.27M';
    $('#pmBudgetBar').style.width = Math.min(100, (state.spentBudget / BUDGET_TOTAL) * 100) + '%';
    $('#pmSchedule').textContent = 'Week ' + state.currentWeek + ' / 60';
    $('#pmScheduleBar').style.width = (state.currentWeek / WEEKS_TOTAL) * 100 + '%';
    const util = 78;
    $('#pmResources').textContent = util + '%';
    $('#pmResourceBar').style.width = util + '%';
  }

  function renderAlerts() {
    const container = $('#pmAlerts');
    if (!container) return;
    container.innerHTML = state.alerts.map(a => `
      <div class="pm-alert pm-alert-${a.severity}">
        <span class="pm-alert-icon">${a.severity === 'critical' ? '!' : a.severity === 'warning' ? '⚠' : 'ℹ'}</span>
        ${a.msg} <span class="pm-alert-date">${a.date}</span>
      </div>
    `).join('');
  }

  function renderGantt() {
    const body = $('#pmGanttBody');
    if (!body) return;
    body.innerHTML = GANTT_TASKS.map(t => {
      const w = ((t.end - t.start + 1) / WEEKS_TOTAL) * 100;
      const left = ((t.start - 1) / WEEKS_TOTAL) * 100;
      const done = state.currentWeek >= t.end ? 100 : state.currentWeek >= t.start ? ((state.currentWeek - t.start + 1) / (t.end - t.start + 1)) * 100 : 0;
      return `
        <div class="pm-gantt-row">
          <span class="pm-gantt-task-name">${t.name}</span>
          <div class="pm-gantt-bar-wrap" style="width: 100%;">
            <div class="pm-gantt-bar" style="left: ${left}%; width: ${w}%;">
              <div class="pm-gantt-bar-done" style="width: ${done}%"></div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderResources() {
    const tbody = $('#pmResourceTable')?.querySelector('tbody');
    if (!tbody) return;
    tbody.innerHTML = RESOURCES.map(r => {
      const avg = Math.round((r.p1 + r.p2 + r.p3 + r.p4) / 4);
      return `<tr>
        <td>${r.name}</td><td>${r.role}</td>
        <td>${r.p1}%</td><td>${r.p2}%</td><td>${r.p3}%</td><td>${r.p4}%</td>
        <td><span class="pm-util pm-util-${avg > 80 ? 'high' : avg > 50 ? 'med' : 'low'}">${avg}%</span></td>
      </tr>`;
    }).join('');
  }

  function renderPhaseProgress() {
    const container = $('#pmPhaseProgress');
    if (!container) return;
    container.innerHTML = PHASES.map(p => {
      const done = state.currentWeek >= p.end ? 100 : state.currentWeek >= p.start ? ((state.currentWeek - p.start + 1) / (p.end - p.start + 1)) * 100 : 0;
      return `
        <div class="pm-phase-progress">
          <span>${p.name}</span>
          <div class="pm-progress-bar"><div class="pm-progress-fill" style="width: ${done}%"></div></div>
          <span>${Math.round(done)}%</span>
        </div>
      `;
    }).join('');
  }

  function renderEV() {
    const pv = (state.currentWeek / WEEKS_TOTAL) * BUDGET_TOTAL;
    const ev = pv * (state.progress / 100) * 1.05;
    const ac = state.spentBudget;
    const cpi = (ev / ac).toFixed(2);
    const spi = (ev / pv).toFixed(2);
    $('#pmPV').textContent = '$' + (pv / 1000).toFixed(0) + 'K';
    $('#pmEV').textContent = '$' + (ev / 1000).toFixed(0) + 'K';
    $('#pmAC').textContent = '$' + (ac / 1000).toFixed(0) + 'K';
    $('#pmCPI').textContent = cpi;
    $('#pmSPI').textContent = spi;
    $('#pmCPI').className = parseFloat(cpi) >= 1 ? 'pm-good' : 'pm-bad';
    $('#pmSPI').className = parseFloat(spi) >= 1 ? 'pm-good' : 'pm-bad';
  }

  function renderVariance() {
    const tbody = $('#pmVarianceTable')?.querySelector('tbody');
    if (!tbody) return;
    tbody.innerHTML = BUDGET_VARIANCE.map(v => {
      const varAmt = v.actual - v.planned;
      const varPct = ((varAmt / v.planned) * 100).toFixed(1);
      const status = varAmt > 0 ? 'over' : 'under';
      return `<tr>
        <td>${v.account}</td>
        <td>$${(v.planned / 1000).toFixed(0)}K</td>
        <td>$${(v.actual / 1000).toFixed(0)}K</td>
        <td class="${varAmt > 0 ? 'pm-over' : 'pm-under'}">$${Math.abs(varAmt / 1000).toFixed(0)}K</td>
        <td>${varPct}%</td>
        <td><span class="pm-status pm-status-${status}">${status}</span></td>
      </tr>`;
    }).join('');
  }

  function renderAdjustments() {
    const container = $('#pmAdjustments');
    if (!container) return;
    container.innerHTML = state.adjustments.map(a => `
      <div class="pm-adjustment-item">
        <span class="pm-adj-date">${a.date}</span>
        <span class="pm-adj-desc">${a.desc}</span>
        <span class="pm-adj-impact">${a.impact}</span>
      </div>
    `).join('');
  }

  $('#pmAddAlert')?.addEventListener('click', () => {
    const msg = prompt('Alert message:');
    if (msg) {
      state.alerts.unshift({ id: Date.now(), msg, severity: 'info', date: new Date().toISOString().slice(0, 10) });
      renderAlerts();
    }
  });

  $('#pmAddAdjustment')?.addEventListener('click', () => {
    const desc = $('#pmAdjDesc')?.value;
    const impact = $('#pmAdjImpact')?.value;
    if (desc) {
      state.adjustments.push({ date: new Date().toISOString().slice(0, 10), desc, impact: impact || '—' });
      renderAdjustments();
      $('#pmAdjDesc').value = $('#pmAdjImpact').value = '';
    }
  });

  function init() {
    initTabs();
    updateKPIs();
    renderAlerts();
    renderGantt();
    renderResources();
    renderPhaseProgress();
    renderEV();
    renderVariance();
    renderAdjustments();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
