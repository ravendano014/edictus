const express = require('express');
const router = express.Router();

const items = require('../data.json');

router.get('/', (req, res) => {
  res.json(items);
});

router.post('/', (req, res) => {
  //console.log(req.body);
  const { name } = req.body;
  items.push({
    id: items.length + 1,
    name
  });
  res.json('Successfully created');
});

router.put('/:id', (req, res) => {
  //console.log(req.body, req.params)
  const { id } = req.params;
  const { name } = req.body;

  items.forEach((item, i) => {
    if (item.id == id) {
      item.name = name;
    }
  });
  res.json('Successfully updated');

});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  items.forEach((item, i) => {
    if(item.id == id) {
      items.splice(i, 1);
    }
  });
  res.json('Successfully deleted');
});

module.exports = router;