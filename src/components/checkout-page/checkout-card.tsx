const CheckoutCard = ({
	icon,
	firstLine,
	secondLine,
}: { icon: React.ReactNode; firstLine: string; secondLine: string }) => {
	return (
		<div className="flex gap-4 items-center">
			<div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center aspect-square">
				{icon}
			</div>
			<div className="flex flex-col items-start justify-center">
				<h3 className="font-semibold">{firstLine}</h3>
				<h4 className="text-sm text-muted-foreground">{secondLine}</h4>
			</div>
		</div>
	);
};

export default CheckoutCard;
