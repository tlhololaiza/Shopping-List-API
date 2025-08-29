import http, { IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';
import { itemService } from './services/itemService';
import { ItemValidator } from './models/item';

const PORT = process.env.PORT || 3000;

function parseRequestBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const parsed = body ? JSON.parse(body) : {};
        resolve(parsed);
      } catch (error) {
        reject(new Error('Invalid JSON'));
      }
    });
    
    req.on('error', (error) => {
      reject(error);
    });
  });
}

function sendJsonResponse(res: ServerResponse, statusCode: number, data: any) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

function sendErrorResponse(res: ServerResponse, statusCode: number, message: string, errors?: string[]) {
  sendJsonResponse(res, statusCode, {
    success: false,
    message,
    errors
  });
}

function extractIdFromPath(pathname: string): string | null {
  const parts = pathname.split('/');
  if (parts.length === 3 && parts[1] === 'items') {
    return parts[2];
  }
  return null;
}

async function requestHandler(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url || '', `http://localhost:${PORT}`);
  const pathname = url.pathname;
  const method = req.method || 'GET';

  if (method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  try {
    // Health check endpoint
    if (pathname === '/health' && method === 'GET') {
      sendJsonResponse(res, 200, {
        success: true,
        message: 'Shopping List API is running',
        timestamp: new Date().toISOString()
      });
      return;
    }

    // GET /items - Get all items
    if (pathname === '/items' && method === 'GET') {
      const items = itemService.getAllItems();
      sendJsonResponse(res, 200, {
        success: true,
        data: items,
        count: items.length
      });
      return;
    }

    // POST /items - Create new item
    if (pathname === '/items' && method === 'POST') {
      try {
        const body = await parseRequestBody(req);
        const validation = ItemValidator.validateCreateItem(body);
        
        if (!validation.isValid) {
          sendErrorResponse(res, 400, 'Validation failed', validation.errors);
          return;
        }

        const item = itemService.createItem(body);
        sendJsonResponse(res, 201, {
          success: true,
          message: 'Item created successfully',
          data: item
        });
        return;
      } catch (error) {
        sendErrorResponse(res, 400, 'Invalid JSON in request body');
        return;
      }
    }

    // GET /items/:id - Get single item
    if (pathname.startsWith('/items/') && method === 'GET') {
      const id = extractIdFromPath(pathname);
      if (!id) {
        sendErrorResponse(res, 400, 'Invalid item ID');
        return;
      }

      const item = itemService.getItemById(id);
      if (!item) {
        sendErrorResponse(res, 404, 'Item not found');
        return;
      }

      sendJsonResponse(res, 200, {
        success: true,
        data: item
      });
      return;
    }

    // PUT /items/:id - Update item
    if (pathname.startsWith('/items/') && method === 'PUT') {
      const id = extractIdFromPath(pathname);
      if (!id) {
        sendErrorResponse(res, 400, 'Invalid item ID');
        return;
      }

      try {
        const body = await parseRequestBody(req);
        const validation = ItemValidator.validateUpdateItem(body);
        
        if (!validation.isValid) {
          sendErrorResponse(res, 400, 'Validation failed', validation.errors);
          return;
        }

        const item = itemService.updateItem(id, body);
        if (!item) {
          sendErrorResponse(res, 404, 'Item not found');
          return;
        }

        sendJsonResponse(res, 200, {
          success: true,
          message: 'Item updated successfully',
          data: item
        });
        return;
      } catch (error) {
        sendErrorResponse(res, 400, 'Invalid JSON in request body');
        return;
      }
    }

    // DELETE /items/:id - Delete item
    if (pathname.startsWith('/items/') && method === 'DELETE') {
      const id = extractIdFromPath(pathname);
      if (!id) {
        sendErrorResponse(res, 400, 'Invalid item ID');
        return;
      }

      const deleted = itemService.deleteItem(id);
      if (!deleted) {
        sendErrorResponse(res, 404, 'Item not found');
        return;
      }

      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
      res.end();
      return;
    }

    // 404 - Route not found
    sendErrorResponse(res, 404, `Route ${pathname} not found`);

  } catch (error) {
    console.error('Server error:', error);
    sendErrorResponse(res, 500, 'Internal server error');
  }
}

const server = http.createServer(requestHandler);

server.listen(PORT, () => {
  console.log(`🚀 Shopping List API server running on port ${PORT}`);
  console.log(`📝 Health check available at http://localhost:${PORT}/health`);
  console.log(`🛒 Items endpoint available at http://localhost:${PORT}/items`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});