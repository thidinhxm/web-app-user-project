const {models} = require('../../models');
const {Op, literal} = require('sequelize');
const reviewService = require('../reviews/reviewService');
exports.getAll = async (query) => {
    try {
        const option = {
            offset: (query.page - 1) * query.limit,
            limit: query.limit,
            where: {
                price: {
                    [Op.between]: [query.min * 1000, query.max * 1000]
                },
                is_active: 1
            },
            include : [{
                model : models.images,
                as : 'images',
                where : {
                    image_stt: 1
                },
            }],
            raw : true
        }
        if(query.categories) {
            const categories = query.categories.split(',');
            option.where.category_id = {
                [Op.or]: categories
            }
        }
        if(query.brands) {
            const brands = query.brands.split(',');
            option.where.brand_id = {
                [Op.or]: brands
            }
        }
    
        const products = await models.products.findAndCountAll(option);
        if (products) {
            products.rows.forEach(async (product) => {
                    product.reviews = await reviewService.getReviewsProduct(product.product_id);
                    product.average_rating = reviewService.getAverageRating(product.reviews);
            });
        }
                
        return products;
    }
    catch(error) {
        throw error;
    }
}

exports.getImagesProduct = (id) => {
    return models.images.findAll({
        attributes : ['image_link'],
        where : {
            product_id : id
        },
        raw : true
    });
}



exports.getOne = (id) => {
    return models.products.findOne({
        where : {
            product_id : id,
            is_active : 1
        },
        raw : true
    });
}

exports.getNewProducts = (limit = 10) => {
    return models.products.findAll({
        limit : limit,
        order : [
            ['model_year', 'DESC']
        ],
        where : {
            is_active : 1
        },
        include : [{
            model : models.images,
            as : 'images',
            where : {
                image_stt: 1
            },
        }],
        raw : true
    });
}

exports.getHotProducts = (limit = 10) => {
    return models.products.findAll({
        limit : limit,
        order : [
            ['model_year']
        ],
        where : {
            is_active : 1
        },
        include : [{
            model : models.images,
            as : 'images',
            where : {
                image_stt: 1
            },
        }],
        raw : true
    });
}

exports.getSimilarProducts = (category_id, brand_id, product_id, limit = 10) => {
    return models.products.findAll({
        limit : limit,
        where : {
            [Op.or] : [
                { category_id : category_id },
                { brand_id : brand_id },
            ],
            product_id : {
                [Op.ne] : product_id,
            },
            is_active : 1
        },
        order : [
            ['model_year', 'DESC']
        ],
        include : [{
            model : models.images,
            as : 'images',
            where : {
                image_stt: 1
            },
        }],
        raw : true
    });
}

exports.updateViewProduct = (id) => {
    return models.products.update({
        number_of_views : literal('number_of_views + 1')
    }, {
        where : {
            product_id : id
        }
    });
}