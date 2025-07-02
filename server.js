const express = require('express');
const { spawn } = require('child_process');
const cors = require('cors');

const app = express();
app.use(cors());

const mcp = spawn('node', ['stdio.js']);

mcp.stderr.on('data', data => console.error('MCP stderr:', data.toString()));

app.get('/api/zoning', (req, res) => {
  const query = req.query.q || 'תכנון עיר תל אביב';

  const payload = JSON.stringify({
    tool: "find_datasets",
    input: { query }
  }) + '\n';

  mcp.stdin.write(payload);

  let buffer = '';

  const handler = (data) => {
    buffer += data.toString();
    try {
      const json = JSON.parse(buffer);
      res.json(json);
      mcp.stdout.off('data', handler);
    } catch (e) {}
  };

  mcp.stdout.on('data', handler);
});

app.listen(3000, () => {
  console.log('MCP API ready at http://localhost:3000');
});
