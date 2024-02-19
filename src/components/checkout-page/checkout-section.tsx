const CheckoutSection = ({
	children,
	title,
}: { children: React.ReactNode; title: string }) => {
	return (
		<section className="space-y-4">
			<h2 className="text-xl font-bold">{title}</h2>
			{children}
		</section>
	);
};

export default CheckoutSection;
