const express = require('express');
const ScriptsService = require('./scripts_service');
const xss = require('xss');
const ScriptsRouter = express.Router();
const jsonParser = express.json();
const logger = require('../logger');

const initScripts = (script) => ({
    id: script.id,
    scripts_name: xss(script.scripts_name),
    people: xss(script.people),
    time_spend: xss(script.time_spend),
    scripts_price: xss(script.scripts_price),
    scripts_type: xss(script.scripts_type),
    scripts_image: xss(script.scripts_image),
    content: xss(script.content),
    category_id: script.category_id,
    admin: script.admin_id
});

ScriptsRouter
    .route('/')
    .get((req, res, next) => {
        const knex = req.app.get('db');
        ScriptsService
            .getAllScripts(knex)
            .then((scripts) => res.json(scripts.map(initScripts)))
            .catch(next);
    })
    

ScriptsRouter
    .route('/:script_id')
    .all((req, res, next) => {
        const { script_id } = req.params
        ScriptsService
            .getById(req.app.get('db'), script_id)
            .then((script)=> {
                if(!script) {
                    logger.error(`Script with id ${script_id} not found`);
                    return res.status(400).json({ error: {message:'Script not found'} });
                }
                res.script = script;
                next();
            }) 
            .catch(next);
    })
    .get((req, res, next) => {
        const script = res.script;
        res.json(initScripts(script));
    })

module.exports = ScriptsRouter;