const express = require('express');
const router = express.Router();

const mysqlConnection  = require('../database.js');

// GET all Requerimientos
/**
 * @swagger
 * /requerimientos:
 *  get:
 *    description: Use to request all requerimientos
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/', (req, res) => {
  mysqlConnection.query('SELECT * FROM requerimiento', (err, rows, fields) => {
    if(!err) {
      res.json(rows);
    } else {
      res.json({error: err});
    }
  });  
});

// GET A Requerimiento
/**
 * @swagger
*  /requerimientos/{id_requerimiento}:
*    get:
*      tags:
*      - requerimiento
*      summary: Find requerimiento by ID
*      description: Returns a single requerimiento
*      operationId: getRequerimientos
*      produces:
*      - application/json
*      parameters:
*      - name: id_requerimiento
*        in: path
*        description: ID of requerimiento to return
*        required: true
*        type: integer
*        format: int64
*      responses:
*        200:
*          description: successful operation
*        400:
*          description: Invalid ID supplied
*        404:
*          description: requerimiento not found
*      security:
*      - api_key: []
*/
router.get('/:id', (req, res) => {
  const { id } = req.params; 
  mysqlConnection.query('SELECT * FROM requerimiento WHERE id_requerimiento = ?', [id], (err, rows, fields) => {
    if (!err) {
      res.json(rows[0]);
    } else {
      res.json({error: err});
    }
  });
});

// DELETE A Requerimiento
/**
 * @swagger
*  /requerimientos/{id_requerimiento}:
*    delete:
*      tags:
*      - requerimiento
*      summary: Deletes a requerimiento
*      operationId: delRequerimiento
*      produces:
*      - application/json
*      parameters:
*      - name: api_key
*        in: header
*        required: false
*        type: string
*      - name: requerimientoId
*        in: path
*        description: Requerimiento id to delete
*        required: true
*        type: integer
*        format: int64
*      responses:
*        400:
*          description: Invalid ID supplied
*        404:
*          description: Requerimiento not found
*      security:
*      - requerimientostore_auth:
*        - write:requerimientos
*        - read:requerimientos
*/
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  mysqlConnection.query('DELETE FROM requerimiento WHERE id = ?', [id], (err, rows, fields) => {
    if(!err) {
      res.status(204).json({status: 'Requerimiento Deleted'});
    } else {
      res.json({error: err});
    }
  });
});

// INSERT A Requerimiento
/**
* @swagger
*  /requerimientos/{requerimiento}:
*   post:
*      tags:
*      - requerimiento
*      summary: Updates a requerimiento in the store with form data
*      operationId: updateRequerimientoWithForm
*      consumes:
*      - application/x-www-form-urlencoded
*      produces:
*      - application/json
*      parameters:
*      - name: requerimiento
*        in: path
*        description: ID of requerimiento that needs to be updated
*        required: true
*        type: integer
*        format: int64
*      - name: name
*        in: formData
*        description: Updated name of the requerimiento
*        required: false
*        type: string
*      - name: status
*        in: formData
*        description: Updated status of the requerimiento
*        required: false
*        type: string
*      responses:
*        405:
*          description: Invalid input
*      security:
*      - requerimientostore_auth:
*        - write:requerimientos
*        - read:requerimientos
*/
router.post('/', (req, res) => {
  const {requerimiento} = req.body;
  //console.log(id_requerimiento, requerimiento);
  const query = `INSERT INTO requerimiento (requerimiento) VALUES (?);`;
  mysqlConnection.query(query, [requerimiento], (err, rows, fields) => {
    if(!err) {
      res.status(201).json({status: 'Requerimiento Saved'});
    } else {
      res.json({error: err});
    }
  });

});

// UPDATE An Requerimiento
/**
 * @swagger
 * /requerimientos:
 *    put:
 *      description: Use to update an requerimiento
 *    parameters:
 *      - name: requerimientos
 *        in: query
 *        description: requerimiento of requerimiento
 *        required: false
 *        schema:
 *          type: string
 *          format: string
 *    responses:
 *      '201':
 *        description: Successfully updated requerimiento
 */
router.put('/:id', (req, res) => {
  const { requerimiento } = req.body;
  const { id } = req.params;
  const query = `UPDATE requerimiento SET requerimiento = ? WHERE id_requerimiento = ?;`;
  mysqlConnection.query(query, [requerimiento,id], (err, rows, fields) => {
    if(!err) {
      res.status(204).json({status: 'Requerimiento Updated'});
    } else {
      res.json({error: err});
    }
  });
});

module.exports = router;
