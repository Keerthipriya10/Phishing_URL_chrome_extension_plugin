<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Origin: null");
header("Content-Type: application/json");


$data = json_decode(file_get_contents("php://input"));

//$string = $data->URL.",".$data->IPAddress.",".$data->URL_Length.",".$data->Tiny_URL.",".$data->AtSymbol.",".$data->Redirecting.",".$data->PrefixSuffix_in_domain.",".$data->No_of_Sub_Domains.",".$data->HTTPS.",".$data->Favicon.",".$data->Port.",".$data->HTTPSinURLsdomainpart.",".$data->RequestURL.",".$data->Anchor.",".$data->ScriptLink.",".$data->SFH.",".$data->mailto.",".$data->iFrames;
$string = $data->URL.",".$data->IPAddress.",".$data->URL_Length.",".$data->Tiny_URL.",".$data->AtSymbol.",".$data->Redirecting.",".$data->PrefixSuffix_in_domain.",".$data->No_of_Sub_Domains.",".$data->HTTPS.",".$data->RequestURL.",".$data->Anchor.",".$data->ScriptLink.",".$data->SFH.",".$data->mailto.",".$data->iFrames;

$result = shell_exec('python check.py ' . escapeshellarg(json_encode($string)));
echo $result;


?>

