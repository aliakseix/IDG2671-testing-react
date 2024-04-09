/* global process */
import {describe, expect, it, beforeAll} from "vitest";
import assert from "node:assert";
import {render, screen, waitFor} from "@testing-library/react";
import Board from "../src/Board.jsx";
import Record from "../src/Record.jsx";

import nock from "nock";
import mockData from "./mock.api.data.json";

beforeAll(()=>{
	const apiBaseUrl = process.env.HOSTNAME + ":" + process.env.BACKEND_PORT;
	nock(apiBaseUrl)
		.get("/records")
		.reply(200, [])
		.get("/records")
		.reply(200, mockData);
});

describe("Board", ()=>{
	const waitUntilBoardLoaded = async ()=>{
		return await waitFor(()=>{
			const el = screen.getByTestId("main-board-test-id");
			// console.log("ATTRIBUTE", el.getAttribute("data-loaded") === "true");
			expect(el.getAttribute("data-loaded")).toBe("true");
		});
	};

	it("should show no records if supplied with no records", async ()=>{
		render(<Board/>);
		await waitUntilBoardLoaded();
		const el = screen.getByTestId("main-board-test-id");
		assert(el.textContent.indexOf("No records to show yet") > -1);
	});

	it("should show one records if supplied with one records", async ()=>{
		render(<Board/>);
		await waitUntilBoardLoaded();
		const el = screen.getByTestId("main-board-test-id");
		assert(el.textContent.indexOf("No records to show yet") === -1);
		assert.strictEqual(el.querySelectorAll("p.record").length, 1);
	});
});

describe("Record", ()=>{
	it("should render date in UTC even for timestamp data", ()=>{
		const timestamp = "1712640790894";
		const answer = 'Tue, 09 Apr 2024 05:33:10 GMT';
		render(<Record recId="id6" item="hello kitty" date={timestamp} onDelete={()=>{}}></Record>);
		const el = screen.getByText("hello kitty");
		const timeElText =  el.parentElement.querySelector("i").textContent;
		assert.strictEqual(answer, timeElText);
	});
});