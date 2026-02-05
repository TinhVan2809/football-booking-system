<?php

    require_once 'field.php';


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


    try{
        $action = $_REQUEST['action'] ?? null;
        $action = is_string($action) ? trim(filter_var($action, FILTER_SANITIZE_FULL_SPECIAL_CHARS)) : null;

        if (!$action) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'No action specified']);
            exit();
        }

        $fields = new Field();

    switch ($action) {
        case 'get':
            $page = filter_input(INPUT_GET, 'page', FILTER_VALIDATE_INT, ['options' => ['default' => 1, 'min_range' => 1]]) ?: 1;
            $limit = filter_input(INPUT_GET, 'limit', FILTER_VALIDATE_INT, ['options' => ['default' => 25, 'min_range' => 1]]) ?: 25;

            $offset = ($page - 1) * $limit;
            $totalItems = $fields->coutFields();
            $totalPages = ceil($totalItems / $limit);
            $data = $fields->getFields($limit, $offset);

            sendJson([
                'success' => true,
                'data' => $data,
                'total_items' => $totalItems,
                'total_pages' => $totalPages,
                'current_page' => $page,
                'limit' => $limit
            ]);
            break;

        case 'get-field-types':
            $data = $fields->getFieldTypes();
            sendJson([
                'success' => true,
                'data' => $data
            ]);
            break;

        case 'add-field-type':
            $errors = [];

            $type_name = filter_input(INPUT_POST, 'type_name', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            $players = filter_input(INPUT_POST, 'players', FILTER_VALIDATE_INT);
            $type_code = filter_input(INPUT_POST, 'type_code', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            $thumbnail = filter_input(INPUT_POST, 'thumbnail', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            $description = filter_input(INPUT_POST, 'description', FILTER_SANITIZE_FULL_SPECIAL_CHARS);

            if (empty(trim((string)$type_name))) {
                $errors['type_name'] = 'type_name is required';
            } elseif (mb_strlen((string)$type_name) > 20) {
                $errors['type_name'] = 'type_name max length is 20';
            }

            if (!$players || $players < 1) {
                $errors['players'] = 'players must be a positive integer';
            }

            $type_code = is_string($type_code) ? trim($type_code) : '';
            if ($type_code === '') {
                $type_code = $players ? ('f' . $players) : '';
            }
            if ($type_code !== '' && mb_strlen($type_code) > 10) {
                $errors['type_code'] = 'type_code max length is 10';
            }

            $thumbnail = is_string($thumbnail) ? trim($thumbnail) : null;
            if ($thumbnail !== null && $thumbnail !== '' && mb_strlen($thumbnail) > 255) {
                $errors['thumbnail'] = 'thumbnail max length is 255';
            }

            if (!empty($errors)) {
                sendJson(['success' => false, 'message' => 'Invalid data', 'errors' => $errors], 422);
            }

            $newId = $fields->addFieldType((string)$type_name, (int)$players, $type_code, $thumbnail ?: null, is_string($description) ? trim($description) : null);
            if ($newId) {
                sendJson(['success' => true, 'message' => 'Created', 'data' => ['field_type_id' => $newId]], 201);
            }
            sendJson(['success' => false, 'message' => 'Create failed'], 500);
            break;

        case 'add-field':
            $errors = [];

            $branch_id = filter_input(INPUT_POST, 'branch_id', FILTER_VALIDATE_INT);
            $field_name = trim((string) filter_input(INPUT_POST, 'field_name'));
            $thumbnail = filter_input(INPUT_POST, 'thumbnail', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            $status = filter_input(INPUT_POST, 'status', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            $description = filter_input(INPUT_POST, 'description', FILTER_SANITIZE_FULL_SPECIAL_CHARS);

            if (!$branch_id || $branch_id < 1) {
                $errors['branch_id'] = 'branch_id is required';
            }

            if (empty(trim((string)$field_name))) {
                $errors['field_name'] = 'field_name is required';
            } elseif (mb_strlen((string)$field_name) > 50) {
                $errors['field_name'] = 'field_name max length is 50';
            }

            $allowedFieldStatus = ['available', 'maintenance'];
            $status = is_string($status) ? trim($status) : '';
            if ($status === '') {
                $status = 'available';
            }
            if (!in_array($status, $allowedFieldStatus, true)) {
                $errors['status'] = 'status is invalid';
            }

            $thumbnail = is_string($thumbnail) ? trim($thumbnail) : null;
            if ($thumbnail !== null && $thumbnail !== '' && mb_strlen($thumbnail) > 255) {
                $errors['thumbnail'] = 'thumbnail max length is 255';
            }

            if (!empty($errors)) {
                sendJson(['success' => false, 'message' => 'Invalid data', 'errors' => $errors], 422);
            }

            $newId = $fields->addField((int)$branch_id, (string)$field_name, $thumbnail ?: null, $status, is_string($description) ? trim($description) : null);
            if ($newId) {
                sendJson(['success' => true, 'message' => 'Created', 'data' => ['field_id' => $newId]], 201);
            }
            sendJson(['success' => false, 'message' => 'Create failed'], 500);
            break;

        case 'upsert-field-field-type':
            $errors = [];

            $field_id = filter_input(INPUT_POST, 'field_id', FILTER_VALIDATE_INT);
            $field_type_id = filter_input(INPUT_POST, 'field_type_id', FILTER_VALIDATE_INT);
            $price_per_hour_raw = filter_input(INPUT_POST, 'price_per_hour', FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
            $max_players = filter_input(INPUT_POST, 'max_players', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            $status = filter_input(INPUT_POST, 'status', FILTER_SANITIZE_FULL_SPECIAL_CHARS);

            if (!$field_id || $field_id < 1) {
                $errors['field_id'] = 'field_id is required';
            }
            if (!$field_type_id || $field_type_id < 1) {
                $errors['field_type_id'] = 'field_type_id is required';
            }

            if ($price_per_hour_raw === null || $price_per_hour_raw === '' || !is_numeric($price_per_hour_raw)) {
                $errors['price_per_hour'] = 'price_per_hour is required';
            }

            $price_per_hour = is_numeric($price_per_hour_raw) ? (float)$price_per_hour_raw : 0;
            if ($price_per_hour < 0) {
                $errors['price_per_hour'] = 'price_per_hour must be >= 0';
            }

            $allowedFFTStatus = ['available', 'maintenance', 'locked'];
            $status = is_string($status) ? trim($status) : '';
            if ($status === '') {
                $status = 'available';
            }
            if (!in_array($status, $allowedFFTStatus, true)) {
                $errors['status'] = 'status is invalid';
            }

            $max_players = is_string($max_players) ? trim($max_players) : null;
            if ($max_players !== null && $max_players !== '' && mb_strlen($max_players) > 255) {
                $errors['max_players'] = 'max_players max length is 255';
            }

            if (!empty($errors)) {
                sendJson(['success' => false, 'message' => 'Invalid data', 'errors' => $errors], 422);
            }

            $success = $fields->upsertFieldFieldType((int)$field_id, (int)$field_type_id, (float)$price_per_hour, $max_players ?: null, $status);
            if ($success) {
                $fftId = $fields->getFieldFieldTypeId((int)$field_id, (int)$field_type_id);
                sendJson(['success' => true, 'message' => 'Saved', 'data' => ['field_field_type_id' => $fftId]]);
            }
            sendJson(['success' => false, 'message' => 'Save failed'], 500);
            break;

        default:
            sendJson(['success' => false, 'message' => 'Invalid action'], 400);
            break;
    }

    } catch(PDOException $e) {
        error_log('General Error in Cart_api_endpoint.php: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'An unexpected error occurred']);
    }

?>
