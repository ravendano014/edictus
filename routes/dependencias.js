const express = require('express');
const router = express.Router();

const mysqlConnection  = require('../database.js');

// GET all Dependencias
/**
 * @swagger
 * /dependencias:
 *  get:
 *    description: Use to request all dependencias
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/', (req, res) => {
  mysqlConnection.query('SELECT * FROM dependencia', (err, rows, fields) => {
    if(!err) {
      res.json(rows);
    } else {
      res.json({error: err});
    }
  });  
});

// GET A Dependencia
/**
 * @swagger
*  /dependencias/{id_dependencia}:
*    get:
*      tags:
*      - dependencia
*      summary: Find dependencia by ID
*      description: Returns a single dependencia
*      operationId: getDependencias
*      produces:
*      - application/json
*      parameters:
*      - name: id_dependencia
*        in: path
*        description: ID of dependencia to return
*        required: true
*        type: integer
*        format: int64
*      responses:
*        200:
*          description: successful operation
*        400:
*          description: Invalid ID supplied
*        404:
*          description: dependencia not found
*      security:
*      - api_key: []
*/
router.get('/:id', (req, res) => {
  const { id } = req.params; 
  mysqlConnection.query('SELECT * FROM dependencia WHERE id_dependencia = ?', [id], (err, rows, fields) => {
    if (!err) {
      res.json(rows[0]);
    } else {
      res.json({error: err});
    }
  });
});

// DELETE A Dependencia
/**
 * @swagger
*  /dependencias/{id_dependencia}:
*    delete:
*      tags:
*      - dependencia
*      summary: Deletes an dependencia
*      operationId: delDependencia
*      produces:
*      - application/json
*      parameters:
*      - name: api_key
*        in: header
*        required: false
*        type: string
*      - name: dependenciaId
*        in: path
*        description: Dependencia id to delete
*        required: true
*        type: integer
*        format: int64
*      responses:
*        400:
*          description: Invalid ID supplied
*        404:
*          description: Dependencia not found
*      security:
*      - dependenciastore_auth:
*        - write:dependencias
*        - read:dependencias
*/
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  mysqlConnection.query('DELETE FROM dependencia WHERE id = ?', [id], (err, rows, fields) => {
    if(!err) {
      res.status(204).json({status: 'Dependencia Deleted'});
    } else {
      res.json({error: err});
    }
  });
});

// INSERT An Dependencia
/**
* @swagger
*  /dependencias/{dependencia}:
*   post:
*      tags:
*      - dependencia
*      summary: Updates a dependencia in the store with form data
*      operationId: updateDependenciaWithForm
*      consumes:
*      - application/x-www-form-urlencoded
*      produces:
*      - application/json
*      parameters:
*      - name: dependencia
*        in: path
*        description: ID of dependencia that needs to be updated
*        required: true
*        type: integer
*        format: int64
*      - name: name
*        in: formData
*        description: Updated name of the dependencia
*        required: false
*        type: string
*      - name: status
*        in: formData
*        description: Updated status of the dependencia
*        required: false
*        type: string
*      responses:
*        405:
*          description: Invalid input
*      security:
*      - dependenciastore_auth:
*        - write:dependencias
*        - read:dependencias
*/
router.post('/', (req, res) => {
  const {dependencia} = req.body;
  //console.log(id_dependencia, dependencia);
  const query = `INSERT INTO dependencia (dependencia) VALUES (?);`;
  mysqlConnection.query(query, [dependencia], (err, rows, fields) => {
    if(!err) {
      res.status(201).json({status: 'Dependencia Saved'});
    } else {
      res.json({error: err});
    }
  });

});

// UPDATE A Dependencia
/**
 * @swagger
 * /dependencias:
 *    put:
 *      description: Use to update a dependencia
 *    parameters:
 *      - name: dependencias
 *        in: query
 *        description: dependencia of dependencia
 *        required: false
 *        schema:
 *          type: string
 *          format: string
 *    responses:
 *      '201':
 *        description: Successfully updated dependencia
 */
router.put('/:id', (req, res) => {
  const { dependencia } = req.body;
  const { id } = req.params;
  const query = `UPDATE dependencia SET dependencia = ? WHERE id_dependencia = ?;`;
  mysqlConnection.query(query, [dependencia,id], (err, rows, fields) => {
    if(!err) {
      res.status(204).json({status: 'Dependencia Updated'});
    } else {
      res.json({error: err});
    }
  });
});

module.exports = router;
