import { SeachParams } from "@/app/search/page";
import { Button, buttonVariants } from "@/components/ui/button";
import { GetURLWithStates, cn } from "@/lib/utils";
import Link from "next/link";

const Ratings = ({ searchParams }: { searchParams: SeachParams }) => {
	const query = (searchParams.query || "") as string;
	const category = (searchParams.category || "") as string;
	const minPrice = (searchParams.min_price || "") as string;
	const maxPrice = (searchParams.max_price || "") as string;

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
			<Link
				href={setRating("4")}
				className={cn(buttonVariants({ variant: "outline" }))}
			>
				4 stars & up
			</Link>
			<Link
				href={setRating("3")}
				className={cn(buttonVariants({ variant: "outline" }))}
			>
				3 stars & up
			</Link>
			<Link
				href={setRating("2")}
				className={cn(buttonVariants({ variant: "outline" }))}
			>
				2 stars & up
			</Link>
			<Link
				href={setRating("1")}
				className={cn(buttonVariants({ variant: "outline" }))}
			>
				1 stars & up
			</Link>
		</div>
	);
};

export default Ratings;
