const express = require('express');
const mysql = require('mysql');

const app = express();
app.use(express.json());

// My SQL Connection

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'mysql_nodejs'
})

connection.connect((err) =>{
    if (err){
        console.log('Error connection to MySQL database =',err)
        return;
    }
    console.log('MySQL successfully connected!')
})

// Create Routers

app.post("/create",async (req, res)=>{
    const { email, fname, password } = req.body;

    try {
        connection.query(
            "INSERT INTO user(email, fname, password) VALUES(?,?,?)",
            [email, fname, password],
            (err, results, fields) => {
                if (err) {
                    console.log("Error while inserting a user into the database",err);
                    return res.status(400).send();

                }
                return res.status(201).json({ message: "New user sccesfully created!"})
            }
        )
    } catch(err){
        console.log(err);
        return res.status(500).send();
    }
})

// READ
app.get("/read",async (req,res)=>{
    try{
        connection.query("SELECT * FROM user", (err, results, fields)=>{
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            res.status(200).json(results)
        })
    }catch(err){
        console.log(err);
        return res.status(500).send();
    }
})

// READ single user from db

app.get("/read/single/:email",async (req,res)=>{
    const email = req.params.email;

    try{
        connection.query("SELECT * FROM user WHERE email =?",[email], (err, results, fields)=>{
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            res.status(200).json(results)
        })
    }catch(err){
        console.log(err);
        return res.status(500).send();
    }
})

// UPDATE data

app.patch("/update/:email", async (req, res) => {
    const email = req.params.email;
    const newPassword = req.body.newPassword;

    try {
        connection.query("UPDATE user SET password = ? WHERE email = ?", [newPassword, email], (err, results, fields) => {
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            res.status(200).json({ message: "User password updated successfully!"});
        })
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    }
})

// DELETE
app.delete("/delete/:email" , async(req, res) => {
    const email = req.params.email;
    try {
        connection.query("DELETE FROM user WHERE email = ?", [email], (err, results, fields) => {
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            if (results.affectedRows == 0){
                res.status(404).json ({ message: "No user with that email!"});
            }
            return res.status(200).json({message: "User deleted successfully"});
        })
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    }
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
});