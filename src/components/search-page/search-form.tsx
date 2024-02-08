"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GetURLWithStates } from "@/lib/utils";

import { useRouter, useSearchParams } from "next/navigation";

//TODO: Think about convert this component to server side rendering
// idk if this is a good idea, but it's a good idea to think about it

const SearchForm = () => {
	const router = useRouter();

	const searchParams = useSearchParams();
	const searchQuery = searchParams.get("query");

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const query = formData.get("query") as string;
		const category = (searchParams.get("category") || "") as string;
		const rating = (searchParams.get("rating") || "") as string;
		const minPrice = (searchParams.get("min_price") || "") as string;
		const maxPrice = (searchParams.get("max_price") || "") as string;

		if (query === searchQuery) return;

		router.push(
			GetURLWithStates({ query, category, rating, minPrice, maxPrice }),
		);
	};

	return (
		<form className="flex gap-4" onSubmit={handleSubmit}>
			<Input
				placeholder="Search..."
				name="query"
				defaultValue={searchQuery?.toString()}
			/>
			<Button>Search</Button>
		</form>
	);
};

export default SearchForm;
