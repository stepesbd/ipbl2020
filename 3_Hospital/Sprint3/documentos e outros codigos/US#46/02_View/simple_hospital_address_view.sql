CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `stepesbd-mysql`@`%` 
    SQL SECURITY DEFINER
VIEW `simple_hospital_address_view` AS
    SELECT 
        `H`.`hos_cnpj` AS `hos_cnpj`,
        `H`.`hos_name` AS `hos_name`,
        `A`.`add_street` AS `add_street`,
        `A`.`add_number` AS `add_number`,
        `A`.`add_city` AS `add_city`,
        `A`.`add_state` AS `add_state`
    FROM
        (`Hospital` `H`
        JOIN `Address` `A`)
    WHERE
        (`H`.`add_id` = `A`.`add_id`)