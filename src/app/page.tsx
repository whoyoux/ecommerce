import DealsOfTheDay from "@/components/home-page/deals-of-the-day";
import Featured from "@/components/home-page/featured";
import Hero from "@/components/home-page/hero";

export default async function Home() {
	return (
		<main className="flex flex-col gap-8 pt-10 mx-auto max-w-screen-lg">
			<Hero />
			<DealsOfTheDay />
			<Featured />
		</main>
	);
}
