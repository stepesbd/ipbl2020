CREATE DEFINER=`stepesbd-mysql`@`%` TRIGGER `stepesbd`.`Ord_seller_consumer_AFTER_INSERT`
AFTER INSERT ON `Ord_seller_consumer` FOR EACH ROW
BEGIN
	UPDATE `Order` SET ord_status = 'aproved'
    WHERE ord_status = 'processing';
END