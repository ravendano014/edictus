CREATE PROCEDURE `actoAddOrEdit`(
  IN _id INT,
  IN _acto VARCHAR(255)
)
BEGIN 
  IF _id = 0 THEN
    INSERT INTO acto (acto)
    VALUES (_acto);

    SET _id = LAST_INSERT_ID();
  ELSE
    UPDATE acto
    SET
    acto = _acto
    WHERE id_acto = _id;
  END IF;

  SELECT _id AS 'id';
END