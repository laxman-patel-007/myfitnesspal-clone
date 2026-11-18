import http.server
import socketserver

PORT = 3000

class NoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    # Disable 304 responses by clearing incoming conditional headers
    def send_head(self):
        self.headers['If-Modified-Since'] = None
        self.headers['If-None-Match'] = None
        return super().send_head()

socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("", PORT), NoCacheHTTPRequestHandler) as httpd:
    print(f"Serving at port {PORT} with strict no-cache")
    httpd.serve_forever()
