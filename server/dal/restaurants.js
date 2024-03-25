const dbtool = require('../dbtool.js')

const getRestaurants = async() => {
    const [restaurants] = await dbtool.pool.execute({
        'sql': `
        SELECT * from restaurants;
        `
    });
    return restaurants
}

const getRestaurantDetail = async(restaurantId) => {
    const sql = "select * from restaurants where id = ?";
    const [restaurants] = await dbtool.pool.execute(sql, [restaurantId]);
    const restaurant = restaurants[0];

    const [menuItems] = await dbtool.pool.execute({ sql: `SELECT * from menu_items where restaurant_id = ?`}, [restaurantId]);
    return {
        restaurant, menuItems
    }
}

const createRestaurant = async(data) => {
    const { name, description, location, contact } = data;
    const query = `
         INSERT INTO restaurants (name, description, location, contact) 
         VALUES (?, ?, ?, ?)
    `;
    // prepare the values in order of the question marks in the query
    const bindings = [name, description, location, contact];
    const [res] = await dbtool.pool.execute(query, bindings);
    return res
}

const searchRestaurants = async(searchTerms) => {
    console.log('searchRestaurants', searchRestaurants)
    let sql = "SELECT * from restaurants WHERE 1";
    const bindings = [];
    if (searchTerms) {
        sql += ` AND (name LIKE ? OR location LIKE ?)`;
        bindings.push(`%${searchTerms}%`);
        bindings.push(`%${searchTerms}%`);
    }
    const [restaurants] = await dbtool.pool.execute(sql, bindings);
    return restaurants
}

const deleteRestaurant = async(restaurantId) => {
    const query = "DELETE FROM restaurants WHERE id = ?";
    const [orders] = await dbtool.pool.execute({sql: 'select * from orders where restaurant_id = ?'}, [restaurantId])
    const [menuItems] = await dbtool.pool.execute({sql: 'select * from menu_items where restaurant_id = ?'}, [restaurantId])
    if (orders.length > 0 || menuItems.length > 0) {
        return 
    } else {
        const [res] = await dbtool.pool.execute(query, [restaurantId]);
        return res
    }
}

const updateRestaurant = async (restaurantId, data) => {
    const { name, description, location, contact } = data;
    const query = `UPDATE restaurants SET name=?,
                                        description =?,
                                        location=?,
                                        contact=?
                                    WHERE id = ?
    `;
    const bindings = [name, description, location, contact, restaurantId];
    const [res] = await dbtool.pool.execute(query, bindings);
    return res
}

const createMenu = async (restaurantId, data) => {
    const { name, description, price, category, status } = data;
    const query = `
    INSERT INTO menu_items (name, description, price, category, status, restaurant_id) 
    VALUES (?, ?, ?, ?, ?, ?)
`;
    const bindings = [name, description, parseInt(price), category, parseInt(status), parseInt(restaurantId)];
    
    try {
        const [res] = await dbtool.pool.execute(query, bindings);
        return res
    } catch (err) {
        throw err;
    }
}

const deleteMenu = async(menuId) => {
    const query = "DELETE FROM menu_items WHERE id = ?";
    const [res] = await dbtool.pool.execute(query, [menuId]);
    return res
}

const updateMenu = async (menuId, data) => {
    const { name, description, price, category, status } = data;
    const query = `UPDATE menu_items SET name=?,
                                        description =?,
                                        price=?,
                                        category=?,
                                        status=?
                                    WHERE id = ?
    `;
    const bindings = [name, description, parseInt(price), category, parseInt(status), menuId];
    const [ res ] = await dbtool.pool.execute(query, bindings);
    return res
}

const placeOrder = async(restaurantId, menuId) => {
    const query = "SELECT * FROM menu_items WHERE id = ?";
    const [menuItems] = await dbtool.pool.execute(query, [menuId]);
    const menuItem = menuItems[0];

    const totalPrice = menuItem.price
    const createAt =  new Date().toISOString().split('T')[0]
    const updateAt = new Date().toISOString().split('T')[0]
    let status = 'Pending'
    let results = undefined

    const query2 = `
    INSERT INTO orders (createAt, updateAt, total, status, restaurant_id) 
    VALUES (?, ?, ?, ?, ?)
`;
    const bindings = [createAt, updateAt, parseInt(totalPrice), status, parseInt(restaurantId)];
    try {
        [results] = await dbtool.pool.execute(query2, bindings);
    } catch (err) {
        throw err;
    }
    const newOrderId = results && results.insertId ? results.insertId : 0;
    const quantity = 1
    const query3 = `
    INSERT INTO order_items (quantity, subtotal, order_id, menu_item_id) 
    VALUES (?, ?, ?, ?)
`;
    const bindings3 = [quantity, parseInt(totalPrice), parseInt(newOrderId), parseInt(menuId)];
    try {
        if (newOrderId) {
            const [res] = await dbtool.pool.execute(query3, bindings3);
            return res
        }
    } catch (err) {
        throw err;
    }
}


module.exports = {
    getRestaurants,
    getRestaurantDetail,
    createRestaurant,
    searchRestaurants,
    deleteRestaurant,
    updateRestaurant,
    createMenu,
    deleteMenu,
    updateMenu,
    placeOrder
}