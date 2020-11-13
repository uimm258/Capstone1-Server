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
    content: xss(script.content),
    category_id: script.category_id,
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
    .post(jsonParser, (req, res, next) => {
        for(const field of ['scripts_name', 'people', 'time_spend', 'scripts_price', 'scripts_type', 'content', 'category_id']){
            if(!req.body[field]){
                logger.error(`The ${field} value is missing from scripts post`);
                return res.status(400).json({error: {message:`${field} is missing`}});
            }
        }
        const newScript = {
            scripts_name: xss(script.scripts_name),
            people: xss(script.people),
            time_spend: xss(script.time_spend),
            scripts_price: xss(script.scripts_price),
            scripts_type: xss(script.scripts_type),
            content: xss(script.content),
            category_id: script.category_id,
        };
        ScriptsService
            .insertNote(req.app.get('db'), newScript)
            .then((script) => {
                logger.info(`Scripts with id ${script.id} has been created`);
                res.status(201).location(`/scripts/${script.id}`).json(script);
            })
            .catch(next);
    });

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
    .delete((req, res, next) => {
        const { script_id } = req.params;
        ScriptsService
            .deleteScript(req.app.get('db'), script_id)
            .then(() => {
                logger.info(`Script with id ${script_id} deleted`);
                res.status(204).end();
            })
            .catch(next);
    })
    .patch(jsonParser, (req, res, next) => {
        const scriptUpdate = req.body;
        if (Object.keys(scriptUpdate).length == 0) {
            logger.info('script must have value to update');
            return res.status(400).json({
                error: { message: 'patch request must supply values'},
            });
        }
        ScriptsService
            .updateScript(req.app.get('db'), res.script.id, scriptUpdate)
            .then((updatedScript) => {
                logger.info(`script with id ${res.script.id} updated`);
                res.status(204).end();
            });
    });

module.exports = ScriptsRouter;