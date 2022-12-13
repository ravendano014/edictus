const express = require('express');
const router = express.Router();

const mysqlConnection  = require('../database.js');

// GET all Solicitudes
/**
 * @swagger
 * /solicitudes:
 *  get:
 *    description: Use to request all solicitudes
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/', (req, res) => {
  mysqlConnection.query('SELECT * FROM solicitudes', (err, rows, fields) => {
    if(!err) {
      res.json(rows);
    } else {
      res.json({error: err});
    }
  });  
});

// GET A Solicitud
/**
 * @swagger
*  /solicitudes/{id_solicitud}:
*    get:
*      tags:
*      - solicitud
*      summary: Find solicitud by ID
*      description: Returns a single solicitud
*      operationId: getSolicitudes
*      produces:
*      - application/json
*      parameters:
*      - name: id_solicitud
*        in: path
*        description: ID of solicitud to return
*        required: true
*        type: integer
*        format: int64
*      responses:
*        200:
*          description: successful operation
*        400:
*          description: Invalid ID supplied
*        404:
*          description: solicitud not found
*      security:
*      - api_key: []
*/
router.get('/:id', (req, res) => {
  const { id } = req.params; 
  mysqlConnection.query('SELECT * FROM solicitudes WHERE id_solicitud = ?', [id], (err, rows, fields) => {
    if (!err) {
      res.json(rows[0]);
    } else {
      res.json({error: err});
    }
  });
});

// DELETE A Solicitud
/**
 * @swagger
*  /solicitudes/{id_solicitud}:
*    delete:
*      tags:
*      - solicitud
*      summary: Deletes a solicitud
*      operationId: delSolicitud
*      produces:
*      - application/json
*      parameters:
*      - name: api_key
*        in: header
*        required: false
*        type: string
*      - name: solicitudId
*        in: path
*        description: Solicitud id to delete
*        required: true
*        type: integer
*        format: int64
*      responses:
*        400:
*          description: Invalid ID supplied
*        404:
*          description: Solicitud not found
*      security:
*      - solicitudstore_auth:
*        - write:solicituds
*        - read:solicituds
*/
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  mysqlConnection.query('DELETE FROM solicitudes WHERE id = ?', [id], (err, rows, fields) => {
    if(!err) {
      res.status(204).json({status: 'Solicitud Deleted'});
    } else {
      res.json({error: err});
    }
  });
});

// INSERT A Solicitud
/**
* @swagger
*  /solicitudes/{solicitud}:
*   post:
*      tags:
*      - solicitud
*      summary: Updates a solicitud in the store with form data
*      operationId: updateSolicitudWithForm
*      consumes:
*      - application/x-www-form-urlencoded
*      produces:
*      - application/json
*      parameters:
*      - name: solicitud
*        in: path
*        description: ID of solicitud that needs to be updated
*        required: true
*        type: integer
*        format: int64
*      - name: name
*        in: formData
*        description: Updated name of the solicitud
*        required: false
*        type: string
*      - name: status
*        in: formData
*        description: Updated status of the solicitud
*        required: false
*        type: string
*      responses:
*        405:
*          description: Invalid input
*      security:
*      - solicitudstore_auth:
*        - write:solicitudes
*        - read:solicitudes
*/
router.post('/', (req, res) => {
  const {solicitud} = req.body;
  //console.log(id_solicitud, solicitud);
  const query = `INSERT INTO solicitudes (solicitud) VALUES (?);`;
  mysqlConnection.query(query, [solicitud], (err, rows, fields) => {
    if(!err) {
      res.status(201).json({status: 'Solicitud Saved'});
    } else {
      res.json({error: err});
    }
  });

});

// UPDATE A Solicitud
/**
 * @swagger
 * /solicitudes:
 *    put:
 *      description: Use to update a solicitud
 *    parameters:
 *      - name: solicitudes
 *        in: query
 *        description: solicitud of solicitud
 *        required: false
 *        schema:
 *          type: string
 *          format: string
 *    responses:
 *      '201':
 *        description: Successfully updated solicitud
 */
router.put('/:id', (req, res) => {
  const { solicitud } = req.body;
  const { id } = req.params;
  const query = `UPDATE solicitudes SET solicitud = ? WHERE id_solicitud = ?;`;
  mysqlConnection.query(query, [solicitud,id], (err, rows, fields) => {
    if(!err) {
      res.status(204).json({status: 'Solicitud Updated'});
    } else {
      res.json({error: err});
    }
  });
});

module.exports = router;
