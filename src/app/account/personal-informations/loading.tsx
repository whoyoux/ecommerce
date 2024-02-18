import { Skeleton } from "@/components/ui/skeleton";

const LoadingPersonalInformations = () => {
	return (
		<div className="flex flex-col gap-6">
			<h1 className="text-2xl font-bold">Personal Informations</h1>
			{Array.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10).map((i) => (
				<Skeleton key={i} className="w-full h-8" />
			))}
		</div>
	);
};

export default LoadingPersonalInformations;
