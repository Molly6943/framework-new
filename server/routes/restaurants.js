
const {
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
} = require('../services/restaurants')

const express = require('express')
const router = express.Router();


router.get('/', async function (req, res) {
    const restaurants = await getRestaurants();
    res.json(restaurants)
});
router.get('/search', async function (req, res) {
    console.log(req.query.searchTerms)
    const data = await searchRestaurants(req.query.searchTerms)
    res.json(data)
});

router.get('/:id', async function (req, res) {
    const data = await getRestaurantDetail(req.params.id)
    res.json(data)
});

router.post('/', async function (req, res) {
    const data = await createRestaurant(req.body)
    res.json(data);
});

router.delete('/:id', async function (req, res) {
    const data = await deleteRestaurant(req.params.id)
    res.json(data)
});

router.put('/:id', async function (req, res) {
    const data = await updateRestaurant(req.params.id, req.body)
    res.json(data);
})

// Process the form to create an menu item
router.post('/:id/menu', async function (req, res) {
    const data = await createMenu(req.params.id, req.body)
    res.json(data)
});


router.delete('/:restaurant_id/menu/:menu_item_id', async function (req, res) {
    const data = await deleteMenu(req.params.menu_item_id)  
    res.json(data);
});

router.put('/:restaurant_id/menu/:menu_item_id', async function (req, res) {
    const data = await updateMenu(req.params.menu_item_id, req.body)
    res.json(data);
})

router.post('/:restaurant_id/menu/:menu_item_id/order', async function (req, res) {
    const data = await placeOrder(req.params.restaurant_id, req.params.menu_item_id)
    res.json(data);
});

module.exports = router