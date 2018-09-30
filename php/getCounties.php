<?php

require_once('database.php');
$counties = filter_input(INPUT_POST, 'data');


$query = "SELECT name FROM counties WHERE country_id = ( select id from countries where country = :county)";
$statement = $db->prepare($query);
$statement->bindValue(":county", $counties);
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
        $json .= '{"name":"' . $row->name . '"}';
        
        $isFirstRecord = false;
    }  
}     
$json .= "]";

/* Send the $json string back to the webpage that sent the AJAX request */
echo $json;
