import { Button } from "@/components/ui/button";

const FilterBy = () => {
	return (
		<div className="flex flex-col gap-4">
			<h4 className="font-bold text-2xl">Filter by</h4>
			<div className="flex flex-wrap gap-2">
				<Button variant="outline">All</Button>
				<Button variant="outline">$0 - $50</Button>
				<Button variant="outline">$50 - $100</Button>
				<Button variant="outline">$100 - $200</Button>
				<Button variant="outline">Over $200</Button>
			</div>
			<div className="flex flex-wrap gap-2">
				<Button variant="outline">All</Button>
				<Button variant="outline">Linen & Silk</Button>
				<Button variant="outline">Cotton</Button>
				<Button variant="outline">Wool</Button>
				<Button variant="outline">Cashmere</Button>
				<Button variant="outline">Leather</Button>
			</div>
		</div>
	);
};

export default FilterBy;
