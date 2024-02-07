import ProductCard from "@/components/product/product-card";

const DealsOfTheDay = () => {
	return (
		<section>
			<h3 className="font-bold text-2xl">Deals of the day</h3>
			<div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
				<ProductCard />
				<ProductCard />
				<ProductCard />
			</div>
		</section>
	);
};

export default DealsOfTheDay;
