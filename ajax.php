<?php
	
	$combineArr = array_combine($_REQUEST['selectedFields'], $_REQUEST['enteredContent']);
	$json_output = json_encode($combineArr);
	
	echo json_encode($json_output);

?>