CREATE TABLE fornecedor_stock_audit (
'SA_ID' int NOT NULL AUTO_INCREMENT,
'STK_PRODUCT_id' int,
'UPDATED' datetime);

DELIMITER $$
CREATE TRIGGER fornecedor_stock_after_insert
AFTER INSERT
   ON fornecedor_stock FOR EACH ROW
BEGIN
   INSERT INTO fornecedor_stock_audit
   ( STK_PRODUCT_id,
     UPDATED
     )
   VALUES
   ( NEW.STK_PRODUCT_id,
     SYSDATE()
     );

END; $$

CREATE TRIGGER fornecedor_stock_after_update
AFTER UPDATE
   ON fornecedor_stock FOR EACH ROW
BEGIN
   INSERT INTO fornecedor_stock_audit
   ( STK_PRODUCT_id,
     UPDATED
     )
   VALUES
   ( NEW.STK_PRODUCT_id,
     SYSDATE()
     );

END; $$


CREATE TABLE fornecedor_provider_audit (
'PA_ID' int NOT NULL AUTO_INCREMENT,
'PRO_ID' int,
'UPDATED' datetime);


CREATE TRIGGER fornecedor_provider_after_insert
AFTER INSERT
   ON fornecedor_provider FOR EACH ROW

BEGIN
   INSERT INTO fornecedor_provider_audit
   ( PRO_ID,
     UPDATED
     )
   VALUES
   ( NEW.PRO_ID,
     SYSDATE()
     );
END; $$


CREATE TRIGGER fornecedor_provider_after_update
AFTER UPDATE
   ON fornecedor_provider FOR EACH ROW
BEGIN
   INSERT INTO fornecedor_provider_audit
   ( PRO_ID,
     UPDATED
     )
   VALUES
   ( NEW.PRO_ID,
     SYSDATE()
     );
END; $$
DELIMITER ;