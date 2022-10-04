drop table if exists ivm cascade;
drop table if exists category cascade;
drop table if exists simple_category cascade;
drop table if exists super_category cascade;
drop table if exists has_other cascade;
drop table if exists product cascade;
drop table if exists has_category cascade;
drop table if exists point_of_retail cascade;
drop table if exists installed_at cascade;
drop table if exists shelf cascade;
drop table if exists planogram cascade;
drop table if exists retailer cascade;
drop table if exists responsible_for cascade;
drop table if exists replenishment_event cascade;

----------------------------------------
-- TABLE CREATION
----------------------------------------

-- Named constraints are global to the database.
-- Therefore the following use the following naming rules:
--   1. pk_table for names of primary key constraints
--   2. fk_table_another for names of foreign key constraints

create table category (
	category_name varchar(255) not null,
	constraint pk_category primary key(category_name)
	--  RI-RE1 (non-applicable):
	-- O valor do atributo nome de qualquer registo da relação categoria 
	-- tem de existir em na relação categoria_simples ou na relação super_categoria
);

create table simple_category (
	category_name varchar(255) not null,
	constraint pk_simple_category primary key(category_name),
	constraint fk_simple_category_category foreign key(category_name) references category(category_name)
--  RI-RE2: O valor do aributo nome de qualquer registo de categoria_simples 
-- não pode existir em super_categoria
);

create table super_category (
	category_name varchar(255) not null,
	constraint pk_super_category primary key(category_name),
	constraint fk_super_category_category foreign key(category_name) references category(category_name)
--  RI-RE3: O valor do atributo nome de qualquer registo tem de existir 
-- no atributo super_categoria da relação constituída
);

create table has_other (
	super_category varchar(255) not null,
	child_category varchar(255) not null,
	constraint pk_has_other primary key(child_category),
	constraint fk_has_other_super_category foreign key(super_category) references super_category(category_name),
	constraint fk_has_other_category foreign key(child_category) references category(category_name)
--  RI-RE4 não podem existir valores repetidos dos atributos 
-- super_categoria e categoria 
-- numa sequência de registos relacionados pela FK categoria
--  RI-RE5: Para qualquer registo desta relação, 
-- verifica-se que os atributos super_categoria e categoria são distintos
);

create table product (
	product_ean char(13) not null,
	category_name varchar(255) not null,
	product_descr varchar(255),
	constraint pk_product primary key(product_ean),
	constraint fk_product_simple_category foreign key(category_name) references simple_category(category_name)
--  RI-RE6: O valor do atributo ean existente em qualquer registo da relação 
-- produto tem de existir também no atributo ean da relação tem_categoria
);

create table has_category (
	product_ean char(13) not null,
	category_name varchar(255) not null,
	constraint pk_has_category primary key(product_ean, category_name),
	constraint fk_has_category_product foreign key(product_ean) references product(product_ean),
	constraint fk_has_category_category foreign key(category_name) references category(category_name)
);

create table ivm (
	ivm_serial_number numeric(5,0) not null,
	ivm_manuf varchar(255) not null,
	constraint pk_ivm primary key(ivm_serial_number, ivm_manuf)
);

create table point_of_retail (
	point_name varchar(255) not null,
	point_district varchar(255) not null,
	point_municipality varchar(255) not null,
	constraint pk_point_of_retail primary key(point_name)
);

create table installed_at (
	ivm_serial_number numeric(5,0) not null,
	ivm_manuf varchar(255) not null,
	point_name varchar(255) not null,
	constraint pk_installed_at primary key(ivm_serial_number, ivm_manuf),
	constraint fk_installed_at_ivm foreign key(ivm_serial_number, ivm_manuf) references ivm(ivm_serial_number, ivm_manuf),
	constraint fk_installed_at_point_of_retail foreign key(point_name) references point_of_retail(point_name)
);

create table shelf (
	shelf_nr numeric(16,0) not null,
	ivm_serial_number numeric(5,0) not null,
	ivm_manuf varchar(255) not null,
	shelf_height numeric(5, 2) not null,
	category_name varchar(255) not null,
	constraint pk_shelf primary key(shelf_nr, ivm_serial_number, ivm_manuf),
	constraint fk_shelf_ivm foreign key(ivm_serial_number, ivm_manuf) references ivm(ivm_serial_number, ivm_manuf),
	constraint fk_shelf_category foreign key(category_name) references category(category_name)
);

create table planogram (
	product_ean char(13) not null,
	shelf_nr numeric(16,0) not null,
	ivm_serial_number numeric(5,0) not null,
	ivm_manuf varchar(255) not null,
	faces_seen numeric(16, 0) not null,
	units numeric(3, 0) not null,
	loc numeric(3, 0) not null,
	constraint pk_planogram primary key(product_ean, shelf_nr, ivm_serial_number, ivm_manuf),
	constraint fk_planogram_product foreign key(product_ean) references product(product_ean),
	constraint fk_planogram_shelf foreign key(shelf_nr, ivm_serial_number, ivm_manuf) references shelf(shelf_nr, ivm_serial_number, ivm_manuf)
);

