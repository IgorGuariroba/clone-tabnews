import { Client} from 'pg'
async function query(queryObject) {
    const client = new Client({
        host: process.env.HOST_BD,
        port: process.env.PORT_BD,
        user: process.env.USER_BD,
        database: process.env.DATA_BASE_BD,
        password: process.env.PASSWORD_BD
    })
    await client.connect()
    const result = await client.query(queryObject)
    await client.end()
    return result
}

export default {
    query: query
}