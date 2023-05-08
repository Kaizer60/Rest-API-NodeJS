const express = require('express')
const mysql = require('mysql')

const app = express();

//แปลง json obj เป็น javascript obj 
app.use(express.json())

//MySQL Connection
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mysql_nodejs'
})

con.connect((err) => {
    if(err){
        console.log('Error connecting to MySQL database = ', err)
        return
    }
    else{
        console.log('MySQL successfully connected!')
    }
})

//Create
app.post("/create", async (req, res) => {
    const{email,name, password} = req.body

    try{
        con.query(
            "INSERT INTO users(email, fullname, password) VALUES(?,?,?)",
            [email, name, password],
            (err, results, fields) => {
                if(err){
                    console.log("Error while inserting a user into the database", err)
                    return res.status(400).send();
                }
                return res.status(201).json({mesasage: "New user successfully created!"})
            }
        )
    }catch(err){
        console.log(err)
        return res.status(500).send();
    }
})

//Read
app.get("/read", async (req, res) => {
    try{
        con.query(
            "SELECT * FROM users",
            (err, results, fields) => {
                if(err){
                    console.log("Error while inserting a user into the database", err)
                    return res.status(400).send();
                }
                return res.status(200).json(results)
            }
        )
    }catch(err){
        console.log(err)
        return res.status(500).send();
    }
})

//Read single users
app.get("/read/single/:email", async (req, res) => {
    const email = req.params.email

    try{
        con.query(
            "SELECT * FROM users WHERE email = ?",
            [email],
            (err, results, fields) => {
                if(err){
                    console.log("Error while inserting a user into the database", err)
                    return res.status(400).send();
                }
                return res.status(200).json(results)
            }
        )
    }catch(err){
        console.log(err)
        return res.status(500).send();
    }
})

//Update
app.patch("/update/:id", async (req, res) => {
    const id = req.params.id
    const newPassword = req.body.newPassword

    try{
        con.query(
            "UPDATE users SET password = ? WHERE id = ?",
            [newPassword, id],
            (err, results, fields) => {
                console.log("test results" ,results)
                console.log("test err" ,err)
                if(err){
                    console.log("Error while inserting a user into the database", err)
                    return res.status(400).send();
                }
                return res.status(200).json({mesasage: "User password updated successfully!"})
            }
        )
    }catch(err){
        console.log(err)
        return res.status(500).send();
    }
})

//Delete
app.delete("/delete/:id", async (req, res) => {
    const id = req.params.id

    try{
        con.query(
            "DELETE FROM users WHERE id = ?",
            [id],
            (err, results, fields) => {
                if(err){
                    console.log("Error while inserting a user into the database", err)
                    return res.status(400).send();
                }
                //เช็คว่ามีการลบข้อมูลจริงหรือไม่
                //กรณีที่ไม่มีข้ออมูลที่ต้องการลบ
                if(results.affectedRows === 0){
                    return res.status(404).json({mesasage: "No user with that id!"})
                }
                //กรณีทำการลบสำเร็จ
                return res.status(200).json({mesasage: "User deleted successfully!"})
            }
        )
    }catch(err){
        console.log(err)
        return res.status(500).send();
    }

    // app.delete("/delete", async (req, res) => {
    //     const id = req.query.id
    
    //     try{
    //         con.query(
    //             "DELETE FROM users WHERE id = ?",
    //             [id],
    //             (err, results, fields) => {
    //                 if(err){
    //                     console.log("Error while inserting a user into the database", err)
    //                     return res.status(400).send();
    //                 }
    //                 //เช็คว่ามีการลบข้อมูลจริงหรือไม่
    //                 //กรณีที่ไม่มีข้ออมูลที่ต้องการลบ
    //                 if(results.affectedRows === 0){
    //                     return res.status(404).json({mesasage: "No user with that id!"})
    //                 }
    //                 //กรณีทำการลบสำเร็จ
    //                 return res.status(200).json({mesasage: "User deleted successfully!"})
    //             }
    //         )
    //     }catch(err){
    //         console.log(err)
    //         return res.status(500).send();
    //     }
})

app.listen(3000, () => console.log('Server is running on port 3000'));