<?php
$inData = getRequestInfo();

$id = 0;
$name = "";
$phone = "";
$email = "";
$dob = "";
$photo = 0;
$found = false;
$amountOfContacts = 5;
$offset = $inData["index"] * $amountOfContacts;
$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if ($conn->connect_error) {
        returnWithError($conn->connect_error);
} else {
        $stmt = "";
        $sizestmt = "";
        if (!empty($inData["search"])) {
                $stmt = $conn->prepare("select * from Contacts where Name like ? and UserId=? order by Name limit 5 offset ?");
                $contactName = "%" . $inData["search"] . "%";
                $sizestmt = sprintf('select COUNT(*) from Contacts where Name like "%s" and UserId=%d', $contactName, $inData["userId"]);
                $stmt->bind_param("sss", $contactName, $inData["userId"], $offset);

        } else {
                $stmt = $conn->prepare(sprintf("select * from Contacts where UserId = %d order by Name limit 5 offset %d", $inData["userId"], $offset));
                $sizestmt = sprintf("select COUNT(*) from Contacts where UserId = %d", $inData["userId"]);
        }
        $stmt->execute();
        $result = $stmt->get_result();


        $sres = mysqli_query($conn, $sizestmt);
        $data = mysqli_fetch_assoc($sres);
        $sizeOfResult = $data["COUNT(*)"];

        $j .= "[";
        $count = 0;
        while ($row = mysqli_fetch_array($result)) {
                $found = true;
                $id = $row["ID"];
                $name = $row["Name"];
                $phone = $row["Phone"];
                $email = $row["Email"];
                $server = $row["Server"];
                $photo = $row["Photo"];
                $error = "";
                $hold = $offset + 5;
                if ($count == 4 && $sizeOfResult - $hold == 0) {
                        $error = "OOB-SOON";
                }

                $j .= jsonInfo($id, $name, $phone, $email, $server, $photo, $error);
                $count += 1;
        }
        //substring removes the final comma
        $j = substr($j, 0, strlen($j) - 1);
        $j .= "]";
        if ($found) {
                sendResultInfoAsJson($j);
        } else {
                returnWithError("Out of Bounds");
        }

        $stmt->close();
        //$sizestmt->close();
        $conn->close();
}

function getRequestInfo()
{
        return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
        header('Content-type: application/json');
        echo $obj;
}

function returnWithError($err)
{
        $retValue = '{"id":0,"name":"","phone":"","email":"","server":"","photo":0,"error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
}

function jsonInfo($id, $name, $phone, $email, $dob, $photo, $error)
{
        $retValue = sprintf('{"id":%d,"name":"%s","phone":"%s","email":"%s","server":"%s","photo":%d,"error":"%s"},', $id, $name, $phone, $email, $dob, $photo, $error);
        return $retValue;
}
?>