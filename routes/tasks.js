const express = require('express');
const router = express.Router();

const mysqlConnection  = require('../database.js');

// GET all Tasks
/**
 * @swagger
 * /tasks:
 *  get:
 *    description: Use to request all tasks
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/', (req, res) => {
  mysqlConnection.query('SELECT * FROM tasks', (err, rows, fields) => {
    if(!err) {
      res.json(rows);
    } else {
      res.json({error: err});
    }
  });  
});

router.get('/p', function(req, res) {
  //res.send("q is set to " + req.query.q);
  ref = req.query.q;
  const results = {}

  mysqlConnection.query("SELECT title FROM tasks WHERE title like '%"+ref+"%'", [ref], (err, rows, fields) => {
    
    results.items = rows;
    results.totalrows = rows.length; 
    let mapped = results.items.map(el => el.title);

    if (!err) {
      res.json(mapped);
    } else {
      res.json({error: err});
    }
  });
});

// GET all Tasks
/**
 * @swagger
 * /tasks/task:
 *  get:
 *    description: Use to request all tasks
 *    responses:
 *      '200':
 *        description: A successful response
 */
 router.get('/q/:ref', (req, res) => {
  const { ref } = req.params; 
  const results = {}

  mysqlConnection.query("SELECT title FROM tasks WHERE title like '%"+ref+"%'", [ref], (err, rows, fields) => {
    
    results.items = rows;
    results.totalrows = rows.length; 
    let mapped = results.items.map(el => el.title);

    if (!err) {
      res.json(mapped);
    } else {
      res.json({error: err});
    }
  });
});

// GET all Tasks for specified code
/**
 * @swagger
*  /tasks/code/{id}:
*    get:
*      tags:
*      - task
*      summary: Find task by code
*      description: Returns a single task
*      operationId: getTasks
*      produces:
*      - application/json
*      parameters:
*      - name: code
*        in: path
*        description: code of task to return
*        required: true
*        type: String
*        format: int64
*      responses:
*        200:
*          description: successful operation
*        400:
*          description: Invalid ID supplied
*        404:
*          description: task not found
*      security:
*      - api_key: []
 */
 router.get('/code/:id', (req, res) => {
  const { id } = req.params; 
  mysqlConnection.query('SELECT * FROM tasks where code = ?', [id], (err, rows, fields) => {
    if(!err) {
      res.json(rows);
    } else {
      res.json({error: err});
    }
  });  
});

// GET An Task
/**
 * @swagger
*  /tasks/{id}:
*    get:
*      tags:
*      - task
*      summary: Find task by ID
*      description: Returns a single task
*      operationId: getTasks
*      produces:
*      - application/json
*      parameters:
*      - name: id
*        in: path
*        description: ID of task to return
*        required: true
*        type: integer
*        format: int64
*      responses:
*        200:
*          description: successful operation
*        400:
*          description: Invalid ID supplied
*        404:
*          description: task not found
*      security:
*      - api_key: []
*/
router.get('/:id', (req, res) => {
  const { id } = req.params; 
  mysqlConnection.query('SELECT * FROM tasks WHERE id = ?', [id], (err, rows, fields) => {
    if (!err) {
      res.json(rows[0]);
    } else {
      res.json({error: err});
    }
  });
});

// DELETE An Task
/**
 * @swagger
*  /tasks/{id}:
*    delete:
*      tags:
*      - task
*      summary: Deletes an task
*      operationId: delTask
*      produces:
*      - application/json
*      parameters:
*      - name: api_key
*        in: header
*        required: false
*        type: string
*      - name: taskId
*        in: path
*        description: Task id to delete
*        required: true
*        type: integer
*        format: int64
*      responses:
*        400:
*          description: Invalid ID supplied
*        404:
*          description: Task not found
*      security:
*      - taskstore_auth:
*        - write:tasks
*        - read:tasks
*/
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  mysqlConnection.query('INSERT INTO taskshist SELECT * FROM tasks WHERE id = ?', [id], (err, rows, fields) => {});
  mysqlConnection.query('UPDATE taskshist SET enddate = NOW() WHERE id = ?', [id], (err, rows, fields) => {});
  mysqlConnection.query('DELETE FROM tasks WHERE id = ?', [id], (err, rows, fields) => {
    if(!err) {
      res.status(204).json({status: 'Task Deleted'});
    } else {
      res.json({error: err});
    }
  });
});

// INSERT An Task
/**
* @swagger
*  /tasks/{task}:
*   post:
*      tags:
*      - task
*      summary: Updates a task in the store with form data
*      operationId: updateTaskWithForm
*      consumes:
*      - application/x-www-form-urlencoded
*      produces:
*      - application/json
*      parameters:
*      - name: task
*        in: path
*        description: ID of task that needs to be updated
*        required: true
*        type: integer
*        format: int64
*      - name: name
*        in: formData
*        description: Updated name of the task
*        required: false
*        type: string
*      - name: status
*        in: formData
*        description: Updated status of the task
*        required: false
*        type: string
*      responses:
*        405:
*          description: Invalid input
*      security:
*      - taskstore_auth:
*        - write:tasks
*        - read:tasks
*/
router.post('/', (req, res) => {
  const {task} = req.body;
  //console.log(id, task);
  const query = `INSERT INTO tasks (title, description, code, advance, comment) VALUES (?,?,'',0,'');`;
  mysqlConnection.query(query, [req.body.title, req.body.description], (err, rows, fields) => {
    if(!err) {
      res.status(201).json({status: 'Task Saved'});
    } else {
      res.json({error: err});
    }
  });

});

// UPDATE An Task
/**
 * @swagger
 * /tasks:
 *    put:
 *      description: Use to update a task
 *    parameters:
 *      - name: tasks
 *        in: query
 *        description: task of task
 *        required: false
 *        schema:
 *          type: string
 *          format: string
 *    responses:
 *      '201':
 *        description: Successfully updated task
 */
router.put('/:id', (req, res) => {
  const { task } = req.body;
  const { id } = req.params;
  const query = `UPDATE tasks SET ? WHERE id = ?;`;
  mysqlConnection.query(query, [req.body,id], (err, rows, fields) => {
    if(!err) {
      res.status(204).json({status: 'Task Updated'});
    } else {
      res.json({error: err});
    }
  });
});

module.exports = router;
