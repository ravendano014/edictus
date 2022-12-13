const express = require('express');
const router = express.Router();

const mysqlConnection  = require('../database.js');

// GET all Medios
/**
 * @swagger
 * /medios:
 *  get:
 *    description: Use to request all medios
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/', (req, res) => {
  mysqlConnection.query('SELECT * FROM medio', (err, rows, fields) => {
    if(!err) {
      res.json(rows);
    } else {
      res.json({error: err});
    }
  });  
});

// GET An Medio
/**
 * @swagger
*  /medios/{id_medio}:
*    get:
*      tags:
*      - medio
*      summary: Find medio by ID
*      description: Returns a single medio
*      operationId: getMedios
*      produces:
*      - application/json
*      parameters:
*      - name: id_medio
*        in: path
*        description: ID of medio to return
*        required: true
*        type: integer
*        format: int64
*      responses:
*        200:
*          description: successful operation
*        400:
*          description: Invalid ID supplied
*        404:
*          description: medio not found
*      security:
*      - api_key: []
*/
router.get('/:id', (req, res) => {
  const { id } = req.params; 
  mysqlConnection.query('SELECT * FROM medio WHERE id_medio = ?', [id], (err, rows, fields) => {
    if (!err) {
      res.json(rows[0]);
    } else {
      res.json({error: err});
    }
  });
});

// DELETE An Medio
/**
 * @swagger
*  /medios/{id_medio}:
*    delete:
*      tags:
*      - medio
*      summary: Deletes an medio
*      operationId: delMedio
*      produces:
*      - application/json
*      parameters:
*      - name: api_key
*        in: header
*        required: false
*        type: string
*      - name: medioId
*        in: path
*        description: Medio id to delete
*        required: true
*        type: integer
*        format: int64
*      responses:
*        400:
*          description: Invalid ID supplied
*        404:
*          description: Medio not found
*      security:
*      - mediostore_auth:
*        - write:medios
*        - read:medios
*/
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  mysqlConnection.query('DELETE FROM medio WHERE id = ?', [id], (err, rows, fields) => {
    if(!err) {
      res.status(204).json({status: 'Medio Deleted'});
    } else {
      res.json({error: err});
    }
  });
});

// INSERT A Medio
/**
* @swagger
*  /medios/{medio}:
*   post:
*      tags:
*      - medio
*      summary: Updates a medio in the store with form data
*      operationId: updateMedioWithForm
*      consumes:
*      - application/x-www-form-urlencoded
*      produces:
*      - application/json
*      parameters:
*      - name: medio
*        in: path
*        description: ID of medio that needs to be updated
*        required: true
*        type: integer
*        format: int64
*      - name: name
*        in: formData
*        description: Updated name of the medio
*        required: false
*        type: string
*      - name: status
*        in: formData
*        description: Updated status of the medio
*        required: false
*        type: string
*      responses:
*        405:
*          description: Invalid input
*      security:
*      - mediostore_auth:
*        - write:medios
*        - read:medios
*/
router.post('/', (req, res) => {
  const {medio} = req.body;
  //console.log(id_medio, medio);
  const query = `INSERT INTO medio (medio) VALUES (?);`;
  mysqlConnection.query(query, [medio], (err, rows, fields) => {
    if(!err) {
      res.status(201).json({status: 'Medio Saved'});
    } else {
      res.json({error: err});
    }
  });

});

// UPDATE A Medio
/**
 * @swagger
 * /medios:
 *    put:
 *      description: Use to update a medio
 *    parameters:
 *      - name: medios
 *        in: query
 *        description: medio of medio
 *        required: false
 *        schema:
 *          type: string
 *          format: string
 *    responses:
 *      '201':
 *        description: Successfully updated medio
 */
router.put('/:id', (req, res) => {
  const { medio } = req.body;
  const { id } = req.params;
  const query = `UPDATE medio SET medio = ? WHERE id_medio = ?;`;
  mysqlConnection.query(query, [medio,id], (err, rows, fields) => {
    if(!err) {
      res.status(204).json({status: 'Medio Updated'});
    } else {
      res.json({error: err});
    }
  });
});

module.exports = router;
