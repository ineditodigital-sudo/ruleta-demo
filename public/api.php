<?php
// CORS Headers - Allow any origin to connect
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Path to the config file stored on the server
$config_file = __DIR__ . '/ruleta-config.json';

// ── GET: Return the current config ──────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($config_file)) {
        http_response_code(200);
        echo file_get_contents($config_file);
    } else {
        // No config saved yet – return null so the client uses defaults
        http_response_code(200);
        echo json_encode(null);
    }
    exit();
}

// ── POST: Save a new config ──────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);

    if ($data === null) {
        http_response_code(400);
        echo json_encode(['error' => 'JSON inválido recibido']);
        exit();
    }

    // Write the config atomically using a temp file → rename trick
    $tmp = $config_file . '.tmp';
    $written = file_put_contents($tmp, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

    if ($written === false) {
        http_response_code(500);
        echo json_encode(['error' => 'No se pudo escribir el archivo de configuración. Verifica permisos.']);
        exit();
    }

    rename($tmp, $config_file);

    http_response_code(200);
    echo json_encode(['success' => true]);
    exit();
}

// Any other method is not allowed
http_response_code(405);
echo json_encode(['error' => 'Método no permitido']);
