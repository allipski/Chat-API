import express from "express";
import { MongoClient } from "mongodb";

const app = express();
app.use(express.json());

// conectando ao banco
const mongoClient = new MongoClient("mongodb://localhost:27017");
let db;

mongoClient.connect().then(() => {
	db = mongoClient.db("meu_banco_de_dados");
});

app.get("/usuarios", (req, res) => {
	// buscando usuários
	db.collection("users").find().toArray().then(users => {
		console.log(users); // array de usuários
	});
});

app.post("/usuarios", (req, res) => {
	// inserindo usuário
	db.collection("users").insertOne({
		email: "joao@email.com",
		password: "minha_super_senha"
	});
});

app.listen(5000);