import express from 'express';
import cors from 'cors';
import { HttpServerTransport } from '@modelcontextprotocol/sdk/server/http.js';
import { createMcpServer } from './lib/server.js'; // ודא שהנתיב נכון

const app = express();
app.use(cors());
app.use(express.json());

// יצירת MCP
const mcp = createMcpServer();

// הגדרת transport מסוג HTTP
const transport = new HttpServerTransport({ app });

// חיבור ה-MCP לשרת
mcp.connect(transport).then(() => {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`✅ MCP API ready at http://localhost:${port}`);
  });
});
