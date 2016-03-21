<?php 

if (isset($_REQUEST['usernname']) && isset($_REQUEST['lastname']) && isset($_REQUEST['email_address']) && isset($_REQUEST['subject']) && isset($_REQUEST['button'])) {

	$to = 'matjaz.moser@gmail.com';
	$username = $_REQUEST['usernname'];
	$lastname = $_REQUEST['lastname'];
	$email_address = $_REQUEST['email_address'];
	$subject = $_REQUEST['subject'];
	$message = $_REQUEST['message'];

	if (!empty($username) && !empty($lastname) && !empty($username) && !empty($email_address) && !empty($subject) && !empty($message)) {
		$body = $username." ".$lastname."\n".$email_address."\n".$message;
		$headers = 'From: '.$email_address;

		if (mail($to, $subject, $body, $headers)){
			echo "<script type='text/javascript'>alert('Submitted successfully!')</script>";
		} else {
			echo "<script type='text/javascript'>alert('Something went wrong. We are working on it!')</script>";
		}
	} else {
		echo "<script type='text/javascript'>alert('Fill in all the data!')</script>";
	}
}

?>
