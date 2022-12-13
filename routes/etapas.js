const express = require('express');
const router = express.Router();

const mysqlConnection  = require('../database.js');

// GET all Etapas
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
  mysqlConnection.query('SELECT * FROM etapa', (err, rows, fields) => {
    if(!err) {
      res.json(rows);
    } else {
      res.json({error: err});
    }
  });  
});

// GET An Etapa
/**
 * @swagger
*  /etapas/{id_etapa}:
*    get:
*      tags:
*      - etapa
*      summary: Find etapa by ID
*      description: Returns a single etapa
*      operationId: getEtapas
*      produces:
*      - application/json
*      parameters:
*      - name: id_etapa
*        in: path
*        description: ID of etapa to return
*        required: true
*        type: integer
*        format: int64
*      responses:
*        200:
*          description: successful operation
*        400:
*          description: Invalid ID supplied
*        404:
*          description: etapa not found
*      security:
*      - api_key: []
*/
router.get('/:id', (req, res) => {
  const { id } = req.params; 
  mysqlConnection.query('SELECT * FROM etapa WHERE id_etapa = ?', [id], (err, rows, fields) => {
    if (!err) {
      res.json(rows[0]);
    } else {
      res.json({error: err});
    }
  });
});

// DELETE An Etapa
/**
 * @swagger
*  /etapas/{id_etapa}:
*    delete:
*      tags:
*      - etapa
*      summary: Deletes an etapa
*      operationId: delEtapa
*      produces:
*      - application/json
*      parameters:
*      - name: api_key
*        in: header
*        required: false
*        type: string
*      - name: etapaId
*        in: path
*        description: Etapa id to delete
*        required: true
*        type: integer
*        format: int64
*      responses:
*        400:
*          description: Invalid ID supplied
*        404:
*          description: Etapa not found
*      security:
*      - etapastore_auth:
*        - write:etapas
*        - read:etapas
*/
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  mysqlConnection.query('DELETE FROM etapa WHERE id = ?', [id], (err, rows, fields) => {
    if(!err) {
      res.status(204).json({status: 'Etapa Deleted'});
    } else {
      res.json({error: err});
    }
  });
});

// INSERT An Etapa
/**
* @swagger
*  /etapas/{etapa}:
*   post:
*      tags:
*      - etapa
*      summary: Updates a etapa in the store with form data
*      operationId: updateEtapaWithForm
*      consumes:
*      - application/x-www-form-urlencoded
*      produces:
*      - application/json
*      parameters:
*      - name: etapa
*        in: path
*        description: ID of etapa that needs to be updated
*        required: true
*        type: integer
*        format: int64
*      - name: name
*        in: formData
*        description: Updated name of the etapa
*        required: false
*        type: string
*      - name: status
*        in: formData
*        description: Updated status of the etapa
*        required: false
*        type: string
*      responses:
*        405:
*          description: Invalid input
*      security:
*      - etapastore_auth:
*        - write:etapas
*        - read:etapas
*/
router.post('/', (req, res) => {
  const {etapa} = req.body;
  //console.log(id_etapa, etapa);
  const query = `INSERT INTO etapa (etapa) VALUES (?);`;
  mysqlConnection.query(query, [etapa], (err, rows, fields) => {
    if(!err) {
      res.status(201).json({status: 'Etapa Saved'});
    } else {
      res.json({error: err});
    }
  });

});

// UPDATE An Etapa
/**
 * @swagger
 * /etapas:
 *    put:
 *      description: Use to update an etapa
 *    parameters:
 *      - name: etapas
 *        in: query
 *        description: etapa of etapa
 *        required: false
 *        schema:
 *          type: string
 *          format: string
 *    responses:
 *      '201':
 *        description: Successfully updated etapa
 */
router.put('/:id', (req, res) => {
  const { etapa } = req.body;
  const { id } = req.params;
  const query = `UPDATE etapa SET etapa = ? WHERE id_etapa = ?;`;
  mysqlConnection.query(query, [etapa,id], (err, rows, fields) => {
    if(!err) {
      res.status(204).json({status: 'Etapa Updated'});
    } else {
      res.json({error: err});
    }
  });
});

module.exports = router;
