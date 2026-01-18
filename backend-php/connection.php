<?php

    class Database {
        private static $instance = null;
        private $conn;

        private $servername;
        private $dbname;
        private $username;
        private $password;

        private function __construct() 
        {
            $iniPath = __DIR__ . "/php.ini";
            
            if(!file_exists($iniPath)) {
                throw new Exception("File php.ini doesn't exits!");
            }
            $ini = parse_ini_file($iniPath);
            $requireKey = ["servername", "dbname", "username", "password"];
            foreach($requireKey as $Key) {
                if(!isset($ini[$Key])){
                    throw new Exception("Missing Key: $Key in php.ini file!");
                }
            }

            $this->servername = $ini["servername"];
            $this->dbname = $ini["dbname"];
            $this->username = $ini["username"];
            $this->password = $ini["password"];

            $opt = [
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8",
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];

            try{
                $dsn = "mysql:host={$this->servername};dbname={$this->dbname};charset=utf8";
                $this->conn = new PDO($dsn, $this->username, $this->password, $opt);
            } catch(PDOException $e) {
                throw new Exception("Error! Can't connect to database: " . $e->getMessage());
            }
        }

        // Correct method name
        public static function getInstance() {
            if (self::$instance === null) {
                self::$instance = new Database();
            }

            return self::$instance;
        }

        // Backwards-compatible alias for older code that used the misspelled method
        public static function getInstace() {
            return self::getInstance();
        }

        public function getConnection(){
            return $this->conn;
        }

        private function __clone(){}

       
    }

?>