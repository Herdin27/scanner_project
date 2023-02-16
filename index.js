var express = require('express')
var app = express()
var port = process.env.PORT || 8080
var bodyParser = require('body-parser');
var http = require("http")
const server = http.createServer(app);
var cors = require('cors');
const { product } = require('./collections');
require('dotenv').config()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

var JsBarcode = require('jsbarcode');
// const { DOMImplementation, XMLSerializer } = require('xmldom');
const { db } = require('./db/db.config');
var QRCode = require('qrcode')
// const xmlSerializer = new XMLSerializer();
// const document = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null);
// const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');



app.post('/create', async (req, res) => {
    try {
        console.log(req.body);
        const { nama_product, status_scan } = req.body
        const dataJson = {
            nama_product,
            status_scan
        };
        const response = await product.doc(nama_product).set(dataJson);
        res.send(response);
    } catch (error) {
        res.send(error);
    }
});

app.get('/scanimage', async (req, res) => {
    let product = [], code128 = []
    const getProductDetail = await db.collection('products').get()
    if (getProductDetail.docs.length > 0) {
        for (const user of getProductDetail.docs) {
            product.push(user.data())
        }
    }
    // product.map(item => {

    // })
    QRCode.toDataURL(`http://localhost:8080/scan/${product[0].nama_product}`, function (err, url) {
        res.send(`
        <div>
            <img src=${url} alt="">
        <div>
        `)
    })
})

app.get('/scan/:nama_product', async (req, res) => {
    console.log(req.params)
    let docRef = product.doc(req.params.nama_product)
    await docRef.update({
        status_scan: 'sudah discan'
    })
    res.send(`
    <div>
       <h1>SUKSES</h1>
    <div>
    `);
})

server.listen(port, () =>
    console.log(`test:${port} || ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`));