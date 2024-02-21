const express = require('express');
const AssigneeRoute = express.Router();
const {EventAssignees} = require('../Model/EventAssignees');

AssigneeRoute.get('/', async (req, res) => {
    try {
      const assignees = await EventAssignees.find();
      
      res.status(200).send(assignees);
    } catch (error) {
      
      res.status(500).send(error);
    }
  });
AssigneeRoute.post('/', async (req, res) => {
  try {
    const newAssignee = new EventAssignees(req.body);
    await newAssignee.save();
    res.status(201).send(newAssignee);
  } catch (error) {
    res.status(400).send(error);
  }
});

AssigneeRoute.patch('/:id', async (req, res) => {
    const id = req.params.id;
  const payload = req.body;

    try {
      const updatedAssignee = await EventAssignees.findByIdAndUpdate(
        { _id: id}, 
        {...payload}
        
      );
  
      if (!updatedAssignee) {
        return res.status(404).send('Assignee not found');
      }
  
      res.send(updatedAssignee);
    } catch (error) {
      res.status(400).send(error);
    }
  });

  AssigneeRoute.delete('/:id', async (req, res) => {
    try {
      const deletedAssignee = await EventAssignees.findByIdAndDelete(req.params.id);
  
      if (!deletedAssignee) {
        return res.status(404).send('Assignee not found');
      }
  
      res.send(deletedAssignee);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  


module.exports = {AssigneeRoute};
