const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;


const app = express();

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uys3vh8.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const categoriesCollection = client.db('eRecycleProducts').collection('categories');
        const usersCollection = client.db('eRecycleProducts').collection('users');
        const productsCollection = client.db('eRecycleProducts').collection('products');

        /**
         * -----------------------------------
         * API Naming Convention  [products]
         * -----------------------------------
         * app.get('/products')
         * app.get('/products/:id')
         * app.post('/products')
         * app.patch('/products/:id')
         * app.delete('/products/:id')
         */

        // temporary to update any filed field on appointment options
        // app.get('/products-update-field', async (req, res) => {
        //     const filter = {}
        //     const options = { upsert: true }
        //     const updatedDoc = {
        //         $set: {
        //             advertise: 0
        //         }
        //     }
        //     const result = await productsCollection.updateMany(filter, updatedDoc, options);
        //     res.send(result);
        // })


        /**
         * ==========================================
         *    Category Section
         * ==========================================
         */

        // Get All
        app.get('/categories', async (req, res) => {
            const query = {}
            const result = await categoriesCollection.find(query).toArray();
            res.send(result);
        });


        /**
         * ==========================================
         *    Product Section
         * ==========================================
         */

        // Store
        app.post('/products', async (req, res) => {
            const product = req.body;
            console.log(product);
            const result = await productsCollection.insertOne(product);
            res.send(result);
        });

        // Get data by email
        app.get('/products', async (req, res) => {
            const email = req.query.seller_email;
            // const decodedEmail = req.decoded.seller_email;
            // if (email !== decodedEmail) {
            //     return res.status(403).send({ message: 'forbidden access' });
            // }
            const query = { seller_email: email };
            const products = await productsCollection.find(query).toArray();
            console.log(products); 
            res.send(products);
        });

        // Update Advertise
        app.put('/products/:id', async (req, res) => {
            const id =  req.params.id;
            const filter = {_id: ObjectId(id)};
            const product = req.body;
            const option = {upsert:true};
            const updateUser = {
                $set : {
                    advertise: product.advertise,
                }
            }
            const result = await productsCollection.updateOne(filter, updateUser,option);
            res.send(result);
        })

        // Delete Product
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(filter);
            res.send(result);
        })



        /**
         * ==========================================
         *    User Section
         * ==========================================
         */

        // User Create
        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });



    }
    finally {

    }
}
run().catch(console.log);



app.get('/', (req, res) => {
    res.send('Server is running');
});

app.listen(port, () =>{
    console.log('Server running on port', port);
});