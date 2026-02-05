<?php

require_once 'pricing_rule.php';

/**
 * Handle CORS (Cross-Origin Resource Sharing)
 */
function handleCORS()
{
    $allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5173',
        'http://localhost:5174',
        'http://localhost:5175',
    ];

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    if (in_array($origin, $allowedOrigins, true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
    }

    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Max-Age: 86400');

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}

handleCORS();

function sendJson($payload, int $status = 200)
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

header('Content-Type: application/json');

try {
    $action = $_REQUEST['action'] ?? null;
    $action = is_string($action) ? trim(filter_var($action, FILTER_SANITIZE_FULL_SPECIAL_CHARS)) : null;

    if (!$action) {
        sendJson(['success' => false, 'message' => 'No action specified'], 400);
    }

    $pricingRule = new PricingRule();

    switch ($action) {
        case 'upsert-default':
            $field_field_type_id = filter_input(INPUT_POST, 'field_field_type_id', FILTER_VALIDATE_INT) ?: filter_input(INPUT_GET, 'field_field_type_id', FILTER_VALIDATE_INT);
            if (!$field_field_type_id) {
                sendJson(['success' => false, 'message' => 'field_field_type_id required'], 400);
            }

            $result = $pricingRule->upsertDefaultRules((int)$field_field_type_id);
            if ($result === null) {
                sendJson(['success' => false, 'message' => 'field_field_type_id not found'], 404);
            }
            if ($result === false) {
                sendJson(['success' => false, 'message' => 'Cannot upsert default pricing rules'], 500);
            }

            sendJson(['success' => true, 'message' => 'Saved', 'data' => $result]);
            break;

        default:
            sendJson(['success' => false, 'message' => 'Invalid action'], 400);
            break;
    }
} catch (PDOException $e) {
    error_log('General Error in pricing_rules api: ' . $e->getMessage());
    sendJson(['success' => false, 'message' => 'An unexpected error occurred'], 500);
}
