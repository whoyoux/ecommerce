import { SeachParams } from "@/app/search/page";
import { Button, buttonVariants } from "@/components/ui/button";
import { GetURLWithStates, cn } from "@/lib/utils";
import Link from "next/link";

const RATING_LEVELS = [
	{
		level: 4,
		label: "4 stars & up",
	},
	{
		level: 3,
		label: "3 stars & up",
	},
	{
		level: 2,
		label: "2 stars & up",
	},
	{
		level: 1,
		label: "1 stars & up",
	},
];

const Ratings = ({ searchParams }: { searchParams: SeachParams }) => {
	const query = (searchParams.query || "") as string;
	const rating = (searchParams.rating || "") as string;
	const category = (searchParams.category || "") as string;
	const minPrice = (searchParams.min_price || "") as string;
	const maxPrice = (searchParams.max_price || "") as string;

	const isRatingSelected = (ratingLevel: string): boolean => {
		if (rating === ratingLevel) return true;

		return false;
	};

	const setRating = (rating: string) => {
		return GetURLWithStates({
			query,
			category,
			rating,
			minPrice,
			maxPrice,
		});
	};

	return (
		<div className="flex flex-col gap-4">
			<h4 className="font-bold text-2xl">Rating</h4>
			{RATING_LEVELS.map((ratingLevel) => (
				<Link
					href={setRating(ratingLevel.level.toString())}
					className={cn(
						buttonVariants({ variant: "outline" }),
						isRatingSelected(ratingLevel.level.toString()) && "border-primary",
					)}
					key={`filter-rating-${ratingLevel.label}`}
				>
					{ratingLevel.label}
				</Link>
			))}
		</div>
	);
};

export default Ratings;
