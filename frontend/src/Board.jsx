/* global process */
import { useState, useEffect } from "react";
import Record from "./Record.jsx";
import CreateRecord from "./CreateRecord.jsx";
import "./Board.css";

const API_URL = process.env.HOSTNAME + ":" + process.env.BACKEND_PORT + "/records";
const DELETE_API_URL = process.env.HOSTNAME + ":" + process.env.BACKEND_PORT + "/record/";

export default function Board() {
	const [records, setRecords] = useState([]);
	const [error, setError] = useState(null);
	const [ifLoaded, setIfLoaded] = useState(false);

	useEffect(() => {
		(async ()=> {
			const resp = await fetch(API_URL);
			if (!resp.ok) {
				return setError(await resp.text());
			}
			const respAsJson = await resp.json();
			// console.log("USE EFFECT", respAsJson);
			setRecords(respAsJson);
			setIfLoaded(true);
		})();
	}, []);

	if (error) {
		return <div>FAILED TO FETCH RECORDS: {error}</div>;
	}

	function onRecordAdded(record){
		setRecords(records.concat(record));
	}

	function onRecordDeleted(recId){
		(async ()=> {
			const resp = await fetch(DELETE_API_URL + recId, {method: "DELETE"});
			if (!resp.ok) {
				return setError(await resp.text());
			}
			setRecords(records.filter(x=>x.id !== recId));
		})();
		
	}

	return (
		<div data-testid="main-board-test-id" data-loaded={ifLoaded}>
			<CreateRecord onRecordAdded={onRecordAdded}/>
			{ !records.length &&
				<p>
					No records to show yet...
				</p>
			}
			{
				records.map(record => <Record key={record.id} recId={record.id} item={record.item} date={record.date} onDelete={onRecordDeleted} />)
			}
		</div>
	);
}
