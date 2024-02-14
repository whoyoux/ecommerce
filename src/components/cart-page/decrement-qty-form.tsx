import { decrementQtyInCart } from "@/actions/cart";
import DecrementQtyButton from "./decrement-qty-button";

const DecrementQtyForm = ({ productId }: { productId: string }) => {
	const decrement = async () => {
		"use server";
		await decrementQtyInCart(productId);
	};
	return (
		<form action={decrement}>
			<input type="hidden" name="productId" value={productId} />
			<DecrementQtyButton />
		</form>
	);
};

export default DecrementQtyForm;
