const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fpoonbe.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const percelCollection = client.db('ZapDB').collection('percelCollection');


        app.get('/percels', async (req, res) => {
            try {
                const result = await percelCollection.find().toArray()
                res.send(result);
            } catch (error) {
                res.status(500).send({ message: 'fail to fetch percel', error })
            }
        });

        app.get('/percels', async (req, res) => {
            try {
                const userEmail = req.query.email;
                const query = userEmail ?{ userEmail: userEmail }: {};
                const option = {
                    sort: {
                        createdAt:-1
                    }
                }
                const percel = await percelCollection.find(query, option).toArray()
                res.send(percel)
            } catch(error){
                console.log('faild fetching to error', error)
                res.status(500).send({message:'fail to get percel'})
            }
        })

        app.post('/percels', async (req, res) => {
            try {
                const percelData = req.body;
                const result = await percelCollection.insertOne(percelData);
                res.send(result);
            } catch (error) {
                res.status(500).send({ message: 'fail to add percel', error })
            }
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', async (req, res) => {
    res.send('zap is running')
})
app.listen(PORT, () => {
    console.log(`server is runnig:${PORT}`)
});