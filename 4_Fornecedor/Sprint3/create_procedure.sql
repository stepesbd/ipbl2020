DELIMITER $$

CREATE PROCEDURE LIST_ALL_PROVIDERS()
BEGIN
	SELECT PRO_CNPJ,PRO_SOCIAL_REASON,PRO_ADRESS,PRO_CONTACT  
	FROM FORNECEDOR_PROVIDER
	ORDER BY PRO_SOCIAL_REASON;
END $$

DELIMITER ;