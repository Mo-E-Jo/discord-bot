module.exports = async function monsterQuery(sqlPool ,monsterName) {
    const queryResult = await sqlPool.query('SELECT * FROM important_enemy_stats WHERE "Enemy Name" = $1', [monsterName])
    return queryResult
}