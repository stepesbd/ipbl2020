CREATE DEFINER=`stepesbd-mysql`@`%` PROCEDURE `simple_hospital_contacts_procedure`(IN hosp_name VARCHAR(100))
BEGIN
	SELECT H.hos_name, C.con_desc, C.con_type
	FROM Hospital H,
		Hospital_contact HC,
		Contact C
	WHERE 
	H.hos_id = HC.hos_id and C.con_id = HC.con_id and H.hos_name
    LIKE CONCAT( '% ', hosp_name, '%');
END