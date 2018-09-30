<?php
require_once('database.php');


$towns = filter_input(INPUT_POST, 'data');

$query = "SELECT townName FROM towns WHERE countyID = ( select id from counties where name = :town)";
$statement = $db->prepare($query);
$statement->bindValue(":town", $towns);
$statement->execute();


/* Manipulate the query result */
$json = "[";
if ($statement->rowCount() > 0)
{
    /* Get field information for all fields */
    $isFirstRecord = true;
    $result = $statement->fetchAll(PDO::FETCH_OBJ);
    foreach ($result as $row)
    {
        if(!$isFirstRecord)
        {
            $json .= ",";
        }
        
        /* NOTE: json strings MUST have double quotes around the attribute names, as shown below */
        $json .= '{"townName":"' . $row->townName . '"}';
        
        $isFirstRecord = false;
    }  
}     
$json .= "]";

/* Send the $json string back to the webpage that sent the AJAX request */
echo $json;


