/**
 * Anthropic AI Assistant - Project Q&A Chat Widget
 */
(function() {
  const API_URL = '/api/chat';

  function createWidget() {
    const container = document.createElement('div');
    container.id = 'ai-assistant-root';
    container.innerHTML = `
      <button id="ai-assistant-toggle" class="ai-toggle" aria-label="Open AI Assistant">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <span>AI Assistant</span>
      </button>
      <div id="ai-assistant-panel" class="ai-panel" hidden>
        <div class="ai-panel-header">
          <h3>Project Q&A</h3>
          <p>Ask about SAP GCC, pharma analytics, or this portfolio</p>
          <button id="ai-assistant-close" class="ai-close" aria-label="Close">×</button>
        </div>
        <div id="ai-assistant-messages" class="ai-messages"></div>
        <div class="ai-input-area">
          <textarea id="ai-assistant-input" placeholder="Ask a question..." rows="2"></textarea>
          <button id="ai-assistant-send" class="ai-send">Send</button>
        </div>
      </div>
    `;
    document.body.appendChild(container);
    return container;
  }

  function addStyles() {
    if (document.getElementById('ai-assistant-styles')) return;
    const style = document.createElement('style');
    style.id = 'ai-assistant-styles';
    style.textContent = `
      #ai-assistant-root { position: fixed; bottom: 24px; right: 24px; z-index: 9999; font-family: inherit; }
      .ai-toggle { display: flex; align-items: center; gap: 8px; padding: 12px 20px; background: #0ea5e9; color: #0a0e17; border: none; border-radius: 12px; font-weight: 600; font-size: 14px; cursor: pointer; box-shadow: 0 4px 20px rgba(14,165,233,0.4); transition: transform 0.2s, box-shadow 0.2s; }
      .ai-toggle:hover { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(14,165,233,0.5); }
      .ai-panel { position: absolute; bottom: 60px; right: 0; width: 380px; max-width: calc(100vw - 48px); max-height: 520px; background: #111827; border: 1px solid rgba(148,163,184,0.12); border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.5); display: flex; flex-direction: column; overflow: hidden; }
      .ai-panel[hidden] { display: none !important; }
      .ai-panel-header { padding: 16px; border-bottom: 1px solid rgba(148,163,184,0.12); position: relative; }
      .ai-panel-header h3 { font-size: 16px; font-weight: 600; margin: 0 0 4px 0; }
      .ai-panel-header p { font-size: 12px; color: #94a3b8; margin: 0; }
      .ai-close { position: absolute; top: 12px; right: 12px; background: none; border: none; color: #94a3b8; font-size: 24px; cursor: pointer; line-height: 1; padding: 0; }
      .ai-close:hover { color: #f1f5f9; }
      .ai-messages { flex: 1; overflow-y: auto; padding: 16px; min-height: 200px; max-height: 320px; }
      .ai-msg { margin-bottom: 16px; padding: 12px; border-radius: 10px; font-size: 14px; line-height: 1.5; }
      .ai-msg.user { background: rgba(14,165,233,0.15); margin-left: 24px; }
      .ai-msg.assistant { background: rgba(30,41,59,0.8); margin-right: 24px; }
      .ai-msg.error { background: rgba(239,68,68,0.15); color: #fca5a5; }
      .ai-input-area { padding: 12px; border-top: 1px solid rgba(148,163,184,0.12); display: flex; gap: 8px; align-items: flex-end; }
      #ai-assistant-input { flex: 1; padding: 10px 12px; background: #0f172a; border: 1px solid rgba(148,163,184,0.2); border-radius: 8px; color: #f1f5f9; font-family: inherit; font-size: 14px; resize: none; }
      #ai-assistant-input:focus { outline: none; border-color: #0ea5e9; }
      .ai-send { padding: 10px 16px; background: #0ea5e9; color: #0a0e17; border: none; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; }
      .ai-send:hover { background: #14b8a6; }
      .ai-send:disabled { opacity: 0.6; cursor: not-allowed; }
    `;
    document.head.appendChild(style);
  }

  function init() {
    addStyles();
    const root = createWidget();
    const toggle = root.querySelector('#ai-assistant-toggle');
    const panel = root.querySelector('#ai-assistant-panel');
    const closeBtn = root.querySelector('#ai-assistant-close');
    const messages = root.querySelector('#ai-assistant-messages');
    const input = root.querySelector('#ai-assistant-input');
    const sendBtn = root.querySelector('#ai-assistant-send');

    let history = [];

    toggle.addEventListener('click', () => {
      panel.hidden = !panel.hidden;
      if (!panel.hidden) input.focus();
    });

    closeBtn.addEventListener('click', () => { panel.hidden = true; });

    function addMessage(role, content, isError) {
      const div = document.createElement('div');
      div.className = `ai-msg ${role}${isError ? ' error' : ''}`;
      div.textContent = content;
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
    }

    async function sendMessage() {
      const text = input.value.trim();
      if (!text) return;

      input.value = '';
      addMessage('user', text);
      history.push({ role: 'user', content: text });

      sendBtn.disabled = true;
      addMessage('assistant', 'Thinking...');

      try {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text, history: history })
        });
        const data = await res.json();

        messages.removeChild(messages.lastChild);

        if (res.ok && data.reply) {
          addMessage('assistant', data.reply);
          history.push({ role: 'assistant', content: data.reply });
        } else {
          addMessage('assistant', data.error || data.reply || 'Unable to get response.', true);
        }
      } catch (err) {
        messages.removeChild(messages.lastChild);
        addMessage('assistant', 'Network error. Please check your connection and try again.', true);
      }
      sendBtn.disabled = false;
    }

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
