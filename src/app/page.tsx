import Hero from "@/components/hero";
import ProductCard from "@/components/product/product-card";

export default function Home() {
	return (
		<main className="mx-auto max-w-screen-lg flex flex-col gap-8 pt-10">
			<Hero />
			<DealsOfTheDay />
			<FeaturedProducts />
		</main>
	);
}

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

const FeaturedProducts = () => {
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
