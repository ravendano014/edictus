const express = require('express');
const router = express.Router();

const mysqlConnection  = require('../database.js');

// GET all Metas
/**
 * @swagger
 * /metas:
 *  get:
 *    description: Use to request all metas
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/', (req, res) => {
  mysqlConnection.query('SELECT * FROM plan_anual', (err, rows, fields) => {
    if(!err) {
      res.json(rows);
    } else {
      res.json({error: err});
    }
  });  
});

// GET A Meta
/**
 * @swagger
*  /metas/{id_meta}:
*    get:
*      tags:
*      - meta
*      summary: Find meta by ID
*      description: Returns a single meta
*      operationId: getMetas
*      produces:
*      - application/json
*      parameters:
*      - name: id_meta
*        in: path
*        description: ID of meta to return
*        required: true
*        type: integer
*        format: int64
*      responses:
*        200:
*          description: successful operation
*        400:
*          description: Invalid ID supplied
*        404:
*          description: meta not found
*      security:
*      - api_key: []
*/
router.get('/:id', (req, res) => {
  const { id } = req.params; 
  mysqlConnection.query('SELECT * FROM plan_anual WHERE id_meta = ?', [id], (err, rows, fields) => {
    if (!err) {
      res.json(rows[0]);
    } else {
      res.json({error: err});
    }
  });
});

// DELETE A Meta
/**
 * @swagger
*  /metas/{id_meta}:
*    delete:
*      tags:
*      - meta
*      summary: Deletes a meta
*      operationId: delMeta
*      produces:
*      - application/json
*      parameters:
*      - name: api_key
*        in: header
*        required: false
*        type: string
*      - name: metaId
*        in: path
*        description: Meta id to delete
*        required: true
*        type: integer
*        format: int64
*      responses:
*        400:
*          description: Invalid ID supplied
*        404:
*          description: Meta not found
*      security:
*      - metastore_auth:
*        - write:metas
*        - read:metas
*/
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  mysqlConnection.query('DELETE FROM plan_anual WHERE id = ?', [id], (err, rows, fields) => {
    if(!err) {
      res.status(204).json({status: 'Meta Deleted'});
    } else {
      res.json({error: err});
    }
  });
});

// INSERT A Meta
/**
* @swagger
*  /metas/{meta}:
*   post:
*      tags:
*      - meta
*      summary: Updates a meta in the store with form data
*      operationId: updateMetaWithForm
*      consumes:
*      - application/x-www-form-urlencoded
*      produces:
*      - application/json
*      parameters:
*      - name: meta
*        in: path
*        description: ID of meta that needs to be updated
*        required: true
*        type: integer
*        format: int64
*      - name: name
*        in: formData
*        description: Updated name of the meta
*        required: false
*        type: string
*      - name: status
*        in: formData
*        description: Updated status of the meta
*        required: false
*        type: string
*      responses:
*        405:
*          description: Invalid input
*      security:
*      - metastore_auth:
*        - write:metas
*        - read:metas
*/
router.post('/', (req, res) => {
  const {meta} = req.body;
  //console.log(id_meta, meta);
  const query = `INSERT INTO plan_anual (meta) VALUES (?);`;
  mysqlConnection.query(query, [meta], (err, rows, fields) => {
    if(!err) {
      res.status(201).json({status: 'Meta Saved'});
    } else {
      res.json({error: err});
    }
  });

});

// UPDATE A Meta
/**
 * @swagger
 * /metas:
 *    put:
 *      description: Use to update a meta
 *    parameters:
 *      - name: metas
 *        in: query
 *        description: meta of meta
 *        required: false
 *        schema:
 *          type: string
 *          format: string
 *    responses:
 *      '201':
 *        description: Successfully updated meta
 */
router.put('/:id', (req, res) => {
  const { meta } = req.body;
  const { id } = req.params;
  const query = `UPDATE meta SET plan_anual = ? WHERE id_meta = ?;`;
  mysqlConnection.query(query, [meta,id], (err, rows, fields) => {
    if(!err) {
      res.status(204).json({status: 'Meta Updated'});
    } else {
      res.json({error: err});
    }
  });
});

module.exports = router;

