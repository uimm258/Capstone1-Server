const express = require('express');
const xss = require('xss');
const logger = require('../logger');
const CategoryRouter = express.Router();
const jsonParser = express.json();
const CategoryService = require('./category_service');

const initCategory = (category) => ({
    id: category.id,
    category_name: xss(category.category_name),
    admin_id: category.admin_id
});

CategoryRouter
    .route('/')
    .get((req, res, next) => {
        const knex = req.app.get('db');
        CategoryService.getAllCategory(knex)
            .then((category) => res.json(category.map(initCategory)))
            .catch(next);
    })

CategoryRouter
    .route('/:category_id')
    .all((req, res, next) => {
        const {category_id} = req.params;
        CategoryService.getById(req.app.get('db'), category_id)
            .then((category) => {
                if(!category) {
                    logger.error(`The category with id the ${category_id} was not found`);
                    return res.status(404).json({error: {message: 'category not found'}});
                }
                res.category = category;
                next();
            })
            .catch(next);
    })
    .get((req, res, next) => {
        const category = res.category;
        res.json(initCategory(category));
    })

module.exports = CategoryRouter;
