import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type RedirectWithURLStatesProps = {
	search: string;
	category: string;
	rating: string;
};

//NEED TO TEST THIS FUNCTION!
export const RedirectWithURLStates = ({
	search,
	category,
	rating,
}: RedirectWithURLStatesProps): string => {
	if (search === "") {
		if (category === "" && rating === "") return "/search";
		// biome-ignore lint/style/noUselessElse: <explanation>
		else if (category !== "" && rating === "") {
			const encodedSearch = new URLSearchParams({
				category,
			});
			return `/search?${encodedSearch}`;
			// biome-ignore lint/style/noUselessElse: <explanation>
		} else if (category === "" && rating !== "") {
			const encodedSearch = new URLSearchParams({
				rating,
			});
			return `/search?${encodedSearch}`;
			// biome-ignore lint/style/noUselessElse: <explanation>
		} else if (category !== "" && rating !== "") {
			const encodedSearch = new URLSearchParams({
				category,
				rating,
			});
			return `/search?${encodedSearch}`;
		}
	} else {
		if (category === "" && rating === "") {
			const encodedSearch = new URLSearchParams({
				query: search,
			});

			return `/search?${encodedSearch}`;
			// biome-ignore lint/style/noUselessElse: <explanation>
		} else if (category !== "" && rating === "") {
			const encodedSearch = new URLSearchParams({
				query: search,
				category,
			});

			return `/search?${encodedSearch}`;
			// biome-ignore lint/style/noUselessElse: <explanation>
		} else if (category === "" && rating !== "") {
			const encodedSearch = new URLSearchParams({
				query: search,
				rating,
			});

			return `/search?${encodedSearch}`;
			// biome-ignore lint/style/noUselessElse: <explanation>
		} else {
			const encodedSearch = new URLSearchParams({
				query: search,
				category,
				rating,
			});

			return `/search?${encodedSearch}`;
		}
	}
	return "/search";
};
