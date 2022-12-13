const express = require('express');
const router = express.Router();

const mysqlConnection  = require('../database.js');

// GET all Procesos
/**
 * @swagger
 * /procesos:
 *  get:
 *    description: Use to request all procesos
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/', (req, res) => {
  const page = parseInt(req.query.page,10) || 1;
  const limit = parseInt(req.query.limit,10) || 10;

  const offset = (page -1) * limit;
  const sql = `SELECT * FROM proceso LIMIT ${offset} , ${limit}`;

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

// GET A Proceso
/**
 * @swagger
*  /procesos/{id_proceso}:
*    get:
*      tags:
*      - proceso
*      summary: Find proceso by ID
*      description: Returns a single proceso
*      operationId: getProcesos
*      produces:
*      - application/json
*      parameters:
*      - name: id_proceso
*        in: path
*        description: ID of proceso to return
*        required: true
*        type: integer
*        format: int64
*      responses:
*        200:
*          description: successful operation
*        400:
*          description: Invalid ID supplied
*        404:
*          description: proceso not found
*      security:
*      - api_key: []
*/
router.get('/:id', (req, res) => {
  const { id } = req.params; 
  mysqlConnection.query('SELECT * FROM proceso WHERE id_proceso = ?', [id], (err, rows, fields) => {
    if (!err) {
      res.json(rows[0]);
    } else {
      res.json({error: err});
    }
  });
});

// DELETE A Proceso
/**
 * @swagger
*  /procesos/{id_proceso}:
*    delete:
*      tags:
*      - proceso
*      summary: Deletes an proceso
*      operationId: delProceso
*      produces:
*      - application/json
*      parameters:
*      - name: api_key
*        in: header
*        required: false
*        type: string
*      - name: procesoId
*        in: path
*        description: Proceso id to delete
*        required: true
*        type: integer
*        format: int64
*      responses:
*        400:
*          description: Invalid ID supplied
*        404:
*          description: Proceso not found
*      security:
*      - procesostore_auth:
*        - write:procesos
*        - read:procesos
*/
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  mysqlConnection.query('DELETE FROM proceso WHERE id = ?', [id], (err, rows, fields) => {
    if(!err) {
      res.status(204).json({affectedRows:rows.affectedRows}).end();
    } else {
      res.json({error: err});
    }
  });
});

// INSERT A Proceso
/**
* @swagger
*  /procesos/{proceso}:
*   post:
*      tags:
*      - proceso
*      summary: Updates a proceso in the store with form data
*      operationId: updateProcesoWithForm
*      consumes:
*      - application/x-www-form-urlencoded
*      produces:
*      - application/json
*      parameters:
*      - name: proceso
*        in: path
*        description: ID of proceso that needs to be updated
*        required: true
*        type: integer
*        format: int64
*      - name: name
*        in: formData
*        description: Updated name of the proceso
*        required: false
*        type: string
*      - name: status
*        in: formData
*        description: Updated status of the proceso
*        required: false
*        type: string
*      responses:
*        405:
*          description: Invalid input
*      security:
*      - procesostore_auth:
*        - write:procesos
*        - read:procesos
*/
router.post('/', (req, res) => {
  const {proceso} = req.body;
  //console.log(id_proceso, proceso);
  const query = `INSERT INTO proceso (proceso) VALUES (?);`;
  mysqlConnection.query(query, [proceso], (err, rows, fields) => {
    if(!err) {
      res.status(201).json({insertId: rows.insertId}).end();
    } else {
      res.json({error: err});
    }
  });

});

// UPDATE A Proceso
/**
 * @swagger
 * /procesos:
 *    put:
 *      description: Use to update an proceso
 *    parameters:
 *      - name: procesos
 *        in: query
 *        description: proceso of proceso
 *        required: false
 *        schema:
 *          type: string
 *          format: string
 *    responses:
 *      '201':
 *        description: Successfully updated proceso
 */

router.put('/:id',(req, res) => {
  const data = req.body;
  const query = mysqlConnection.query('UPDATE proceso SET ? WHERE id_proceso = ?', [data, req.params.id], (err, rows) => {
      if(err){
        res.status(404).json({error: err});
      } else {
        res.status(200).json({changedRows:rows.changedRows, affectedRows:rows.affectedRows}).end();
      }
  })
  //console.log(query.sql)
});


router.patch('/:id',(req, res) => {
  const data = req.body;
  const query = mysqlConnection.query('UPDATE proceso SET ? WHERE id_proceso = ?', [data, req.params.id], (err, rows) => {
      if(err){
        res.status(404).json({error: err});
      } else {
        res.status(200).json({changedRows:rows.changedRows, affectedRows:rows.affectedRows}).end();
      }
  })
  
});

module.exports = router;
