"use client";

import { useEffect, useState } from "react";

import PromptCard from "./PromptCard";

const PromptCardList = ({ data }) => {
	return (
		<div className="mt-16 prompt_layout">
			{data.map((post) => (
				<PromptCard key={post._id} post={post} />
			))}
		</div>
	);
};

const Feed = () => {
	const [searchText, setSearchText] = useState("");
	const [searchedResult, setSearchedResult] = useState([]);
	const [posts, setPosts] = useState([]);
	const [searchTimeOut, setSearchTimeOut] = useState(null);

	useEffect(() => {
		const fetchPosts = async () => {
			const response = await fetch("/api/prompt");
			const data = await response.json();

			setPosts(data);
		};

		fetchPosts();
	}, []);

	const filterPrompts = () => {
		const regex = new RegExp(searchText, "i");
		return posts.filter(
			(item) =>
				regex.test(item.creator.username) ||
				regex.test(item.tag) ||
				regex.test(item.prompt)
		);
	};

	const handleSearchChange = (e) => {
		clearTimeout(searchTimeOut);
		setSearchText(e.target.value);

		setSearchTimeOut(
			setTimeout(() => {
				const searchResult = filterPrompts(e.target.value);
				setSearchedResult(searchResult);
			}, 500)
		);
	};

	return (
		<section className="feed">
			<form className="relative w-full flex-center">
				<input
					type="text"
					placeholder="Search for a tag or username"
					value={searchText}
					onChange={handleSearchChange}
					required
					className="search_input peer"
				/>
			</form>
			{searchText ? (
				<PromptCardList data={searchedResult} />
			) : (
				<PromptCardList data={posts} />
			)}
		</section>
	);
};

export default Feed;
