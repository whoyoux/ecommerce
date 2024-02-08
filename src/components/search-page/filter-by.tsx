import { SeachParams } from "@/app/search/page";
import { buttonVariants } from "@/components/ui/button";
import { CATEGORIES } from "@/config/site-config";
import { GetURLWithStates, cn } from "@/lib/utils";
import Link from "next/link";

const PRICE_RANGES = [
	{
		min: "",
		max: "",
		label: "All",
	},
	{
		min: "0",
		max: "50",
		label: "$0 - $50",
	},
	{
		min: "50",
		max: "100",
		label: "$50 - $100",
	},
	{
		min: "200",
		max: "",
		label: "Over $200",
	},
];

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

	const isPriceSelected = (
		_minPrice: string,
		_maxPrice: string,
		_label: string,
	): boolean => {
		// if (minPrice === _minPrice && maxPrice === _maxPrice) return true;
		let flag = false;
		if (minPrice !== "" && minPrice === _minPrice) {
			flag = true;
		}

		if (maxPrice !== "" && maxPrice === _maxPrice) {
			flag = true;
		}

		if (minPrice === "" && maxPrice === "" && _label === "All") {
			flag = true;
		}

		return flag;
	};

	const isCategorySelected = (categoryLabel: string): boolean => {
		if (categoryLabel === "All" && category === "") {
			return true;
		}

		if (category.toLocaleLowerCase() === categoryLabel.toLocaleLowerCase())
			return true;
		return false;
	};

	return (
		<div className="flex flex-col gap-4">
			<h4 className="font-bold text-2xl">Filter by</h4>
			<div className="flex flex-wrap gap-2">
				{PRICE_RANGES.map((priceRange) => (
					<Link
						href={setPriceRange(priceRange.min, priceRange.max)}
						className={cn(
							buttonVariants({ variant: "outline" }),
							isPriceSelected(priceRange.min, priceRange.max, priceRange.label)
								? "border-primary"
								: "",
						)}
						key={`filter-price-${priceRange.label}`}
					>
						{priceRange.label}
					</Link>
				))}
			</div>
			<div className="flex flex-wrap gap-2">
				<Link
					href={setCategory("")}
					className={cn(
						buttonVariants({ variant: "outline" }),
						isCategorySelected("All") && "border-primary",
					)}
				>
					All
				</Link>
				{CATEGORIES.map((category) => (
					<Link
						href={setCategory(category.name)}
						className={cn(
							buttonVariants({ variant: "outline" }),
							isCategorySelected(category.name) && "border-primary",
						)}
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
