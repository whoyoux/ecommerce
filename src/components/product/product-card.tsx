import Image from "next/image";

import itemImage from "@/assets/images/item2.jpg";
import Link from "next/link";

const ProductCard = () => {
	return (
		<div className="flex flex-col">
			<Link href="/">
				<div className="bg-neutral-100 aspect-square relative overflow-hidden rounded-lg cursor-pointer">
					<Image
						src={itemImage}
						alt="Product image"
						fill
						className="rounded-lg object-cover hover:scale-110 duration-200"
						sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
					/>
				</div>
			</Link>
			<h4 className="mt-2 font-medium text-base">The Perfect Tee</h4>
			<h5 className="text-[#9C784A]">$25.99</h5>
		</div>
	);
};

export default ProductCard;
