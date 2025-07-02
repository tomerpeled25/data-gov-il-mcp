const express = require('express');
const { spawn } = require('child_process');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const mcp = spawn('node', ['stdio.js']);

mcp.stderr.on('data', (data) => {
  console.error('MCP stderr:', data.toString());
});

mcp.stdout.on('data', (data) => {
  try {
    const response = JSON.parse(data.toString());
    if (response && response.id && pendingResponses[response.id]) {
      pendingResponses[response.id](response);
      delete pendingResponses[response.id];
    }
  } catch (e) {
    console.error('Failed to parse MCP response:', e);
  }
});

const pendingResponses = {};
let requestId = 1;

function askMCP(tool, input) {
  return new Promise((resolve) => {
    const id = (requestId++).toString();
    pendingResponses[id] = resolve;

    const payload = JSON.stringify({ id, tool, input });
    mcp.stdin.write(payload + '\n');
  });
}

// דוגמה ל־API פשוט: מאפשר לשלוח שאילתה (למשל "?q=בן ציון תל אביב")
app.get('/api/zoning', async (req, res) => {
  const query = req.query.q || 'תכנון עיר תל אביב';
  const result = await askMCP('find_datasets', { query });
  res.json(result);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ MCP API Server is running on port ${PORT}`);
});
