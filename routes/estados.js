const express = require('express');
const router = express.Router();

const mysqlConnection  = require('../database.js');

// GET all Estados
/**
 * @swagger
 * /estados:
 *  get:
 *    description: Use to request all estados
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/', (req, res) => {
  mysqlConnection.query('SELECT * FROM estado', (err, rows, fields) => {
    if(!err) {
      res.json(rows);
    } else {
      res.json({error: err});
    }
  });  
});

// GET An Estado
/**
 * @swagger
*  /estados/{id_estado}:
*    get:
*      tags:
*      - estado
*      summary: Find estado by ID
*      description: Returns a single estado
*      operationId: getEstados
*      produces:
*      - application/json
*      parameters:
*      - name: id_estado
*        in: path
*        description: ID of estado to return
*        required: true
*        type: integer
*        format: int64
*      responses:
*        200:
*          description: successful operation
*        400:
*          description: Invalid ID supplied
*        404:
*          description: estado not found
*      security:
*      - api_key: []
*/
router.get('/:id', (req, res) => {
  const { id } = req.params; 
  mysqlConnection.query('SELECT * FROM estado WHERE id_estado = ?', [id], (err, rows, fields) => {
    if (!err) {
      res.json({"data": [rows[0]]});
    } else {
      res.json({error: err});
    }
  });
});

// DELETE An Estado
/**
 * @swagger
*  /estados/{id_estado}:
*    delete:
*      tags:
*      - estado
*      summary: Deletes an estado
*      operationId: delEstado
*      produces:
*      - application/json
*      parameters:
*      - name: api_key
*        in: header
*        required: false
*        type: string
*      - name: estadoId
*        in: path
*        description: Estado id to delete
*        required: true
*        type: integer
*        format: int64
*      responses:
*        400:
*          description: Invalid ID supplied
*        404:
*          description: Estado not found
*      security:
*      - estadostore_auth:
*        - write:estados
*        - read:estados
*/
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  mysqlConnection.query('DELETE FROM estado WHERE id = ?', [id], (err, rows, fields) => {
    if(!err) {
      res.status(204).json({status: 'Estado Deleted'});
    } else {
      res.json({error: err});
    }
  });
});

// INSERT An Estado
/**
* @swagger
*  /estados/{estado}:
*   post:
*      tags:
*      - estado
*      summary: Updates a estado in the store with form data
*      operationId: updateEstadoWithForm
*      consumes:
*      - application/x-www-form-urlencoded
*      produces:
*      - application/json
*      parameters:
*      - name: estado
*        in: path
*        description: ID of estado that needs to be updated
*        required: true
*        type: integer
*        format: int64
*      - name: name
*        in: formData
*        description: Updated name of the estado
*        required: false
*        type: string
*      - name: status
*        in: formData
*        description: Updated status of the estado
*        required: false
*        type: string
*      responses:
*        405:
*          description: Invalid input
*      security:
*      - estadostore_auth:
*        - write:estados
*        - read:estados
*/
router.post('/', (req, res) => {
  const {estado} = req.body;
  //console.log(id_estado, estado);
  const query = `INSERT INTO estado (estado) VALUES (?);`;
  mysqlConnection.query(query, [estado], (err, rows, fields) => {
    if(!err) {
      res.status(201).json({status: 'Estado Saved'});
    } else {
      res.json({error: err});
    }
  });

});

// UPDATE An Estado
/**
 * @swagger
 * /estados:
 *    put:
 *      description: Use to update an estado
 *    parameters:
 *      - name: estados
 *        in: query
 *        description: estado of estado
 *        required: false
 *        schema:
 *          type: string
 *          format: string
 *    responses:
 *      '201':
 *        description: Successfully updated estado
 */
router.put('/:id', (req, res) => {
  const { estado } = req.body;
  const { id } = req.params;
  const query = `UPDATE estado SET estado = ? WHERE id_estado = ?;`;
  mysqlConnection.query(query, [estado,id], (err, rows, fields) => {
    if(!err) {
      res.status(204).json({status: 'Estado Updated'});
    } else {
      res.json({error: err});
    }
  });
});

module.exports = router;
