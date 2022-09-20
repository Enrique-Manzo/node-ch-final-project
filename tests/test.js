import assert from 'assert'
import axios from 'axios'

const url = 'http://localhost:8080/api/productos'

const productData = {
    "_id": 8219382193889123,
    "id": 165390132423,
    "name": "Xiaomi Mini X",
    "price": 125.5,
    "tag": "New",
    "image": "images/w1.png",
    "featured": false,
    "stock": 20,
    "description": "Smartwatches come in many different sizes, designs, and they can vary greatly when it comes to features. Before making a buying decision, ask yourself whether you want a watch primarily for fitness and sleep tracking, or whether the style is your top priority. "
}

const productSampleData = {
    id: 165390132423,
    name: "Xiaomi Mini X",
    price: 125.5,
    tag: "New",
    image: "images/w1.png",
    featured: false,
    stock: 20,
    description: "Smartwatches come in many different sizes, designs, and they can vary greatly when it comes to features. Before making a buying decision, ask yourself whether you want a watch primarily for fitness and sleep tracking, or whether the style is your top priority. "
}

const productDataArray = [productData]

describe('api productos', () => {
    describe('when requesting all products...', () => {
        it('returns all products and code 200', async () => {

            const response = await axios.get(url)
            
            assert.strictEqual(response.status, 200)
            assert.deepStrictEqual(await Object.keys(response.data[0]), Object.keys(productDataArray[0]))
            /* const { data, status } = await axios.post(url, datosNoticia)

            assert.strictEqual(status, 201)

            assert.ok(data)
            assert.ok(data.id)

            const { data: noticiaObtenida } = await axios.get(url + '/' + data.id)

            delete noticiaObtenida.id
            assert.deepStrictEqual(noticiaObtenida, datosNoticia) */
        })
    })

    describe('when requesting one product with an existing id...', () => {
        it('returns the product and a code 200', async () => {

            const {data, status} = await axios.get("http://localhost:8080/api/product/"+1653903436215)

            assert.strictEqual(status, 200)
            assert.deepStrictEqual(Object.keys(data), Object.keys(productData))

            /* return assert.rejects(
                axios.post(url, { nombre: 'pepe' }),
                // axios.post(url, datosNoticia),
                ({ response }) => {
                    assert.strictEqual(response.status, 400)
                    return true
                }
            ) */
        })
    })

    describe('when requesting one product with a non-existing id...', () => {
        it('doesnt return the product but a code 404', async () => {

            return assert.rejects(
                axios.get("http://localhost:8080/api/product/"+1),
                (response) => {
                    assert.strictEqual(response.response.status, 404)
                    return true
                }
            )
        })
    })

    describe('when posting a new product...', () => {
        it('returns status code 200', async () => {
            await axios.get("http://localhost:8080/api/prod_login")
            const {status} = await axios.post("http://localhost:8080/api/product", productSampleData)

            assert.strictEqual(status, 200)

        })
    })

    describe('when deleting product by id...', () => {
        it('returns status code 200', async () => {
            await axios.get("http://localhost:8080/api/prod_login")
            const {status} = await axios.delete("http://localhost:8080/api/product/"+productData.id)
            assert.strictEqual(status, 200)

        })
    })
})