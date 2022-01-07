const {models} = require('../../models');

exports.listOrder= (id) => {
    return models.orders.findAll(
        {
            where:{
                user_id:id
            },
            order:[
                ['create_date', 'DESC'],
            ]
            ,
            raw:true
        }
    )
}
exports.detailOrder= (id) => {
    return models.detailorders.findAll({
        include:[{
            model:models.products,
            as:'product',
            include:[
                {
                model:models.images,
                as:'images',
                where:{image_stt:1}
                },
                {
                model:models.categories,
                as:'category',
                }
            ]
        }],
        where:{
            order_id:id
        },
        raw:true
    })
}
exports.order = (id) => {
    return models.orders.findOne({
        where: {
            order_id:id
        },
        raw:true
    })
}

exports.create = (order) => {
    return models.orders.create({
        user_id:order.user_id,
        receive_phone:order.receive_phone,
        receive_address:order.receive_address,
        voucher:order.voucher,
        payment_status:order.payment_status
    });
}

exports.createDetail = async (detail) => {
    return await models.detailorders.create({
        order_id:detail.order_id,
        product_id:detail.product_id,
        quantity:detail.quantity
    });
}

exports.reviewDetailOrder = (order_id,product_id) =>
{
    return models.detailorders.update({
        is_reviewed : 1,
        
    },
    {
        where:{
            order_id:order_id,
            product_id:product_id
        }
    })
}