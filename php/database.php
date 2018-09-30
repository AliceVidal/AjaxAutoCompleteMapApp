<?php

$dsn = "mysql:host=localhost;dbname=locations;";
$username = "mgs_user";
$password = "pa55word";

try {
    $db = new PDO($dsn , $username , $password);
    $db ->setAttribute(PDO::ATTR_EMULATE_PREPARES, FALSE);
    $db ->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    error_reporting(E_ALL);
    
    
} catch (PDOException $e) {
    $erroe_message = $e ->getMessage();
    include("database_error.php");
    exit();
}

















