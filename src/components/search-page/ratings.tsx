import { Button } from "@/components/ui/button";

const Ratings = () => {
	return (
		<div className="flex flex-col gap-4">
			<h4 className="font-bold text-2xl">Rating</h4>
			<Button variant="outline">4 stars & up</Button>
			<Button variant="outline">3 stars & up</Button>
			<Button variant="outline">2 stars & up</Button>
			<Button variant="outline">1 star & up</Button>
		</div>
	);
};

export default Ratings;
