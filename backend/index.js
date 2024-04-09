import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";

import  {promises as fsp} from "fs";

const __dirname = import.meta.dirname;
dotenv.config({path: path.join(__dirname, "..", ".env")});
const app = express();

// express basic setup
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// not using a real database - since it's a trivial example for other purposes
const DB_FILE = path.join(__dirname, "db.tsv");
const recordList = (await fsp.readFile(DB_FILE, "utf-8"))
	.trim() // just in case we have a trailing newline
	.split("\n")
	.map(s=>s.split("\t"));

// a convenience function to make new records out of data
const dbProps = recordList.shift(); // 1st line is a header - use it to name properties in created records
function record2obj(rec){
	if(Array.isArray(rec)){
		return Object.fromEntries(dbProps.map((prop, i)=>[prop, rec[i]]));
	}
	// presuming it's an object -- just validating it (selecting only props we already have as the 1st line of db.tsv)
	return Object.fromEntries(dbProps.map(prop=>[prop, rec[prop]]));
}
function obj2record(obj){
	return dbProps.map(prop=>obj[prop] || "").join("\t");
}

// other lines are data (tab-separated records)
var db = recordList.map(record2obj);

// convenience function to dump/save all data
async function dumpData(){
	const header = dbProps.join("\t");
	const body = db.map(obj2record);
	return await fsp.writeFile(DB_FILE, [header, ...body].join("\n"), "utf-8");
}

// handling CORS
app.use(cors({origin: process.env.HOSTNAME + ":" + process.env.FRONTEND_PORT, optionsSuccessStatus: 200}));
app.options("*", cors());

// setting up express routes
app.get("/records", (req, res)=>{
	console.log("SENDING ALL records");
	res.json(db);
});

// getting one record
// NOTE: we don't use this endpoint yet
app.get("/record/:id?", (req, res)=>{
	res.json(db.filter(x=>x.id === req.params.id)); 
});

// deleting a record
app.delete("/record/:id?", async (req, res)=>{
	const newDb = db.filter(x=>x.id !== req.params.id);
	if(newDb.length === db.length){
		return res.status(404).end();
	}
	db = newDb;
	await dumpData();
	res.end("Ok");
});

// app.options("/record/:id?", cors());

// saving a record
app.post("/record/:id?", async (req, res)=>{
	if(!req.params.id){
		return res.status(400).end("Record Id is missing.");
	}
	if(db.findIndex(x=>x.id === req.params.id) > -1){
		return res.status(400).end("Record with Id already exists");
	}
	const record = {
		id: req.params.id,
		date: (new Date()).toUTCString(),
		item: req.body.item.toString()
	};
	db.push(record2obj(record));
	await dumpData();
	res.json(record);
});


// 404 and 500 handling
app.use((req, res, next)=>{
	console.log(req.originalUrl, "was Not found");
	res.status(404).end("Whatever you were looking for - it isn't here.");
});

app.use((err, req, res, next)=>{
	console.error(err, err.stack);
	res.status(500).send("Achtung! An error: ", err);
});


// starting the server
const server = app.listen(process.env.BACKEND_PORT, ()=>{
	console.log("Express server listening on port", process.env.BACKEND_PORT);
});


// handling graceful shutdown
function quit(eType){
	console.log(`Received ${eType} signal. Expressjs Graceful shutdown.`);
	server.close(()=>{
		console.log("Express server closed.");
		process.exit(0);
	});
}
['SIGINT', 'SIGQUIT', 'SIGTERM'].forEach(eType=>process.on(eType, quit));
