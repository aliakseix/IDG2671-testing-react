import PropTypes from "prop-types";
import "./Record.css";

export default function Record({recId, item, date, onDelete}){
	const dateAsNumber = Number(date);
	date = isNaN(dateAsNumber)?date:dateAsNumber;
	date = (new Date(date)).toUTCString();
	return(
		<p className="record">
			<b className="record-piece">{recId}</b>
			<span className="record-piece">{item}</span>
			<i className="record-piece">{date}</i>
			<span className="record-piece">
				<input type="button" name={"delete-btn-" + recId} value="X" onClick={()=>onDelete(recId)} />
			</span>
		</p>
	);
}

Record.propTypes = {
	recId: PropTypes.string.isRequired,
	item: PropTypes.string.isRequired,
	date: PropTypes.string.isRequired,
	onDelete: PropTypes.func.isRequired
};
