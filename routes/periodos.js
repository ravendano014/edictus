const express = require('express');
const router = express.Router();

const mysqlConnection  = require('../database.js');

// GET all Periodos
/**
 * @swagger
 * /periodos:
 *  get:
 *    description: Use to request all periodos
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/', (req, res) => {
  mysqlConnection.query('SELECT * FROM periodo', (err, rows, fields) => {
    if(!err) {
      res.json(rows);
    } else {
      res.json({error: err});
    }
  });  
});

// GET A Periodo
/**
 * @swagger
*  /periodos/{id_periodo}:
*    get:
*      tags:
*      - periodo
*      summary: Find periodo by ID
*      description: Returns a single periodo
*      operationId: getPeriodos
*      produces:
*      - application/json
*      parameters:
*      - name: id_periodo
*        in: path
*        description: ID of periodo to return
*        required: true
*        type: integer
*        format: int64
*      responses:
*        200:
*          description: successful operation
*        400:
*          description: Invalid ID supplied
*        404:
*          description: periodo not found
*      security:
*      - api_key: []
*/
router.get('/:id', (req, res) => {
  const { id } = req.params; 
  mysqlConnection.query('SELECT * FROM periodo WHERE id_periodo = ?', [id], (err, rows, fields) => {
    if (!err) {
      res.json(rows[0]);
    } else {
      res.json({error: err});
    }
  });
});

// DELETE An Periodo
/**
 * @swagger
*  /periodos/{id_periodo}:
*    delete:
*      tags:
*      - periodo
*      summary: Deletes an periodo
*      operationId: delPeriodo
*      produces:
*      - application/json
*      parameters:
*      - name: api_key
*        in: header
*        required: false
*        type: string
*      - name: periodoId
*        in: path
*        description: Periodo id to delete
*        required: true
*        type: integer
*        format: int64
*      responses:
*        400:
*          description: Invalid ID supplied
*        404:
*          description: Periodo not found
*      security:
*      - periodostore_auth:
*        - write:periodos
*        - read:periodos
*/
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  mysqlConnection.query('DELETE FROM periodo WHERE id = ?', [id], (err, rows, fields) => {
    if(!err) {
      res.status(204).json({status: 'Periodo Deleted'});
    } else {
      res.json({error: err});
    }
  });
});

// INSERT A Periodo
/**
* @swagger
*  /periodos/{periodo}:
*   post:
*      tags:
*      - periodo
*      summary: Updates a periodo in the store with form data
*      operationId: updatePeriodoWithForm
*      consumes:
*      - application/x-www-form-urlencoded
*      produces:
*      - application/json
*      parameters:
*      - name: periodo
*        in: path
*        description: ID of periodo that needs to be updated
*        required: true
*        type: integer
*        format: int64
*      - name: name
*        in: formData
*        description: Updated name of the periodo
*        required: false
*        type: string
*      - name: status
*        in: formData
*        description: Updated status of the periodo
*        required: false
*        type: string
*      responses:
*        405:
*          description: Invalid input
*      security:
*      - periodostore_auth:
*        - write:periodos
*        - read:periodos
*/
router.post('/', (req, res) => {
  const {periodo} = req.body;
  //console.log(id_periodo, periodo);
  const query = `INSERT INTO periodo (periodo) VALUES (?);`;
  mysqlConnection.query(query, [periodo], (err, rows, fields) => {
    if(!err) {
      res.status(201).json({status: 'Periodo Saved'});
    } else {
      res.json({error: err});
    }
  });

});

// UPDATE A Periodo
/**
 * @swagger
 * /periodos:
 *    put:
 *      description: Use to update a periodo
 *    parameters:
 *      - name: periodos
 *        in: query
 *        description: periodo of periodo
 *        required: false
 *        schema:
 *          type: string
 *          format: string
 *    responses:
 *      '201':
 *        description: Successfully updated periodo
 */
router.put('/:id', (req, res) => {
  const { periodo } = req.body;
  const { id } = req.params;
  const query = `UPDATE periodo SET periodo = ? WHERE id_periodo = ?;`;
  mysqlConnection.query(query, [periodo,id], (err, rows, fields) => {
    if(!err) {
      res.status(204).json({status: 'Periodo Updated'});
    } else {
      res.json({error: err});
    }
  });
});

module.exports = router;
