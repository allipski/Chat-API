import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import joi from "joi";
import dayjs from "dayjs";

dotenv.config();

const app = express();
app.use(express.json());

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

mongoClient.connect(() => {
  db = mongoClient.db("batepapo-uol");
});

// participants

app.post("/participants", async (req, res) => {
  const name = req.body.name;

    const nameSchema = joi.object({
      name: joi.string().required(),
    });

    const validation = nameSchema.validate({ name: name }, { abortEarly: true });
    if (validation.error) {
      return res.sendStatus(422);
    }

  try {
    const repetido = await db
      .collection("participants")
      .findOne({ name: name });
    if (repetido) {
      return res.sendStatus(409);
    } else {
      await db.collection("participants").insertOne({ name: name, lastStatus: Date.now()});
      await db.collection("messages").insertOne({from: name, to: 'Todos', text: 'entra na sala...', type: 'status', time: dayjs().format('DD/MM/YYYY')});
      return res.sendStatus(201);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
  
});

app.get("/participants", async (req, res) => {

	try {
		const participants = await db.collection('participants').find().toArray();
		res.send(participants);
	  } catch (error) {
		console.error(error);
		res.sendStatus(500);
	  }
})

// messages

app.post("/messages", async (req, res) => {
  const { to: to, text: text, type: type } = req.body;
  const { user: user } = req.headers;

    const messageSchema = joi.object({
      to: joi.string().required(),
      text: joi.string().required(),
      type: joi.string().valid("private_message", "message").required(),
    });

    const validation = messageSchema.validate({ to: to, text: text, type: type }, { abortEarly: true });
    if (validation.error) {
      return res.sendStatus(422);
    } else {
      return res.sendStatus(201);
    }

  // try {
  //   const repetido = await db
  //     .collection("participants")
  //     .findOne({ name: name });
  //   if (repetido) {
  //     return res.sendStatus(409);
  //   } else {
  //     await db.collection("participants").insertOne({ name: name, lastStatus: Date.now()});
  //     await db.collection("messages").insertOne({from: name, to: 'Todos', text: 'entra na sala...', type: 'status', time: dayjs().format('DD/MM/YYYY')});
  //     return res.sendStatus(201);
  //   }
  // } catch (error) {
  //   console.error(error);
  //   res.sendStatus(500);
  // }
  
});

app.listen(5000, () => {
  console.log("Server is listening on port 5000.");
});
