import express from 'express';
import cors from 'cors';
import { HttpServerTransport } from '@modelcontextprotocol/sdk/server/http.js';
import { createMcpServer } from './lib/server.js'; // ודא שזה הנתיב הנכון לפי התיקייה שלך

const app = express();
app.use(cors());
app.use(express.json());

const mcp = createMcpServer({
  name: "data-gov-il-js",
  version: "2.0.0",
  description: "MCP server for data.gov.il via HTTP"
});

const transport = new HttpServerTransport({ app });

mcp.connect(transport).then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ MCP HTTP API ready on port ${PORT}`);
  });
});
