import FilterBy from "@/components/search-page/filter-by";
import ProductsList from "@/components/search-page/products-list";
import Ratings from "@/components/search-page/ratings";
import SearchForm from "@/components/search-page/search-form";

//AVAIALBLE QUERY STATES!
// query -> string
// category -> all | electronics | clothes | furniture | shoes | miscellaneous | sale
// rating -> all | 1 | 2 | 3 | 4 | 5

import prisma from "@/lib/prisma";

const SearchPage = async () => {
	const products = await prisma.product.findMany();
	return (
		<div className="max-w-screen-2xl mx-auto pt-10 gap-4 flex flex-col md:flex-row">
			<div className="flex flex-col w-full md:w-1/4 xl:w-1/5 gap-4">
				<FilterBy />
				<Ratings />
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
