const express = require('express');
const AdminScriptsService = require('./admin-script-service');
const xss = require('xss');
const AdminScriptsRouter = express.Router();
const jsonParser = express.json();
const logger = require('../logger');
const { requireAuth } = require('../../middleware/jwt-auth');

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
    admin: script.admin_owner
});

AdminScriptsRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        const knex = req.app.get('db');
        AdminScriptsService
            .getAllScripts(knex, req.user.id)
            .then((scripts) => res.json(scripts.map(initScripts)))
            .catch(next);
    })
    .post(jsonParser, (req, res, next) => {
        for(const field of ['scripts_name', 'people', 'time_spend', 'scripts_price', 'scripts_type', 'scripts_image', 'content', 'category_id']){
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
            scripts_image: xss(script.scripts_image),
            content: xss(script.content),
            category_id: script.category_id,
        };
        newScript.admin = req.user.id
        AdminScriptsService
            .insertNote(req.app.get('db'), newScript)
            .then((script) => {
                logger.info(`Scripts with id ${script.id} has been created`);
                res.status(201).location(`/scripts/${script.id}`).json(script);
            })
            .catch(next);
    });

AdminScriptsRouter
    .route('/:script_id')
    .all(requireAuth)
    .all((req, res, next) => {
        const { script_id } = req.params
        AdminScriptsService
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
        AdminScriptsService
            .deleteScript(req.app.get('db'), script_id, req.user.id)
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
        AdminScriptsService
            .updateScript(req.app.get('db'), res.script.id, scriptUpdate, req.user.id)
            .then((updatedScript) => {
                logger.info(`script with id ${res.script.id} updated`);
                res.status(204).end();
            });
    });

module.exports = AdminScriptsRouter;