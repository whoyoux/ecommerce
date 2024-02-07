export const siteConfig = {
	name: "Fresh & Clean Ecommerce Store",
	description:
		"Our ecommerce store is your ultimate destination for all your shopping needs. Whether you're looking for trendy clothing, cutting-edge electronics, stylish furniture, or fashionable shoes, we've got you covered. With a wide range of products to choose from and unbeatable prices, shopping with us is a breeze. Explore our curated selection today and experience the convenience of online shopping at its best.",
	keywords: [
		"Online shopping",
		"Trendy clothing",
		"Fashionable electronics",
		"Stylish furniture",
		"Fashionable shoes",
		"Affordable prices",
		"Wide selection",
		"Convenient shopping",
		"Curated collection",
		"Best deals",
	],
	url:
		process.env.NODE_ENV === "development"
			? "http://localhost:3000"
			: "https://ecommerce-whx.vercel.app",
	ogImage: "",
	authors: [
		{
			name: "whoyoux",
			url: "https://github.com/whoyoux",
		},
	],
	creator: "whoyoux",
};
