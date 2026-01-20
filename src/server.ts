import http, { IncomingMessage, ServerResponse } from "http";

const PORT = 3000;

const requestListener = (req: IncomingMessage, res: ServerResponse) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end('Hello, World!\n');
}

const server = http.createServer(requestListener);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

