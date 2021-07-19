const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

//Gets homepage
app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname+'/public/index.html'));
})

app.get('/notes', async (req, res) => {
    res.sendFile(path.join(__dirname+'/public/notes.html'));
})

app.get('/api/notes', async (req, res) => {
    fs.readFile('./db/db.json', 'utf8' , (err, notes) => {
        if (err) {
          console.error(err)
          return
        }
        //console.log(data)
        notes = JSON.parse(notes);
        res.status(200).json({
            status: 'success',
            length: notes.length,
            data: {
                notes
            }
        })
      });
});

app.post('/api/notes', async(req, res) => {
    console.log(req.body);
    
    fs.readFile('./db/db.json', 'utf8' , (err, notes) => {
        if (err) {
          console.error(err)
          return
        }
        //console.log(data)
        notes = JSON.parse(notes);
        notes.push(req.body);
        notes = JSON.stringify(notes);
        fs.writeFile('./db/db.json', notes, (err) => {
            if (err) {
                console.log(err);
            } else {
                res.status(200).json({
                    status: 'success',
                });
            }
        });
    });
});


//START SERVER
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});