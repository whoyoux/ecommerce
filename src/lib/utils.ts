import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type RedirectWithURLStatesProps = {
	query: string;
	category: string;
	rating: string;
	minPrice: string;
	maxPrice: string;
};

export const GetURLWithStates = ({
	query,
	category,
	rating,
	minPrice,
	maxPrice,
}: RedirectWithURLStatesProps): string => {
	const params = new URLSearchParams();

	if (query.trim() !== "") {
		params.append("query", query.trim());
	}

	if (category.trim() !== "") {
		params.append("category", category.trim());
	}

	if (rating.trim() !== "") {
		params.append("rating", rating.trim());
	}

	if (minPrice.trim() !== "") {
		params.append("min_price", minPrice.trim());
	}

	if (maxPrice.trim() !== "") {
		params.append("max_price", maxPrice.trim());
	}

	return `/search?${params.toString()}`;
};
