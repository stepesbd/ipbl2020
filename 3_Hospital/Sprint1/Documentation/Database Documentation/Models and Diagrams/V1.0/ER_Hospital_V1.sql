SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `hospital`;
DROP TABLE IF EXISTS `address`;
DROP TABLE IF EXISTS `hospital_employee`;
DROP TABLE IF EXISTS `employee`;
DROP TABLE IF EXISTS `cbo`;
DROP TABLE IF EXISTS `specialty`;
DROP TABLE IF EXISTS `hospital_specialty`;
DROP TABLE IF EXISTS `medical_procedures`;
DROP TABLE IF EXISTS `hosp_med_proc`;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `hospital` (
    `id` INTEGER NOT NULL,
    `cnpj` INTEGER NOT NULL,
    `cnes_code` INTEGER NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `corporate_name` VARCHAR(100) NOT NULL,
    `address_id` INTEGER NOT NULL,
    `phone_number` INTEGER NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE (`cnpj`, `cnes_code`)
);

CREATE TABLE `address` (
    `id` INTEGER NOT NULL,
    `street` VARCHAR(255) NOT NULL,
    `number` INTEGER NOT NULL,
    `city` VARCHAR(50) NOT NULL,
    `state` VARCHAR(50) NOT NULL,
    `country` VARCHAR(50) NOT NULL,
    `zip_code` INTEGER NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE `hospital_employee` (
    `hospital_id` INTEGER NOT NULL,
    `employee_id` INTEGER NOT NULL,
    `admission_date` DATE NOT NULL,
    `demission_date` DATE NOT NULL,
    `salary` DECIMAL NOT NULL
);

CREATE TABLE `employee` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `cns_code` INTEGER NOT NULL,
    `cbo_id` INTEGER NOT NULL,
    `address_id` INTEGER NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE `cbo` (
    `id` INTEGER NOT NULL,
    `code` INTEGER NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE `specialty` (
    `id` INTEGER NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE `hospital_specialty` (
    `hospital_id` INTEGER NOT NULL,
    `specialty_id` INTEGER NOT NULL
);

CREATE TABLE `medical_procedures` (
    `id` INTEGER NOT NULL,
    `cbhpm_code` INTEGER NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `uco` DECIMAL NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE `hosp_med_proc` (
    `hospital_id` INTEGER NOT NULL,
    `med_proc_id` INTEGER NOT NULL,
    `value` DECIMAL NOT NULL
);

ALTER TABLE `hospital` ADD FOREIGN KEY (`address_id`) REFERENCES `address`(`id`);
ALTER TABLE `hospital_employee` ADD FOREIGN KEY (`hospital_id`) REFERENCES `hospital`(`id`);
ALTER TABLE `hospital_employee` ADD FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`);
ALTER TABLE `employee` ADD FOREIGN KEY (`address_id`) REFERENCES `address`(`id`);
ALTER TABLE `employee` ADD FOREIGN KEY (`cbo_id`) REFERENCES `cbo`(`id`);
ALTER TABLE `hospital_specialty` ADD FOREIGN KEY (`hospital_id`) REFERENCES `hospital`(`id`);
ALTER TABLE `hospital_specialty` ADD FOREIGN KEY (`specialty_id`) REFERENCES `specialty`(`id`);
ALTER TABLE `hosp_med_proc` ADD FOREIGN KEY (`hospital_id`) REFERENCES `hospital`(`id`);
ALTER TABLE `hosp_med_proc` ADD FOREIGN KEY (`med_proc_id`) REFERENCES `medical_procedures`(`id`);