const dbtool = require('../dbtool.js')

const getOrders = async() => {
    const [orders] = await dbtool.pool.execute({
        'sql':`
            SELECT * from orders
                JOIN restaurants ON restaurants.id = orders.restaurant_id;
            `,
        nestTables: true
    });
    const formattedOrders = orders.map((x) => {
        delete x.restaurants.id
        x.orders.createAt = new Date(x.orders.createAt).toISOString().split('T')[0]
        return Object.assign(x.orders, x.restaurants)
    })

    return formattedOrders
}

const getOrderDetail = async(orderId) => {
    const sql = "SELECT * from orders JOIN restaurants ON orders.restaurant_id = restaurants.id WHERE orders.id = ? ";
    const [orders] = await dbtool.pool.execute(sql, [orderId]);
    const order = orders[0]
    order.createAt = new Date(order.createAt).toISOString().split('T')[0]
    const sql2 = "select * from order_items JOIN menu_items ON order_items.menu_item_id = menu_items.id where order_id = ?";
    const [orderItems] = await dbtool.pool.execute({sql: sql2, nestTables: true}, [orderId]);
    const newOrderItems = orderItems.map((x) => {
        delete x.menu_items.id
        return Object.assign(x.order_items, x.menu_items)
    })
    return {
        order, orderItems:newOrderItems
    }
}

const deleteOrder = async(orderId) => {
    const [orderItems] = await dbtool.pool.execute({sql: 'select * from order_items where order_id = ?'}, [orderId]);
    if (orderItems.length > 0) {
        for (let o of orderItems) {
            await dbtool.pool.execute("DELETE FROM order_items WHERE id = ?", [o.id])
        }
    }
    const query = "DELETE FROM orders WHERE id = ?";
    const data = await dbtool.pool.execute(query, [orderId]);
    return data
}


module.exports = {
    getOrders,
    getOrderDetail,
    deleteOrder
}