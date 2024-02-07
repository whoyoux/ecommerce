import DealsOfTheDay from "@/components/home-page/deals-of-the-day";
import Featured from "@/components/home-page/featured";
import Hero from "@/components/home-page/hero";

import prisma from "@/lib/prisma";

export default async function Home() {
	const products = await prisma.product.findMany({
		take: 10,
	});
	return (
		<div className="flex flex-col gap-8 pt-10 mx-auto max-w-screen-lg">
			<Hero />
			<DealsOfTheDay products={products} />
			<Featured products={products} />
		</div>
	);
}
