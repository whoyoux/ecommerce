import ProductCard from "@/components/product/product-card";
import { Product } from "@prisma/client";

type DealsOfTheDayProps = {
	products: Product[];
};

const DealsOfTheDay = ({ products }: DealsOfTheDayProps) => {
	const onlyThreeProducts = products.slice(0, 3);

	return (
		<section>
			<h3 className="font-bold text-2xl">Deals of the day</h3>
			<div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
				{onlyThreeProducts.map((product) => (
					<ProductCard key={`deals-${product.id}`} {...product} />
				))}
			</div>
		</section>
	);
};

export default DealsOfTheDay;
