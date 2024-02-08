import { SeachParams } from "@/app/search/page";
import { buttonVariants } from "@/components/ui/button";
import { CATEGORIES } from "@/config/site-config";
import { GetURLWithStates } from "@/lib/utils";
import Link from "next/link";

const FilterBy = ({ searchParams }: { searchParams: SeachParams }) => {
	const query = (searchParams.query || "") as string;
	const rating = (searchParams.rating || "") as string;
	const category = (searchParams.category || "") as string;
	const minPrice = (searchParams.min_price || "") as string;
	const maxPrice = (searchParams.max_price || "") as string;

	const setCategory = (newCategory: string) => {
		return GetURLWithStates({
			query,
			category: newCategory,
			rating,
			minPrice,
			maxPrice,
		});
	};

	// string because we are using URLSearchParams
	const setPriceRange = (min: string, max: string) => {
		return GetURLWithStates({
			query,
			category,
			rating,
			minPrice: min,
			maxPrice: max,
		});
	};

	return (
		<div className="flex flex-col gap-4">
			<h4 className="font-bold text-2xl">Filter by</h4>
			<div className="flex flex-wrap gap-2">
				<Link
					href={setPriceRange("", "")}
					className={buttonVariants({ variant: "outline" })}
				>
					All
				</Link>
				<Link
					href={setPriceRange("0", "50")}
					className={buttonVariants({ variant: "outline" })}
				>
					$0 - $50
				</Link>
				<Link
					href={setPriceRange("50", "100")}
					className={buttonVariants({ variant: "outline" })}
				>
					$50 - $100
				</Link>
				<Link
					href={setPriceRange("200", "")}
					className={buttonVariants({ variant: "outline" })}
				>
					Over $200
				</Link>
			</div>
			<div className="flex flex-wrap gap-2">
				<Link
					href={setCategory("")}
					className={buttonVariants({ variant: "outline" })}
				>
					All
				</Link>
				{CATEGORIES.map((category) => (
					<Link
						href={setCategory(category.name)}
						className={buttonVariants({ variant: "outline" })}
						key={`filter-by-${category.name}`}
					>
						{category.name}
					</Link>
				))}
			</div>
		</div>
	);
};

export default FilterBy;
