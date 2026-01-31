<?php

require_once 'branch.php';


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

try {
    $action = $_REQUEST['action'] ?? null;
    $action = is_string($action) ? trim(filter_var($action, FILTER_SANITIZE_FULL_SPECIAL_CHARS)) : null;

    if (!$action) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'No action specified']);
        exit();
    }
    $branches = new Branch();

    switch ($action) {

        case 'get':
            $page = filter_input(INPUT_GET, 'page', FILTER_VALIDATE_INT, ['options' => ['default' => 1, 'min_range' => 1]]) ?: 1;
            $limit = filter_input(INPUT_GET, 'limit', FILTER_VALIDATE_INT, ['options' => ['default' => 20, 'min_range' => 1]]) ?: 20;

            $offset = ($page - 1) * $limit;
            $totalItems = $branches->countBranches();
            $totalPages = ceil($totalItems / $limit);
            $data = $branches->getBranches($limit, $offset);

            sendJson([
                'success' => true,
                'data' => $data,
                'total_items' => $totalItems,
                'total_pages' => $totalPages,
                'current_page' => $page,
                'limit' => $limit
            ]);
            break;


        case "add":
            $errors = [];

            // Validate branch_name
            $branch_name = filter_input(INPUT_POST, 'branch_name', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            if (empty(trim($branch_name))) {
                $errors['branch_name'] = 'Tên chi nhánh là bắt buộc.';
            } elseif (mb_strlen($branch_name) > 255) {
                $errors['branch_name'] = 'Tên chi nhánh không được dài hơn 255 ký tự.';
            }

            // Validate address
            $address = filter_input(INPUT_POST, 'address', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            if (empty(trim($address))) {
                $errors['address'] = 'Địa chỉ là bắt buộc.';
            }

            // Validate phone
            $phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            if (empty(trim($phone))) {
                $errors['phone'] = 'Số điện thoại là bắt buộc.';
            } elseif (!preg_match('/^(\+84|0)[35789]\d{8}$/', $phone)) {
                $errors['phone'] = 'Định dạng số điện thoại không hợp lệ.';
            }

            // Validate open_time
            $open_time = filter_input(INPUT_POST, 'open_time', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            if (empty(trim($open_time))) {
                $errors['open_time'] = 'Thời gian mở cửa là bắt buộc.';
            } elseif (!preg_match('/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/', $open_time)) {
                $errors['open_time'] = 'Định dạng thời gian không hợp lệ. Vui lòng sử dụng HH:MM hoặc HH:MM:SS.';
            }

            // Validate close_time
            $close_time = filter_input(INPUT_POST, 'close_time', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            if (empty(trim($close_time))) {
                $errors['close_time'] = 'Thời gian đóng cửa là bắt buộc.';
            } elseif (!preg_match('/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/', $close_time)) {
                $errors['close_time'] = 'Định dạng thời gian không hợp lệ. Vui lòng sử dụng HH:MM hoặc HH:MM:SS.';
            }

            if (!empty($errors)) {
                sendJson(['success' => false, 'message' => 'Dữ liệu không hợp lệ', 'errors' => $errors], 422);
                break;
            }

            $data = $branches->addbranch($branch_name, $address, $phone, $open_time, $close_time);

            if ($data) {
                sendJson([
                    'success' => true,
                    'message' => 'Add branch successfully',
                    'branch_id' => $data
                ], 201);
            } else {
                sendJson(['success' => false, 'message' => 'Thêm chi nhánh thất bại'], 400);
            }
            break;

        case "update":
            $errors = [];
            $branch_id = filter_input(INPUT_POST, 'branch_id', FILTER_VALIDATE_INT);
            
            if (!$branch_id) {
                sendJson(['success' => false, 'message' => 'Branch ID is required'], 400);
            }

            // Validate branch_name
            $branch_name = filter_input(INPUT_POST, 'branch_name', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            if (empty(trim($branch_name))) {
                $errors['branch_name'] = 'Tên chi nhánh là bắt buộc.';
            } elseif (mb_strlen($branch_name) > 255) {
                $errors['branch_name'] = 'Tên chi nhánh không được dài hơn 255 ký tự.';
            }

            // Validate address
            $address = filter_input(INPUT_POST, 'address', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            if (empty(trim($address))) {
                $errors['address'] = 'Địa chỉ là bắt buộc.';
            }

            // Validate phone
            $phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            if (empty(trim($phone))) {
                $errors['phone'] = 'Số điện thoại là bắt buộc.';
            } elseif (!preg_match('/^(\+84|0)[35789]\d{8}$/', $phone)) {
                $errors['phone'] = 'Định dạng số điện thoại không hợp lệ.';
            }

            // Validate open_time
            $open_time = filter_input(INPUT_POST, 'open_time', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            if (empty(trim($open_time))) {
                $errors['open_time'] = 'Thời gian mở cửa là bắt buộc.';
            } elseif (!preg_match('/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/', $open_time)) {
                $errors['open_time'] = 'Định dạng thời gian không hợp lệ. Vui lòng sử dụng HH:MM hoặc HH:MM:SS.';
            }

            // Validate close_time
            $close_time = filter_input(INPUT_POST, 'close_time', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            if (empty(trim($close_time))) {
                $errors['close_time'] = 'Thời gian đóng cửa là bắt buộc.';
            } elseif (!preg_match('/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/', $close_time)) {
                $errors['close_time'] = 'Định dạng thời gian không hợp lệ. Vui lòng sử dụng HH:MM hoặc HH:MM:SS.';
            }

            if (!empty($errors)) {
                sendJson(['success' => false, 'message' => 'Dữ liệu không hợp lệ', 'errors' => $errors], 422);
                break;
            }

            $success = $branches->updateBranch($branch_id, $branch_name, $address, $phone, $open_time, $close_time);

            if ($success) {
                sendJson(['success' => true, 'message' => 'Cập nhật chi nhánh thành công']);
            } else {
                sendJson(['success' => false, 'message' => 'Cập nhật chi nhánh thất bại'], 500);
            }
            break;

            case 'getById':
                $branch_id = filter_input(INPUT_POST, 'branch_id', FILTER_VALIDATE_INT) ?: filter_input(INPUT_GET, 'branch_id', FILTER_VALIDATE_INT);
                $page = filter_input(INPUT_GET, 'page', FILTER_VALIDATE_INT, ['options' => ['default' => 1, 'min_range' => 1]]) ?: 1;
                $limit = filter_input(INPUT_GET, 'limit', FILTER_VALIDATE_INT, ['options' => ['default' => 20, 'min_range' => 1]]) ?: 20;
                
                if(!$branch_id) {
                    sendJson(['success' => false, 'message' => 'branch_id required'], 400);
                }

                $offset = ($page - 1) * $limit;
                $totalItems = $branches->countFieldsByBranch($branch_id);
                $totalPages = ceil($totalItems / $limit);
                $data = $branches->getBranchById($branch_id, $limit, $offset);

                sendJson([
                    'success' =>true,
                    'data' => $data,
                    'total_items' => $totalItems,
                    'total_pages' => $totalPages,
                    'current_page' => $page,
                    'limit' => $limit
                ]);

                break;

                // lấy dữ liệu branch theo fft id
                case "get-branch-fftId":
                    $field_field_type_id = filter_input(INPUT_POST, 'field_field_type_id', FILTER_VALIDATE_INT) ?: filter_input(INPUT_GET, 'field_field_type_id', FILTER_VALIDATE_INT);

                    $data = $branches->getBranchByFieldFieldTypeId($field_field_type_id);

                    sendJson([
                        'success' =>true,
                        'data' => $data,
                    ]);
                break;

        default:
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid action']);
            break;
    }
} catch (PDOException $e) {
}
