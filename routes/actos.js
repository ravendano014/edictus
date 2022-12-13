const express = require('express');
const router = express.Router();

const mysqlConnection  = require('../database.js');

// GET all Actos
/**
 * @swagger
 * /actos:
 *  get:
 *    description: Use to request all actos
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/', (req, res) => {
  const page = parseInt(req.query.page,10) || 1;
  const limit = parseInt(req.query.limit,10) || 10;

  const offset = (page -1) * limit;
  const sql = `SELECT * FROM acto LIMIT ${offset} , ${limit}`;

  const results = {}

  mysqlConnection.query(sql, (err, rows, fields) => {
    results.next = { page: page + 1, limit: limit};
    results.previous = { page: page - 1, limit: limit};
    results.items = rows;
    results.totalrows = rows.length; // execute query 2 times to get total rows or slice the rows with js?

    //console.log(fields);

    if(!err) {
      res.json(results);
    } else {
      res.json({error: err});
    }
  });  
});

// GET An Acto
/**
 * @swagger
*  /actos/{id_acto}:
*    get:
*      tags:
*      - acto
*      summary: Find acto by ID
*      description: Returns a single acto
*      operationId: getActos
*      produces:
*      - application/json
*      parameters:
*      - name: id_acto
*        in: path
*        description: ID of acto to return
*        required: true
*        type: integer
*        format: int64
*      responses:
*        200:
*          description: successful operation
*        400:
*          description: Invalid ID supplied
*        404:
*          description: acto not found
*      security:
*      - api_key: []
*/
router.get('/:id', (req, res) => {
  const { id } = req.params; 
  mysqlConnection.query('SELECT * FROM acto WHERE id_acto = ?', [id], (err, rows, fields) => {
    if (!err) {
      res.json(rows[0]);
    } else {
      res.json({error: err});
    }
  });
});

// DELETE An Acto
/**
 * @swagger
*  /actos/{id_acto}:
*    delete:
*      tags:
*      - acto
*      summary: Deletes an acto
*      operationId: delActo
*      produces:
*      - application/json
*      parameters:
*      - name: api_key
*        in: header
*        required: false
*        type: string
*      - name: actoId
*        in: path
*        description: Acto id to delete
*        required: true
*        type: integer
*        format: int64
*      responses:
*        400:
*          description: Invalid ID supplied
*        404:
*          description: Acto not found
*      security:
*      - actostore_auth:
*        - write:actos
*        - read:actos
*/
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  mysqlConnection.query('DELETE FROM acto WHERE id = ?', [id], (err, rows, fields) => {
    if(!err) {
      res.status(204).json({affectedRows:rows.affectedRows}).end();
    } else {
      res.json({error: err});
    }
  });
});

// INSERT An Acto
/**
* @swagger
*  /actos/{acto}:
*   post:
*      tags:
*      - acto
*      summary: Updates a acto in the store with form data
*      operationId: updateActoWithForm
*      consumes:
*      - application/x-www-form-urlencoded
*      produces:
*      - application/json
*      parameters:
*      - name: acto
*        in: path
*        description: ID of acto that needs to be updated
*        required: true
*        type: integer
*        format: int64
*      - name: name
*        in: formData
*        description: Updated name of the acto
*        required: false
*        type: string
*      - name: status
*        in: formData
*        description: Updated status of the acto
*        required: false
*        type: string
*      responses:
*        405:
*          description: Invalid input
*      security:
*      - actostore_auth:
*        - write:actos
*        - read:actos
*/
router.post('/', (req, res) => {
  const {acto} = req.body;
  //console.log(id_acto, acto);
  const query = `INSERT INTO acto (acto) VALUES (?);`;
  mysqlConnection.query(query, [acto], (err, rows, fields) => {
    if(!err) {
      res.status(201).json({insertId: rows.insertId}).end();
    } else {
      res.json({error: err});
    }
  });

});

// UPDATE An Acto
/**
 * @swagger
 * /actos:
 *    put:
 *      description: Use to update an acto
 *    parameters:
 *      - name: actos
 *        in: query
 *        description: acto of acto
 *        required: false
 *        schema:
 *          type: string
 *          format: string
 *    responses:
 *      '201':
 *        description: Successfully updated acto
 */

router.put('/:id',(req, res) => {
  const data = req.body;
  const query = mysqlConnection.query('UPDATE acto SET ? WHERE id_acto = ?', [data, req.params.id], (err, rows) => {
      if(err){
        res.status(404).json({error: err});
      } else {
        res.status(200).json({changedRows:rows.changedRows, affectedRows:rows.affectedRows}).end();
      }
  })
  //console.log(query.sql)
});

/*
router.put('/:id', (req, res) => {
  const { acto } = req.body;
  const { id } = req.params;
  const query = `UPDATE acto SET acto = ? WHERE id_acto = ?;`;
  mysqlConnection.query(query, [acto,id], (err, rows, fields) => {
    if(!err) {
      res.status(204).json({status: 'Acto Updated'});
    } else {
      res.json({error: err});
    }
  });
});
*/

router.patch('/:id',(req, res) => {
  const data = req.body;
  const query = mysqlConnection.query('UPDATE acto SET ? WHERE id_acto = ?', [data, req.params.id], (err, rows) => {
      if(err){
        res.status(404).json({error: err});
      } else {
        res.status(200).json({changedRows:rows.changedRows, affectedRows:rows.affectedRows}).end();
      }
  })
  
});

module.exports = router;
