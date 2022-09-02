import express from "express";
import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
import joi from 'joi';

dotenv.config();

const app = express();
app.use(express.json());

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

mongoClient.connect(() => {
  db = mongoClient.db("batepapo-uol");
});

app.post("/participants", async (req, res) => {
	const name = req.body.name;

	const nameSchema = joi.object({
		name: joi.string().required()
	  });

	const validation = nameSchema.validate({ name: name }, { abortEarly: true });
	if (validation.error) {
		res.sendStatus(422);
		return;
	  }

	res.send('Created ' + name);
});

app.listen(5000, () => {
	console.log('Server is listening on port 5000.');
  });