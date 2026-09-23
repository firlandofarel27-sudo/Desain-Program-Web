package com.titipin;

import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.file.Files;
import java.nio.file.Path;

public class Main {

    public static void main(String[] args) throws Exception {

        HttpServer server = HttpServer.create(
                new InetSocketAddress("0.0.0.0", 8080),
                0
        );

        server.createContext("/", Main::handleRequest);

        server.setExecutor(null);

        server.start();

        System.out.println("=================================");
        System.out.println("TITIPIN Web Server");
        System.out.println("=================================");
        System.out.println("Laptop : http://localhost:8080");
        System.out.println("HP     : http://IP-LAPTOP:8080");
        System.out.println("Server berjalan di port 8080");
        System.out.println("=================================");
    }

    private static void handleRequest(HttpExchange exchange) throws IOException {

        String path = exchange.getRequestURI().getPath();

        if (path.equals("/")) {
            path = "/index.html";
        }

        Path file = Path.of("web" + path);

        if (Files.exists(file) && !Files.isDirectory(file)) {

            byte[] response = Files.readAllBytes(file);

            String contentType = getContentType(file.toString());

            exchange.getResponseHeaders()
                    .set("Content-Type", contentType);

            exchange.sendResponseHeaders(200, response.length);

            try (OutputStream os = exchange.getResponseBody()) {
                os.write(response);
            }

        } else {

            String response = "404 - File tidak ditemukan";

            exchange.sendResponseHeaders(404, response.length());

            try (OutputStream os = exchange.getResponseBody()) {
                os.write(response.getBytes());
            }
        }
    }

    private static String getContentType(String file) {

        if (file.endsWith(".html")) {
            return "text/html; charset=UTF-8";
        }

        if (file.endsWith(".css")) {
            return "text/css; charset=UTF-8";
        }

        if (file.endsWith(".js")) {
            return "application/javascript; charset=UTF-8";
        }

        if (file.endsWith(".png")) {
            return "image/png";
        }

        if (file.endsWith(".jpg") || file.endsWith(".jpeg")) {
            return "image/jpeg";
        }

        if (file.endsWith(".svg")) {
            return "image/svg+xml";
        }

        return "application/octet-stream";
    }
}