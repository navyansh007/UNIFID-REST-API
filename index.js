let express = require('express');

let app = express();

let MongoClient = require('mongodb').MongoClient;

let url = "mongodb://localhost:27017/";

app.use(express.json());

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
});

app.post('/', (req, res) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        let dbo = db.db("UNIFID-Identity");
        dbo.collection("Users").insertOne({
            wallet : req.body.wallet,
            contract: req.body.contract
        }, 
        function(err, result) {
            if(err) {
                res.json({"status": "ERROR"})
                db.close()
            } else {
                result['status'] = 'SUCCESS'
                res.json(result)
                db.close()
            }
        });
        
    });
});

app.get('/:wallet', (req, res) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        let dbo = db.db("UNIFID-Identity");
        dbo.collection("Users").findOne({
            wallet: req.params.wallet
        }, 
        function(err, result) {
            if (err) throw err;
            if (result != null){
                result['isVerified'] = 'VERIFIED'
                res.json(result);
                db.close();
            } else {
                res.json({'isVerified': 'NOT_VERIFIED'})
                db.close()
            }

        });
    });
});

app.listen(8000, () => console.log('Server running on port 8000!'))