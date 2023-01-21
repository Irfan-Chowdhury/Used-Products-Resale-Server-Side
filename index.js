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
        const ordersCollection = client.db('eRecycleProducts').collection('orders');
        const wishlistsCollection = client.db('eRecycleProducts').collection('wishlists');

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
        //             seller_verify: 0
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

        // Show By Id
        app.get('/categories/:id', async (req, res) => {
            const id =  req.params.id;
            const query = {_id: ObjectId(id) }
            const category = await categoriesCollection.findOne(query);
            res.send(category);
        });


        /**
         * ==========================================
         *    Product Section
         * ==========================================
         */

        // Get all-available-products
        app.get('/all-available-products', async (req, res) => {
            const query = {status:0}
            const products = await productsCollection.find(query).toArray();
            res.send(products);
        });
        // Get all-available-&-advertise-products
        app.get('/all-available-and-advertise-products', async (req, res) => {
            const query = {status:0,advertise:0}
            const products = await productsCollection.find(query).sort({"_id":-1}).toArray(); //desending
            res.send(products);
        });

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

        // Get All Users
        app.get('/users', async (req, res) => {
            const query = {}
            const users = await usersCollection.find(query).toArray();
            res.send(users);
        });

        // User Create
        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });

        // Get all-sellers
        app.get('/all-sellers', async (req, res) => {
            const query = {role:'seller'}
            const users = await usersCollection.find(query).toArray();
            res.send(users);
        });

        // Make Verify Seller
        app.put('/all-sellers/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const seller = req.body;
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    verify: seller.verify
                }
            }
            const result = await usersCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });

        // Delete User
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(filter);
            res.send(result);
        });

        /**
         * ==========================================
         *    Buyer Section
         * ==========================================
         */

        // Get all-Buyers
        app.get('/all-buyers', async (req, res) => {
            const query = {role:'buyer'}
            const users = await usersCollection.find(query).toArray();
            res.send(users);
        });

        /**
         * ==========================================
         *    Admin Section
         * ==========================================
         */

        // fetch Specific to Admin Check 
        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send({ isAdmin: user?.role === 'admin' });
        });

        // fetch Specific to Seller Check 
        app.get('/users/seller/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const seller = await usersCollection.findOne(query);
            res.send(seller);
        });

        /**
         * ==========================================
         *    Order Section
         * ==========================================
         */

        // Order Get
        app.get('/orders', async (req, res) => {
            const query = {}
            const orders = await ordersCollection.find(query).toArray();
            res.send(orders);
        });

        // Order Store
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.send(result);
        });

        // Get Order lists By Email
        app.get('/orders/:email', async (req, res) => {
            const email = req.params.email;
            const query = {buyer_email:email}
            const orders = await ordersCollection.find(query).toArray();
            res.send(orders);
        });

        // Show Order By Id
        app.get('/orders/checkout/:id', async (req, res) => {
            const id =  req.params.id;
            const query = {_id: ObjectId(id) }
            const order = await ordersCollection.findOne(query);
            res.send(order);
        });

        // Order Update By Id
        app.put('/orders/checkout/:id', async (req, res) => {
            const id =  req.params.id;
            const filter = {_id: ObjectId(id)};
            const order = req.body;
            const option = {upsert:true};
            const updateOrder = {
                $set : {
                    payment_status: order.payment_status,
                    payment_method: order.payment_method,
                    card_number: order.card_number,
                    product_title: order.product_title,
                    date_format_cbc: order.date_format_cbc,
                }
            }
            const result = await ordersCollection.updateOne(filter, updateOrder,option);

            // Update Product
            const productFilter = {_id: ObjectId(order.product_id)};
            const productOption = {upsert:true};
            const updateProduct = {
                $set : {
                    status: 1,
                }
            }
            const resultProduct = await productsCollection.updateOne(productFilter, updateProduct,productOption);
            res.send(result);
        });

        /**
         * ==========================================
         *    Buyer Section
         * ==========================================
         */

        // fetch Specific to Buyer Check 
        app.get('/users/buyer/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send({ isBuyer: user?.role === 'buyer' });
        });

        /**
         * ==========================================
         *    Wishlist Section
         * ==========================================
         */

        // Wishlist Store
        app.post('/wishlists', async (req, res) => {
            const wishlist = req.body;
            const result = await wishlistsCollection.insertOne(wishlist);
            res.send(result);
        });

        // Get Wishlists By Email
        app.get('/wishlists/:email', async (req, res) => {
            const email = req.params.email;
            const query = {buyer_email:email}
            const wishlists = await wishlistsCollection.find(query).toArray();
            res.send(wishlists);
        });

        // Delete Wishlist
        app.delete('/wishlists/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await wishlistsCollection.deleteOne(filter);
            res.send(result);
        });
    }
    finally {}
}
run().catch(console.log);



app.get('/', (req, res) => {
    res.send('Server is running');
});

app.listen(port, () =>{
    console.log('Server running on port', port);
});