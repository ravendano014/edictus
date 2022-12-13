const express = require('express');
const router = express.Router();

const mysqlConnection  = require('../database.js');

// GET all Materias
/**
 * @swagger
 * /materias:
 *  get:
 *    description: Use to request all materias
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/', (req, res) => {
  mysqlConnection.query('SELECT * FROM materia', (err, rows, fields) => {
    if(!err) {
      res.json(rows);
    } else {
      res.json({error: err});
    }
  });  
});

// GET An Materia
/**
 * @swagger
*  /materias/{id_materia}:
*    get:
*      tags:
*      - materia
*      summary: Find materia by ID
*      description: Returns a single materia
*      operationId: getMaterias
*      produces:
*      - application/json
*      parameters:
*      - name: id_materia
*        in: path
*        description: ID of materia to return
*        required: true
*        type: integer
*        format: int64
*      responses:
*        200:
*          description: successful operation
*        400:
*          description: Invalid ID supplied
*        404:
*          description: materia not found
*      security:
*      - api_key: []
*/
router.get('/:id', (req, res) => {
  const { id } = req.params; 
  mysqlConnection.query('SELECT * FROM materia WHERE id_materia = ?', [id], (err, rows, fields) => {
    if (!err) {
      res.json(rows[0]);
    } else {
      res.json({error: err});
    }
  });
});

// DELETE An Materia
/**
 * @swagger
*  /materias/{id_materia}:
*    delete:
*      tags:
*      - materia
*      summary: Deletes an materia
*      operationId: delMateria
*      produces:
*      - application/json
*      parameters:
*      - name: api_key
*        in: header
*        required: false
*        type: string
*      - name: materiaId
*        in: path
*        description: Materia id to delete
*        required: true
*        type: integer
*        format: int64
*      responses:
*        400:
*          description: Invalid ID supplied
*        404:
*          description: Materia not found
*      security:
*      - materiastore_auth:
*        - write:materias
*        - read:materias
*/
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  mysqlConnection.query('DELETE FROM materia WHERE id = ?', [id], (err, rows, fields) => {
    if(!err) {
      res.status(204).json({status: 'Materia Deleted'});
    } else {
      res.json({error: err});
    }
  });
});

// INSERT An Materia
/**
* @swagger
*  /materias/{materia}:
*   post:
*      tags:
*      - materia
*      summary: Updates a materia in the store with form data
*      operationId: updateMateriaWithForm
*      consumes:
*      - application/x-www-form-urlencoded
*      produces:
*      - application/json
*      parameters:
*      - name: materia
*        in: path
*        description: ID of materia that needs to be updated
*        required: true
*        type: integer
*        format: int64
*      - name: name
*        in: formData
*        description: Updated name of the materia
*        required: false
*        type: string
*      - name: status
*        in: formData
*        description: Updated status of the materia
*        required: false
*        type: string
*      responses:
*        405:
*          description: Invalid input
*      security:
*      - materiastore_auth:
*        - write:materias
*        - read:materias
*/
router.post('/', (req, res) => {
  const {materia} = req.body;
  //console.log(id_materia, materia);
  const query = `INSERT INTO materia (materia) VALUES (?);`;
  mysqlConnection.query(query, [materia], (err, rows, fields) => {
    if(!err) {
      res.status(201).json({status: 'Materia Saved'});
    } else {
      res.json({error: err});
    }
  });

});

// UPDATE An Materia
/**
 * @swagger
 * /materias:
 *    put:
 *      description: Use to update a materia
 *    parameters:
 *      - name: materias
 *        in: query
 *        description: materia of materia
 *        required: false
 *        schema:
 *          type: string
 *          format: string
 *    responses:
 *      '201':
 *        description: Successfully updated materia
 */
router.put('/:id', (req, res) => {
  const { materia } = req.body;
  const { id } = req.params;
  const query = `UPDATE materia SET materia = ? WHERE id_materia = ?;`;
  mysqlConnection.query(query, [materia,id], (err, rows, fields) => {
    if(!err) {
      res.status(204).json({status: 'Materia Updated'});
    } else {
      res.json({error: err});
    }
  });
});

module.exports = router;
