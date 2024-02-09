"use client";
import Image from "next/image";
import { useState } from "react";

const ProductImages = ({ images }: { images: string[] }) => {
	const [selectedImage, setSelectedImage] = useState(0);
	return (
		<div className="flex flex-col max-w-[400px] gap-4">
			<div className="w-full relative aspect-square">
				<Image
					src={images[selectedImage]}
					alt="Product photo"
					fill
					className="rounded-lg"
				/>
			</div>
			<div className="flex items-center justify-between">
				{images.map((imageUrl, idx) => (
					<div key={imageUrl} className="relative overflow-hidden rounded-lg">
						<Image
							src={imageUrl}
							alt="Product image"
							width={100}
							height={100}
							className="rounded-lg cursor-pointer object-cover hover:scale-125 duration-200"
							onClick={() => setSelectedImage(idx)}
						/>
					</div>
				))}
			</div>
		</div>
	);
};

export default ProductImages;
