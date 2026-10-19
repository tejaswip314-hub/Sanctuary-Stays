const fs = require('fs');
const os = require('os');
const path = require('path');

let raw = fs.readFileSync(path.join(os.tmpdir(), 'opencode_session_latest.json'), 'utf16le');
if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
const data = JSON.parse(raw);

data.messages.forEach((m, idx) => {
  if (m.info?.role === 'user') {
    const text = (m.parts || []).map(p => p.text || '').join('\n');
    console.log(`\n================== USER PROMPT [Msg #${idx}] ==================`);
    console.log(text);
  }
});
