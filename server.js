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
//Get note page
app.get('/notes', async (req, res) => {
    res.sendFile(path.join(__dirname+'/public/notes.html'));
})
//Get notes from "DB"
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
//Add a note to DB
app.post('/api/notes', async(req, res) => {
    //console.log(req.body);
    
    fs.readFile('./db/db.json', 'utf8' , (err, notes) => {
        if (err) {
          console.error(err)
          return
        }
        //console.log(data)
        notes = JSON.parse(notes);
        let newNote = req.body;
        newNote.id = notes.length + 1;
        notes.push(newNote);
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

app.delete('/api/notes/:id', async(req, res) => {
    //console.log(req.params.id);
    let id = req.params.id;
    fs.readFile('./db/db.json', 'utf8' , (err, notes) => {
        if (err) {
          console.error(err)
          return
        }
        //console.log(data)
        notes = JSON.parse(notes);
        let newNotes = [];
        let i = 0;
        notes.forEach(el => {
            if(el.id == id) {
                console.log('Note Deleted:');
                console.log(el);
            } else {
                el.id = i;
                newNotes.push(el);
                i++;
            }
        })
        newNotes = JSON.stringify(newNotes);
        fs.writeFile('./db/db.json', newNotes, (err) => {
            if (err) {
                console.log(err);
            } else {
                res.status(200).json({
                    status: 'success',
                });
            }
        });
    });
})


//START SERVER
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});