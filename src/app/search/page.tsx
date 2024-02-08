import FilterBy from "@/components/search-page/filter-by";
import ProductsList from "@/components/search-page/products-list";
import Ratings from "@/components/search-page/ratings";
import SearchForm from "@/components/search-page/search-form";

//AVAIALBLE QUERY STATES!
// query -> string
// category -> electronics | clothes | furniture | shoes | miscellaneous | sale
// rating -> 0 | 1 | 2 | 3 | 4 | 5 (DB query is checking in number is in range(0,5) )
// min_price -> string -> number
// max_price -> string -> number

import prisma from "@/lib/prisma";

export type SeachParams = {
	query: string | string[] | undefined;
	category: string | string[] | undefined;
	rating: string | string[] | undefined;
	min_price: string | string[] | undefined;
	max_price: string | string[] | undefined;
};

const SearchPage = async ({ searchParams }: { searchParams: SeachParams }) => {
	const category = (searchParams.category || "") as string;
	const query = (searchParams.query || "") as string;
	const rating = (searchParams.rating || "") as string;
	const minPrice = (searchParams.min_price || "") as string;
	const maxPrice = (searchParams.max_price || "") as string;

	const products = await prisma.product.findMany({
		where: {
			AND: [
				{
					label: {
						contains: searchParams.query ? query : undefined,
						mode: "insensitive",
					},
					rating: {
						gte: searchParams.rating
							? Math.max(Math.min(parseInt(rating), 5), 0)
							: 0,
					},
					price: {
						gte: minPrice ? parseInt(minPrice) : undefined,
						lte: maxPrice ? parseInt(maxPrice) : undefined,
					},
				},
				{
					category: {
						name: {
							contains: searchParams.category ? category : undefined,
							mode: "insensitive",
						},
					},
				},
			],
		},
	});
	return (
		<div className="max-w-screen-2xl mx-auto pt-10 gap-4 flex flex-col md:flex-row">
			<div className="flex flex-col w-full md:w-1/4 xl:w-1/5 gap-4">
				<FilterBy searchParams={searchParams} />
				<Ratings searchParams={searchParams} />
			</div>
			<div className="flex-1">
				<h4 className="font-bold text-4xl leading-tight mb-4">Search</h4>
				<SearchForm />
				<ProductsList products={products} className="mt-10" />
			</div>
		</div>
	);
};

export default SearchPage;
