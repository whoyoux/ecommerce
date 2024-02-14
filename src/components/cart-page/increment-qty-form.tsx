import { incrementQtyInCart } from "@/actions/cart";
import IncrementQtyButton from "./increment-qty-button";

const IncrementQtyForm = ({ productId }: { productId: string }) => {
	const increment = async () => {
		"use server";
		await incrementQtyInCart(productId);
	};

	return (
		<form action={increment}>
			<input type="hidden" name="productId" value={productId} />
			<IncrementQtyButton />
		</form>
	);
};

export default IncrementQtyForm;