create table retailer (
	retailer_tin varchar(9) not null,
	retailer_name varchar(255) not null unique,
	constraint pk_retailer primary key(retailer_tin)
-- RI-RE7: unique(name)
);

create table responsible_for (
	category_name varchar(255) not null,
	retailer_tin varchar(9) not null,
	ivm_serial_number numeric(5,0) not null,
	ivm_manuf varchar(255) not null,
	constraint pk_responsible_for primary key(retailer_tin, category_name, ivm_serial_number, ivm_manuf),
	constraint fk_responsible_for_category foreign key(category_name) references category(category_name),
	constraint fk_responsible_for_retailer foreign key(retailer_tin) references retailer(retailer_tin),
	constraint fk_responsible_for_ivm foreign key(ivm_serial_number, ivm_manuf) references ivm(ivm_serial_number, ivm_manuf)
);

create table replenishment_event (
	product_ean char(13) not null,
	shelf_nr numeric(16,0) not null,
	ivm_serial_number numeric(5,0) not null,
	ivm_manuf varchar(255) not null,
	event_instant date not null,
	replenished_units numeric(3, 0) not null,
	retailer_tin varchar(9) not null,
	constraint pk_replenishment_event primary key(product_ean, shelf_nr, ivm_serial_number, ivm_manuf, event_instant),
	constraint fk_replenishment_event_planogram foreign key(product_ean, shelf_nr, ivm_serial_number, ivm_manuf) references planogram(product_ean, shelf_nr, ivm_serial_number, ivm_manuf),
	constraint fk_replenishment_event_retailer foreign key(retailer_tin) references retailer(retailer_tin)
);



--------------------------------------------------
-- EXTRAS (FUNCTIONS, STORED PROCEDURES, TRIGGERS)
--------------------------------------------------

-- Inserting a sub-category
-------------------------------------
CREATE OR REPLACE PROCEDURE add_sub(father varchar(255), new varchar(255))
AS
$$
BEGIN
        INSERT INTO category values(new);
        INSERT INTO simple_category values(new);
        IF father NOT IN (SELECT * FROM super_category) THEN
                INSERT INTO super_category values(father);
        END IF;
        INSERT INTO has_other values(father, new);
END;
$$ LANGUAGE plpgsql;


-- Deleting a category
-------------------------------------
DROP PROCEDURE if exists delete_cat(name);
CREATE OR REPLACE PROCEDURE delete_cat(name varchar(255))
AS
$$
	DECLARE c CURSOR FOR (SELECT * FROM list_subs(name));
	DECLARE var varchar(255);
BEGIN
	OPEN c;
	LOOP
		FETCH c INTO var;
		EXIT WHEN NOT FOUND;
		DELETE FROM has_other WHERE child_category=var;
		CALL delete_cat_aux(var);
	END LOOP;
	CLOSE c;
	CALL delete_cat_aux(name);
END;
$$ LANGUAGE plpgsql;

DROP PROCEDURE if exists delete_cat_aux(name);
CREATE OR REPLACE PROCEDURE delete_cat_aux(name varchar(255))
AS
$$
    DECLARE ean has_category.product_ean%TYPE;
    DECLARE c_aux CURSOR FOR (SELECT * FROM has_category WHERE category_name=name);
    DECLARE myvar has_category%ROWTYPE;
BEGIN
    OPEN c_aux;
    LOOP
        FETCH c_aux INTO myvar;
        EXIT WHEN NOT FOUND;
        SELECT myvar.product_ean INTO ean;
        DELETE FROM has_category WHERE product_ean = ean;
	DELETE FROM replenishment_event WHERE product_ean = ean;
        DELETE FROM planogram WHERE product_ean = ean;
    END LOOP;
    DELETE FROM responsible_for WHERE category_name=name;
    DELETE FROM shelf WHERE category_name=name;
    DELETE FROM product WHERE category_name=name;

	DELETE FROM has_other WHERE child_category = name;
        DELETE FROM simple_category WHERE category_name = name;
	DELETE FROM has_other WHERE super_category = name;
        DELETE FROM super_category WHERE category_name = name;

    DELETE FROM category WHERE category_name=name;
    CLOSE c_aux;
END
$$ LANGUAGE plpgsql;


-- List sub-categories, all depths
----------------------------------------------------
CREATE OR REPLACE FUNCTION list_subs(name varchar(255)) 
RETURNS table(category_name varchar(255))
AS
$$
WITH RECURSIVE list_aux(super_name) AS (
    SELECT
        child_category
    FROM
        has_other
    WHERE
        super_category=name
    UNION
        SELECT
            child_category
        FROM
            has_other h INNER JOIN list_aux l ON h.super_category = l.super_name 
) SELECT
    *
FROM
    list_aux;
$$ LANGUAGE sql;