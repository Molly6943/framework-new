const express = require('express')
const router = express.Router()

const {getOrders, getOrderDetail, deleteOrder} = require('../dal/orders.js')

router.get('/', async function (req, res) {
    const orders = await getOrders()
    res.json(orders)
});

router.get('/:id', async function (req, res) {
    const orderData = await getOrderDetail(req.params.id)
    res.json(orderData)
});

router.delete('/:id', async function (req, res) {
    const data = await deleteOrder(req.params.id)
    res.json(data)
});

module.exports = router