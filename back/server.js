import dotenv from "dotenv";
import express from 'express';
import cors from 'cors';
import session from "express-session";
import {writeFile,readFile} from "fs/promises"
import cookieParser from "cookie-parser"
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";


const app = express();
const SECRET = process.env.SECRET;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(cors({
    origin: "http://localhost:63342",
    credentials: true
}));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60
    }
}));
dotenv.config();
function auth(req, res, next) {
    const token = req.cookies.token
    if (!token) return res.status(401).json({ message: "No token" })
    try {
        req.user = jwt.verify(token, SECRET)
        next()
    } catch {
        res.status(403).json({ message: "Invalid token" })
    }
}


app.get("/users",auth, async (req, res) => {
    try {
        if(req.user.isAdmin){
            let data = await readFile("./users.json", "utf8");
            data = JSON.parse(data);
            res.json(data);
        }else{
            res.status(403).json({ message: "No token is in use" })
        }

    }catch(err) {
        console.log(err);
    }
})

app.post("/register", async (req, res) => {
    try {
        const {name, email, password,role} = req.body;
        console.log(role)
        const hashedPassword = await bcrypt.hash(password, 10);
        let data = await readFile("./users.json", "utf8");
        data = JSON.parse(data)
        const exists = data.find(u => u.email === email);
        if (exists) {
            return res.status(409).json("user already exists");
        }
        if(name && email && password) {
            const user = {
                id: Date.now(),
                name,
                email,
                password: hashedPassword,
                isAdmin: role,
            }
            data.push(user);
            await writeFile("./users.json", JSON.stringify(data), "utf8");
            res.json("successfully registered");
        }
    }catch(err){
        res.status(500).json(err);
    }
})

app.post("/login", async (req, res) => {
    try{
    const {email, password} = req.body;
    let data = await readFile("./users.json", "utf8");
    data = JSON.parse(data);
    let user = data.find(u => u.email === email);
        if (!user) {
        return res.status(404).json("user not found");
    }
    const check = await bcrypt.compare(password, user.password);
    if (!check) {
      return res.status(401).json("password is incorrect");
    }
        const token  = jwt.sign( {
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        },
        SECRET,
            { expiresIn: "1h" }
        )

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000
        })


    res.json("successfully logged in");
    }catch(err){
        res.status(500).json(err);
    }
})

app.get("/profile",auth,  (req, res) => {
    res.json({
        message: "You are logged in",
        user: req.user
    })
})

app.get("/logout",auth,  (req, res) => {
    res.clearCookie("token")
    res.json({
        message: "Logged out"
    })
})


app.post("/edit", async (req, res) => {
    try {
        const { id, name, email } = req.body
        const userId = Number(id)

        let data = JSON.parse(await readFile("./users.json", "utf8"))

        const user = data.find(u => u.id === userId)
        if (!user) return res.status(404).json({ message: "User not found" })

        if (name) user.name = name
        if (email) user.email = email

        await writeFile("./users.json", JSON.stringify(data, null, 2))
        res.json({ message: "Updated", user })
    } catch (err) {
        res.status(500).json({ message: "Server error", err: String(err) })
    }
})

app.post("/cpassword", auth, async (req, res) => {
    try {
        const { password, newPassword } = req.body
        const userId = req.user.id

        if (!password || !newPassword) {
            return res.status(400).json({ message: "All fields required" })
        }

        let data = JSON.parse(await readFile("./users.json", "utf8"))

        const user = data.find(u => u.id === userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: "Current password incorrect" })
        }

        const hashed = await bcrypt.hash(newPassword, 10)
        user.password = hashed

        await writeFile("./users.json", JSON.stringify(data, null, 2))

        res.json({ message: "Password changed successfully" })

    } catch (err) {
        res.status(500).json({ message: "Server error", err: String(err) })
    }
})


app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
})