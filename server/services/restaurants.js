const dataLayer = require('../dal/restaurants')

async function getRestaurants() {
    return await dataLayer.getRestaurants();
}
async function getRestaurantDetail(restaurantId) {
    return await dataLayer.getRestaurantDetail(restaurantId);
}
async function createRestaurant(data) {
    return await dataLayer.createRestaurant(data);
}
async function searchRestaurants(searchTerms) {
    return await dataLayer.searchRestaurants(searchTerms);
}
async function deleteRestaurant(restaurantId) {
    return dataLayer.deleteRestaurant(restaurantId)
}
async function updateRestaurant(restaurantId, data) {
    return dataLayer.updateRestaurant(restaurantId, data)
}
module.exports = {
    getRestaurants,
    getRestaurantDetail,
    createRestaurant,
    searchRestaurants,
    deleteRestaurant,
    updateRestaurant,
}