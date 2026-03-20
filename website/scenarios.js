/**
 * What-If Analysis, Risk Management & Forecasting
 */
(function() {
  const BASE = { budget: 1265000, weeks: 60, spent: 312500, progress: 28, utilization: 78, contingency: 165000 };
  const CHART_COLORS = { accent: 'rgba(14, 165, 233, 0.8)', teal: 'rgba(20, 184, 166, 0.8)', purple: 'rgba(139, 92, 246, 0.8)' };

  const RISKS = [
    { id: 'R1', risk: 'SAP BTP connectivity delays', category: 'Technical', prob: 3, impact: 4, score: 12, status: 'Open', mitigation: 'Pre-provision dev tenant; parallel network validation. Assign backup SME.', owner: 'Infrastructure' },
    { id: 'R2', risk: 'Key resource attrition', category: 'Resource', prob: 2, impact: 5, score: 10, status: 'Mitigating', mitigation: 'Cross-train BI developers; document runbooks. Identify backup contractors.', owner: 'PMO' },
    { id: 'R3', risk: 'Scope creep in Phase 3', category: 'Scope', prob: 4, impact: 4, score: 16, status: 'Open', mitigation: 'Strict change control; phase gate approval. Freeze scope 2 weeks before phase start.', owner: 'Steering' },
    { id: 'R4', risk: 'License cost increase', category: 'Budget', prob: 2, impact: 3, score: 6, status: 'Accepted', mitigation: 'Lock in annual pricing; monitor SAP price lists. Budget 5% buffer for renewals.', owner: 'Procurement' },
    { id: 'R5', risk: 'Regulatory audit findings', category: 'Compliance', prob: 2, impact: 5, score: 10, status: 'Open', mitigation: 'Align with pharma data governance; document lineage. Quarterly compliance review.', owner: 'QA' }
  ];

  const MITIGATION_SUGGESTIONS = {
    Technical: ['Pre-provision environments', 'Parallel validation', 'Fallback architecture', 'Early POC de-risking'],
    Resource: ['Cross-training', 'Documentation', 'Backup contractors', 'Knowledge sharing sessions'],
    Scope: ['Change control process', 'Phase gate approval', 'Scope freeze dates', 'Stakeholder sign-off'],
    Budget: ['Contingency reserve', 'Monthly variance review', 'Early warning triggers', 'Re-baseline process'],
    Compliance: ['Governance alignment', 'Audit trail documentation', 'Quarterly reviews', 'External audit prep']
  };

  const BOTTLENECKS = [
    { id: 'B1', name: 'SAC tenant connectivity', type: 'dependency', severity: 'high', impact: 'Blocks Phase 2 dashboard development', owner: 'Infrastructure', since: '3 days' },
    { id: 'B2', name: 'Senior Architect availability', type: 'resource', severity: 'medium', impact: 'Design decisions delayed; 2 tasks waiting', owner: 'PMO', since: '1 week' },
    { id: 'B3', name: 'Change request approval', type: 'approval', severity: 'medium', impact: 'Scope change for HCP analytics pending steering sign-off', owner: 'Steering', since: '5 days' },
    { id: 'B4', name: 'Data quality validation', type: 'process', severity: 'high', impact: 'Datasphere models blocked until source data validated', owner: 'Data Eng', since: '4 days' },
    { id: 'B5', name: 'License procurement', type: 'approval', severity: 'low', impact: 'AI Core licenses for Phase 4; not urgent', owner: 'Procurement', since: '2 weeks' }
  ];

  const CRITICAL_ACTIVITIES = [
    { id: 'CA1', activity: 'SAP BTP → SAC connectivity', phase: 2, slack: 0, due: 'Week 20', onCriticalPath: true },
    { id: 'CA2', activity: 'Core data models (star schema)', phase: 2, slack: 2, due: 'Week 24', onCriticalPath: true },
    { id: 'CA3', activity: 'Brand Performance dashboard', phase: 2, slack: 0, due: 'Week 26', onCriticalPath: true },
    { id: 'CA4', activity: 'SFE & HCP analytics', phase: 2, slack: 1, due: 'Week 28', onCriticalPath: true },
    { id: 'CA5', activity: 'Patient funnel analytics', phase: 3, slack: 0, due: 'Week 36', onCriticalPath: true },
    { id: 'CA6', activity: 'Invoice Processing PoC', phase: 4, slack: 3, due: 'Week 54', onCriticalPath: true }
  ];

  const PRIORITY_ACTIONS = [
    { id: 'A1', action: 'Resolve SAC connectivity – escalate to SAP support', priority: 'P1', due: '2 days', owner: 'Infrastructure', status: 'In progress' },
    { id: 'A2', action: 'Complete data quality validation for Datasphere sources', priority: 'P1', due: '3 days', owner: 'Data Eng', status: 'Pending' },
    { id: 'A3', action: 'Steering sign-off on HCP scope change', priority: 'P2', due: '5 days', owner: 'PMO', status: 'Pending' },
    { id: 'A4', action: 'Assign backup for Architect design decisions', priority: 'P2', due: '1 week', owner: 'PMO', status: 'Pending' },
    { id: 'A5', action: 'Kick off Brand Performance dashboard development', priority: 'P2', due: 'Week 20', owner: 'BI Dev', status: 'Blocked' }
  ];

  function $(sel, el = document) { return el.querySelector(sel); }
  function $$(sel, el = document) { return Array.from((el || document).querySelectorAll(sel)); }

  // What-If
  function updateWhatIf() {
    const budgetDelta = parseInt($('#wiBudget')?.value || 0) / 100;
    const timelineDelta = parseInt($('#wiTimeline')?.value || 0);
    const util = parseInt($('#wiResource')?.value || 78);
    const contingencyPct = parseInt($('#wiContingency')?.value || 0) / 100;

    const newBudget = BASE.budget * (1 + budgetDelta);
    const newWeeks = BASE.weeks + timelineDelta;
    const contingencyUsed = BASE.contingency * contingencyPct;
    const burnRate = BASE.spent / 18;
    const estTotalSpend = BASE.spent + (burnRate * (newWeeks - 18) * (util / BASE.utilization));
    const budgetStatus = estTotalSpend <= newBudget - contingencyUsed ? 'On track' : 'Over budget';
    const estCompletion = 18 + Math.ceil((100 - BASE.progress) / (BASE.progress / 18));

    const html = `
      <div class="whatif-result-grid">
        <div class="whatif-result"><span>Adjusted Budget</span><strong>$${(newBudget/1000).toFixed(0)}K</strong></div>
        <div class="whatif-result"><span>Adjusted Timeline</span><strong>${newWeeks} weeks</strong></div>
        <div class="whatif-result"><span>Est. Total Spend</span><strong>$${(estTotalSpend/1000).toFixed(0)}K</strong></div>
        <div class="whatif-result"><span>Contingency Used</span><strong>$${(contingencyUsed/1000).toFixed(0)}K</strong></div>
        <div class="whatif-result"><span>Budget Status</span><strong class="${budgetStatus === 'On track' ? 'text-good' : 'text-bad'}">${budgetStatus}</strong></div>
        <div class="whatif-result"><span>Est. Completion (weeks)</span><strong>${estCompletion}</strong></div>
      </div>
    `;
    $('#whatifResults').innerHTML = html;
  }

  function applyPreset(val) {
    const sliders = { wiBudget: 0, wiTimeline: 0, wiResource: 78, wiContingency: 0 };
    if (val === 'optimistic') { sliders.wiBudget = -5; sliders.wiTimeline = -2; sliders.wiResource = 90; }
    else if (val === 'pessimistic') { sliders.wiBudget = 15; sliders.wiTimeline = 8; sliders.wiResource = 65; sliders.wiContingency = 50; }
    else if (val === 'delay') { sliders.wiTimeline = 6; sliders.wiContingency = 20; }
    else if (val === 'overrun') { sliders.wiBudget = 10; sliders.wiContingency = 80; }
    $('#wiBudget').value = sliders.wiBudget; $('#wiBudgetVal').textContent = sliders.wiBudget + '%';
    $('#wiTimeline').value = sliders.wiTimeline; $('#wiTimelineVal').textContent = sliders.wiTimeline;
    $('#wiResource').value = sliders.wiResource; $('#wiResourceVal').textContent = sliders.wiResource + '%';
    $('#wiContingency').value = sliders.wiContingency; $('#wiContingencyVal').textContent = sliders.wiContingency + '%';
    updateWhatIf();
  }

  // Risk
  function renderRisks() {
    const tbody = $('#riskTable')?.querySelector('tbody');
    if (!tbody) return;
    tbody.innerHTML = RISKS.map(r => `
      <tr class="risk-row" data-id="${r.id}">
        <td>${r.id}</td><td>${r.risk}</td><td>${r.category}</td>
        <td>${r.prob}/5</td><td>${r.impact}/5</td>
        <td><span class="risk-score risk-${r.score >= 12 ? 'high' : r.score >= 8 ? 'med' : 'low'}">${r.score}</span></td>
        <td><span class="risk-status">${r.status}</span></td>
      </tr>
    `).join('');
    $$('.risk-row').forEach(row => {
      row.addEventListener('click', () => showRiskDetail(row.dataset.id));
    });
  }

  function showRiskDetail(id) {
    const r = RISKS.find(x => x.id === id);
    if (!r) return;
    const suggestions = MITIGATION_SUGGESTIONS[r.category] || [];
    $('#riskDetailContent').innerHTML = `
      <div class="risk-detail-card">
        <p><strong>${r.risk}</strong></p>
        <p><strong>Mitigation:</strong> ${r.mitigation}</p>
        <p><strong>Owner:</strong> ${r.owner}</p>
        <h5>Suggested Mitigations (${r.category})</h5>
        <ul>${suggestions.map(s => `<li>${s}</li>`).join('')}</ul>
      </div>
    `;
  }

  // Forecast
  let chartForecast;
  function runForecast() {
    const type = $('#forecastType')?.value || 'spend';
    const horizon = parseInt($('#forecastHorizon')?.value || 8);
    const summary = $('#forecastSummary');
    const weeklyBurn = 55;
    const progressRate = 28 / 18;

    if (type === 'spend') {
      const historical = [312, 358, 406, 461, 516, 567];
      const forecastData = historical.concat(Array.from({ length: horizon - 5 }, (_, i) => 567 + weeklyBurn * (i + 1)));
      const labels = Array.from({ length: Math.min(historical.length + horizon, 20) }, (_, i) => 'W' + (13 + i));
      const finalSpend = forecastData[Math.min(horizon + 5, forecastData.length - 1)];
      summary.innerHTML = `<p><strong>Spend Forecast:</strong> Est. $${(finalSpend || 567 + weeklyBurn * horizon).toFixed(0)}K at Week ${18 + horizon}. Weekly burn ~$${weeklyBurn}K.</p>`;
      if (typeof Chart !== 'undefined' && $('#chartForecast')) {
        if (chartForecast) chartForecast.destroy();
        chartForecast = new Chart($('#chartForecast'), {
          type: 'line',
          data: {
            labels: labels.slice(0, forecastData.length),
            datasets: [
              { label: 'Actual', data: historical, borderColor: CHART_COLORS.accent },
              { label: 'Forecast', data: forecastData, borderColor: CHART_COLORS.teal, borderDash: [5, 5] }
            ]
          },
          options: { responsive: true, plugins: { legend: { labels: { color: '#94a3b8' } } }, scales: { x: { ticks: { color: '#94a3b8' } }, y: { ticks: { color: '#94a3b8', callback: v => '$' + v + 'K' } } } }
        });
      }
    } else if (type === 'progress') {
      const histProgress = [12, 18, 22, 25, 28];
      const forecastProgress = histProgress.concat(Array.from({ length: horizon }, (_, i) => Math.min(100, 28 + progressRate * (i + 1))));
      const estProgress = Math.min(100, 28 + progressRate * horizon);
      summary.innerHTML = `<p><strong>Progress Forecast:</strong> Est. ${estProgress.toFixed(0)}% at Week ${18 + horizon}. Based on current velocity of ${progressRate.toFixed(1)}% per week.</p>`;
      if (typeof Chart !== 'undefined' && $('#chartForecast')) {
        if (chartForecast) chartForecast.destroy();
        chartForecast = new Chart($('#chartForecast'), {
          type: 'line',
          data: {
            labels: Array.from({ length: forecastProgress.length }, (_, i) => 'W' + (14 + i)),
            datasets: [
              { label: 'Actual', data: histProgress, borderColor: CHART_COLORS.accent },
              { label: 'Forecast', data: forecastProgress, borderColor: CHART_COLORS.teal, borderDash: [5, 5] }
            ]
          },
          options: { responsive: true, plugins: { legend: { labels: { color: '#94a3b8' } } }, scales: { x: { ticks: { color: '#94a3b8' } }, y: { ticks: { color: '#94a3b8', callback: v => v + '%' } } } }
        });
      }
    } else {
      const weeksToComplete = Math.ceil((100 - 28) / progressRate);
      summary.innerHTML = `<p><strong>Completion Forecast:</strong> Est. completion Week ${18 + weeksToComplete} (${weeksToComplete} weeks from now).</p><p>Assumes current progress rate (${progressRate.toFixed(1)}%/week) continues.</p>`;
      if (typeof Chart !== 'undefined' && $('#chartForecast')) {
        if (chartForecast) chartForecast.destroy();
        chartForecast = new Chart($('#chartForecast'), {
          type: 'line',
          data: {
            labels: ['Start', 'M1', 'M2', 'M3', 'Completion'],
            datasets: [{ label: 'Progress to Completion', data: [28, 40, 60, 80, 100], borderColor: CHART_COLORS.accent, fill: true, backgroundColor: 'rgba(14,165,233,0.1)' }]
          },
          options: { responsive: true, plugins: { legend: { labels: { color: '#94a3b8' } } }, scales: { x: { ticks: { color: '#94a3b8' } }, y: { ticks: { color: '#94a3b8', callback: v => v + '%' } } } }
        });
      }
    }
  }

  // Bottlenecks
  function renderBottlenecks() {
    const filter = $('#bottleneckFilter')?.value || 'all';
    const filtered = filter === 'all' ? BOTTLENECKS : BOTTLENECKS.filter(b => b.type === filter);
    const list = $('#bottleneckList');
    const summary = $('#bottleneckSummary');
    if (!list || !summary) return;
    list.innerHTML = filtered.map(b => `
      <div class="bottleneck-card bottleneck-${b.severity}">
        <div class="bottleneck-header">
          <span class="bottleneck-type">${b.type}</span>
          <span class="bottleneck-severity">${b.severity}</span>
        </div>
        <h4>${b.name}</h4>
        <p>${b.impact}</p>
        <div class="bottleneck-meta"><span>Owner: ${b.owner}</span><span>Since: ${b.since}</span></div>
      </div>
    `).join('');
    const highCount = filtered.filter(b => b.severity === 'high').length;
    summary.innerHTML = `<p><strong>Summary:</strong> ${filtered.length} bottleneck(s) · ${highCount} high severity requiring immediate attention.</p>`;
  }

  // Critical Activities & Actions
  function renderCritical() {
    $('#criticalActivities').innerHTML = `
      <div class="critical-table-wrap">
        <table class="blueprint-table">
          <thead><tr><th>Activity</th><th>Phase</th><th>Slack</th><th>Due</th><th>Critical Path</th></tr></thead>
          <tbody>
            ${CRITICAL_ACTIVITIES.map(a => `
              <tr class="${a.slack === 0 ? 'critical-path' : ''}">
                <td>${a.activity}</td><td>${a.phase}</td><td>${a.slack} wks</td><td>${a.due}</td>
                <td><span class="critical-badge">${a.onCriticalPath ? 'Yes' : 'No'}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    $('#criticalActions').innerHTML = `
      <div class="actions-list">
        ${PRIORITY_ACTIONS.map(a => `
          <div class="action-card action-p${a.priority.replace('P','')}">
            <div class="action-header">
              <span class="action-priority">${a.priority}</span>
              <span class="action-status">${a.status}</span>
            </div>
            <h4>${a.action}</h4>
            <div class="action-meta">
              <span>Due: ${a.due}</span>
              <span>Owner: ${a.owner}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    $$('.critical-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        $$('.critical-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        $('#criticalActivities').style.display = tab.dataset.tab === 'activities' ? 'block' : 'none';
        $('#criticalActions').style.display = tab.dataset.tab === 'actions' ? 'block' : 'none';
      });
    });
  }

  function init() {
    $('#wiBudget')?.addEventListener('input', () => { $('#wiBudgetVal').textContent = $('#wiBudget').value + '%'; updateWhatIf(); });
    $('#wiTimeline')?.addEventListener('input', () => { $('#wiTimelineVal').textContent = $('#wiTimeline').value; updateWhatIf(); });
    $('#wiResource')?.addEventListener('input', () => { $('#wiResourceVal').textContent = $('#wiResource').value + '%'; updateWhatIf(); });
    $('#wiContingency')?.addEventListener('input', () => { $('#wiContingencyVal').textContent = $('#wiContingency').value + '%'; updateWhatIf(); });
    $('#wiPreset')?.addEventListener('change', () => applyPreset($('#wiPreset').value));
    $('#btnAddRisk')?.addEventListener('click', () => alert('Add Risk: Opens form to add new risk. (Demo – connect to backend for persistence)'));
    $('#btnRunForecast')?.addEventListener('click', runForecast);
    $('#bottleneckFilter')?.addEventListener('change', renderBottlenecks);
    updateWhatIf();
    renderRisks();
    showRiskDetail('R1');
    renderBottlenecks();
    renderCritical();
    setTimeout(runForecast, 300);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else setTimeout(init, 100);
})();
