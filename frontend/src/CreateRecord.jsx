/* global process */
import { useState } from "react";
import PropTypes from "prop-types";
import "./CreateRecord.css";

const POST_API_URL = process.env.HOSTNAME + ":" + process.env.BACKEND_PORT + "/record/";

export default function CreateRecord({ onRecordAdded }) {
	const [error, setError] = useState(null);
	const [recordId, setRecordId] = useState("");
	const [recordText, setRecordText] = useState("");

	const placeholderId = Math.round(Math.random() * 100);

	const handleSubmit = ev => {
		ev.preventDefault();
		const id = recordId || placeholderId || "";
		const item = recordText;
		(async ()=>{
			const postOpts = {
				method: "POST",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify({item})
			};
			const resp = await fetch(POST_API_URL + id, postOpts);
			if(!resp.ok){
				return setError(await resp.text());
			}
			onRecordAdded(await resp.json());
			// resetting the form
			setRecordId("");
			setRecordText("");
			setError("");
		})();
	};

	return (
		<>
			<form className="new-record-form" action="#" onSubmit={handleSubmit}>
				<label>
					Unique ID:
					<input type="text" name="id" placeholder={placeholderId} value={recordId} onChange={ev => setRecordId(ev.target.value)} />
				</label>
				<label>
					Record Text:
					<input 
						type="text" 
						name="item" 
						placeholder="Type something here..." 
						required 
						value={recordText} 
						onChange={ev => setRecordText(ev.target.value)} 
					/>
				</label>
				<input type="submit" value="Save New Record" />
			</form>
			{error &&
				<div className="error-container">
					{error}
				</div>
			}
		</>
	);
}

CreateRecord.propTypes = {
	onRecordAdded: PropTypes.func.isRequired
};