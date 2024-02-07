import ProductCard from "@/components/product/product-card";

const Featured = () => {
	return (
		<section>
			<h3 className="font-bold text-2xl">Featured Products</h3>
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
				<ProductCard />
				<ProductCard />
				<ProductCard />
				<ProductCard />
			</div>
		</section>
	);
};

export default Featured;
