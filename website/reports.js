/**
 * On-Demand Report Generation, Dashboard & Analysis
 */
(function() {
  const CHART_COLORS = {
    accent: 'rgba(14, 165, 233, 0.8)',
    teal: 'rgba(20, 184, 166, 0.8)',
    purple: 'rgba(139, 92, 246, 0.8)',
    amber: 'rgba(245, 158, 11, 0.8)',
    red: 'rgba(239, 68, 68, 0.8)',
    bg: 'rgba(17, 24, 39, 0.5)'
  };

  const REPORT_DATA = {
    status: {
      progress: 28,
      currentWeek: 18,
      milestones: ['M1: Foundation (Week 12)', 'M2: Core BI (Week 28)', 'M3: Commercial (Week 40)', 'M4: AI PoCs (Week 60)'],
      risks: ['Phase 2 SAC connectivity delayed 3 days'],
      nextActions: ['Complete SAC tenant setup', 'Begin Brand Performance dashboard']
    },
    budget: {
      total: 1265000,
      spent: 312500,
      byAccount: [
        { code: 'GCC-SAP-001', planned: 40000, actual: 38500 },
        { code: 'GCC-SAP-002', planned: 120000, actual: 120000 },
        { code: 'GCC-SAP-003', planned: 150000, actual: 162000 },
        { code: 'GCC-SAP-004', planned: 280000, actual: 245000 },
        { code: 'GCC-SAP-005', planned: 120000, actual: 95000 }
      ]
    },
    resource: {
      utilization: 78,
      byRole: [
        { role: 'Senior Architect', allocated: 85, actual: 90 },
        { role: 'BI Developer', allocated: 90, actual: 85 },
        { role: 'Data Engineer', allocated: 75, actual: 80 },
        { role: 'AI/ML Engineer', allocated: 55, actual: 50 }
      ]
    },
    phases: [
      { name: 'Phase 1', planned: 180000, actual: 175000, progress: 100 },
      { name: 'Phase 2', planned: 240000, actual: 137500, progress: 58 },
      { name: 'Phase 3', planned: 320000, actual: 0, progress: 0 },
      { name: 'Phase 4', planned: 200000, actual: 0, progress: 0 }
    ],
    spendTrend: [45000, 52000, 48500, 62000, 55000, 50000]
  };

  function $(sel, el = document) { return el.querySelector(sel); }
  function $$(sel, el = document) { return el.querySelectorAll(sel); }

  // Report Generation
  function generateReport() {
    const type = $('#reportType')?.value || 'status';
    const period = $('#reportPeriod')?.value || 'month';
    const format = $('#reportFormat')?.value || 'screen';
    const output = $('#reportOutput');
    if (!output) return;

    const now = new Date().toLocaleDateString('en-US', { dateStyle: 'long' });
    let html = `<div class="report-content"><div class="report-header">
      <h4>SAP GCC Project – ${type.charAt(0).toUpperCase() + type.slice(1)} Report</h4>
      <p>Generated: ${now} · Period: ${period} · Report ID: RPT-${Date.now().toString(36).toUpperCase()}</p>
    </div>`;

    switch (type) {
      case 'status':
        html += `<div class="report-body">
          <p><strong>Overall Progress:</strong> ${REPORT_DATA.status.progress}%</p>
          <p><strong>Current Week:</strong> ${REPORT_DATA.status.currentWeek} of 60</p>
          <h5>Milestones</h5><ul>${REPORT_DATA.status.milestones.map(m => `<li>${m}</li>`).join('')}</ul>
          <h5>Risks</h5><ul>${REPORT_DATA.status.risks.map(r => `<li>${r}</li>`).join('')}</ul>
          <h5>Next Actions</h5><ul>${REPORT_DATA.status.nextActions.map(a => `<li>${a}</li>`).join('')}</ul>
        </div>`;
        break;
      case 'budget':
        const b = REPORT_DATA.budget;
        html += `<div class="report-body">
          <p><strong>Total Budget:</strong> $${(b.total / 1000).toFixed(0)}K</p>
          <p><strong>Spent:</strong> $${(b.spent / 1000).toFixed(0)}K (${((b.spent / b.total) * 100).toFixed(1)}%)</p>
          <table class="report-table"><tr><th>Account</th><th>Planned</th><th>Actual</th><th>Variance</th></tr>
          ${b.byAccount.map(a => {
            const v = a.actual - a.planned;
            return `<tr><td>${a.code}</td><td>$${(a.planned/1000).toFixed(0)}K</td><td>$${(a.actual/1000).toFixed(0)}K</td><td>${v >= 0 ? '+' : ''}$${(v/1000).toFixed(0)}K</td></tr>`;
          }).join('')}</table>
        </div>`;
        break;
      case 'resource':
        html += `<div class="report-body">
          <p><strong>Overall Utilization:</strong> ${REPORT_DATA.resource.utilization}%</p>
          <table class="report-table"><tr><th>Role</th><th>Allocated %</th><th>Actual %</th></tr>
          ${REPORT_DATA.resource.byRole.map(r => `<tr><td>${r.role}</td><td>${r.allocated}</td><td>${r.actual}</td></tr>`).join('')}</table>
        </div>`;
        break;
      case 'executive':
        html += `<div class="report-body">
          <p><strong>Executive Summary</strong></p>
          <p>Project is at 28% completion (Week 18/60). Budget utilization at 25% ($312K of $1.27M). Phase 1 complete; Phase 2 in progress. One minor schedule delay (SAC connectivity). CPI 1.05, SPI 1.02 – project performing above plan.</p>
          <p><strong>Recommendation:</strong> Continue current trajectory. No scope or budget changes required.</p>
        </div>`;
        break;
      case 'variance':
        html += `<div class="report-body">
          <p><strong>Variance Analysis</strong></p>
          <table class="report-table"><tr><th>Account</th><th>Planned</th><th>Actual</th><th>Variance</th><th>%</th></tr>
          ${REPORT_DATA.budget.byAccount.map(a => {
            const v = a.actual - a.planned;
            const pct = ((v / a.planned) * 100).toFixed(1);
            return `<tr><td>${a.code}</td><td>$${(a.planned/1000).toFixed(0)}K</td><td>$${(a.actual/1000).toFixed(0)}K</td><td>${v >= 0 ? '+' : ''}$${(v/1000).toFixed(0)}K</td><td>${pct}%</td></tr>`;
          }).join('')}</table>
        </div>`;
        break;
    }

    html += '</div>';
    output.innerHTML = html;
    output.classList.add('visible');

    if (format === 'print') {
      const win = window.open('', '_blank');
      win.document.write(`<html><head><title>Report</title><link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600&display=swap" rel="stylesheet"><style>body{font-family:Outfit,sans-serif;padding:2rem;background:#0a0e17;color:#f1f5f9}.report-content{max-width:800px;margin:0 auto}.report-table{width:100%;border-collapse:collapse}.report-table th,.report-table td{padding:8px;border:1px solid #334155}</style></head><body>${html}</body></html>`);
      win.document.close();
      setTimeout(() => win.print(), 250);
    }
  }

  // Dashboard Charts
  let chartBudget, chartProgress, chartTrend;

  function initCharts() {
    if (typeof Chart === 'undefined') {
      setTimeout(initCharts, 100);
      return;
    }

    const opts = { responsive: true, maintainAspectRatio: true, plugins: { legend: { labels: { color: '#94a3b8' } } } };

    chartBudget = new Chart($('#chartBudget'), {
      type: 'bar',
      data: {
        labels: REPORT_DATA.phases.map(p => p.name),
        datasets: [
          { label: 'Planned', data: REPORT_DATA.phases.map(p => p.planned / 1000), backgroundColor: CHART_COLORS.accent },
          { label: 'Actual', data: REPORT_DATA.phases.map(p => p.actual / 1000), backgroundColor: CHART_COLORS.teal }
        ]
      },
      options: { ...opts, scales: { x: { ticks: { color: '#94a3b8' } }, y: { ticks: { color: '#94a3b8', callback: v => '$' + v + 'K' } } } }
    });

    chartProgress = new Chart($('#chartProgress'), {
      type: 'doughnut',
      data: {
        labels: REPORT_DATA.phases.map(p => p.name),
        datasets: [{ data: REPORT_DATA.phases.map(p => p.progress), backgroundColor: [CHART_COLORS.accent, CHART_COLORS.teal, CHART_COLORS.purple, CHART_COLORS.amber] }]
      },
      options: { ...opts }
    });

    chartTrend = new Chart($('#chartTrend'), {
      type: 'line',
      data: {
        labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'],
        datasets: [{ label: 'Weekly Spend ($K)', data: REPORT_DATA.spendTrend.map(v => v / 1000), borderColor: CHART_COLORS.accent, backgroundColor: 'rgba(14,165,233,0.1)', fill: true }]
      },
      options: { ...opts, scales: { x: { ticks: { color: '#94a3b8' } }, y: { ticks: { color: '#94a3b8', callback: v => '$' + v + 'K' } } } }
    });
  }

  function updateCharts() {
    const phase = $('#dashboardPhase')?.value;
    if (phase && phase !== 'all' && chartProgress) {
      const idx = parseInt(phase) - 1;
      chartProgress.data.datasets[0].data = REPORT_DATA.phases.map((p, i) => i === idx ? p.progress : 0);
      chartProgress.update();
    } else if (chartProgress) {
      chartProgress.data.datasets[0].data = REPORT_DATA.phases.map(p => p.progress);
      chartProgress.update();
    }
  }

  // Analysis
  function runAnalysis() {
    const search = ($('#analysisSearch')?.value || '').toLowerCase();
    const dim = $('#analysisDimension')?.value || 'account';
    const tbody = $('#analysisTable')?.querySelector('tbody');
    const summary = $('#analysisSummary');
    if (!tbody || !summary) return;

    let rows = [];
    if (dim === 'account') {
      rows = REPORT_DATA.budget.byAccount.map(a => ({
        dim: a.code,
        planned: a.planned,
        actual: a.actual,
        variance: a.actual - a.planned,
        pct: ((a.actual - a.planned) / a.planned * 100).toFixed(1),
        isPct: false
      }));
    } else if (dim === 'phase') {
      rows = REPORT_DATA.phases.map(p => ({
        dim: p.name,
        planned: p.planned,
        actual: p.actual,
        variance: p.actual - p.planned,
        pct: p.planned ? ((p.actual - p.planned) / p.planned * 100).toFixed(1) : '0',
        isPct: false
      }));
    } else {
      rows = REPORT_DATA.resource.byRole.map(r => ({
        dim: r.role,
        planned: r.allocated,
        actual: r.actual,
        variance: r.actual - r.allocated,
        pct: ((r.actual - r.allocated) / r.allocated * 100).toFixed(1),
        isPct: true
      }));
    }

    const filtered = search ? rows.filter(r => r.dim.toLowerCase().includes(search)) : rows;
    const fmt = (v, isPct) => isPct ? v + '%' : '$' + (v/1000).toFixed(0) + 'K';
    tbody.innerHTML = filtered.map(r => `
      <tr><td>${r.dim}</td><td>${fmt(r.planned, r.isPct)}</td><td>${fmt(r.actual, r.isPct)}</td>
      <td class="${r.variance >= 0 ? 'pm-over' : 'pm-under'}">${r.variance >= 0 ? '+' : ''}${r.isPct ? r.variance + '%' : '$' + (r.variance/1000).toFixed(0) + 'K'}</td>
      <td>${r.pct}%</td></tr>
    `).join('');

    const totalVar = filtered.reduce((s, r) => s + (r.isPct ? 0 : r.variance), 0);
    const avgPct = filtered.filter(r => r.isPct).length ? (filtered.reduce((s, r) => s + parseFloat(r.pct), 0) / filtered.length).toFixed(1) : null;
    summary.innerHTML = filtered.some(r => r.isPct)
      ? `<p><strong>Summary:</strong> ${filtered.length} resources · Avg variance: ${avgPct}%</p>`
      : `<p><strong>Summary:</strong> ${filtered.length} items · Total variance: ${totalVar >= 0 ? '+' : ''}$${(totalVar/1000).toFixed(0)}K</p>`;
  }

  function init() {
    $('#btnGenerateReport')?.addEventListener('click', generateReport);
    $('#dashboardPhase')?.addEventListener('change', updateCharts);
    $('#dashboardMetric')?.addEventListener('change', updateCharts);
    $('#analysisSearch')?.addEventListener('input', runAnalysis);
    $('#analysisDimension')?.addEventListener('change', runAnalysis);
    $('#btnCompare')?.addEventListener('click', () => alert('Compare Periods: Select two date ranges to compare. (Demo – connect to data source for full functionality)'));
    initCharts();
    runAnalysis();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else setTimeout(init, 500);
})();
