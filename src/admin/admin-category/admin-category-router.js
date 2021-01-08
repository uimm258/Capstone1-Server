const express = require('express');
const xss = require('xss');
const logger = require('../logger');
const AdminCategoryRouter = express.Router();
const jsonParser = express.json();
const AdminCategoryService = require('./admin-category-service');
const { requireAuth } = require('../../middleware/jwt-auth');

const initCategory = (category) => ({
    id: category.id,
    category_name: xss(category.category_name),
    admin: category.admin_owner
});

AdminCategoryRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        const knex = req.app.get('db');
        AdminCategoryService.getAllCategory(knex, req.user.id)
            .then((category) => res.json(category.map(initCategory)))
            .catch(next);
    })
    .post(jsonParser, (req, res, next) => {
        for(const field of ['category_name']){
            if(!req.body[field]){
                logger.error(`The ${field} is missing for the category to post`);
                return res.status(400).json({error:{message:`${field} is missing`}});
            }
        }
        const newCategory = {
            category_name: xss(req.body.category_name),
        };
        newCategory.admin = req.user.id
        AdminCategoryService
            .insertCategory(req.app.get('db'), newCategory)
            .then((category) => {
                logger.info(`category with id${category.id} created`);
                res.status(201).location(`/category/${category.id}`).json(category);
            })
            .catch(next);
    });

//delete
AdminCategoryRouter
    .route('/:category_id')
    .all(requireAuth)
    .all((req, res, next) => {
        const {category_id} = req.params;
        AdminCategoryService.getById(req.app.get('db'), category_id)
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
    .delete((req, res, next) => {
        const {category_id} = req.params;
        AdminCategoryService.deleteCategory(req.app.get('db'), category_id, req.user.id)
            .then(()=> {
                logger.info(`Category with id ${category_id} has been deleted`);
                res.status(204).end();
            })
            .catch(next);
    })
    .patch(jsonParser, (req, res,next) => {
        const categoryUpdates = req.body;
        if(Object.keys(categoryUpdates).length == 0) {
            logger.info('Category can not be empty');
            return res.status(400).json({
                error: { message: 'patch request must supply values to update' },
            });
        }
        AdminCategoryService
            .updateCategory(
                req.app.get('db'),
                res.cateogry.id,
                req.user.id,
                categoryUpdates
            ).then((updateCategory) => {
                logger.info(`The category with id ${res.category.id} has been updated`);
                res.status(204).end();
            });
    });

module.exports = AdminCategoryRouter;
