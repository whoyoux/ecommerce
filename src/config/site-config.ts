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

export const CATEGORIES = [
	{
		name: "Clothes",
		slug: "/clothes",
		image: "https://i.imgur.com/QkIa5tT.jpeg",
	},
	{
		name: "Electronics",
		slug: "/electronics",
		image: "https://i.imgur.com/ZANVnHE.jpeg",
	},
	{
		name: "Furniture",
		slug: "/furniture",
		image: "https://i.imgur.com/Qphac99.jpeg",
	},
	{
		name: "Shoes",
		slug: "/shoes",
		image: "https://i.imgur.com/qNOjJje.jpeg",
	},
	{
		name: "Miscellaneous",
		slug: "/miscellaneous",
		image: "https://i.imgur.com/BG8J0Fj.jpg",
	},
];

export const MAX_QUANTITY_PER_PRODUCTS = 10;

export const TIME_FOR_TOKEN_EXPIRATION = 24 * 60 * 60 * 1000; //24 hours

export const SHIPPING_OPTIONS = [
	{
		id: "standard",
		label: "Standard",
		description: "3-5 business days",
		price: 20,
		stripePriceId: "shr_1OlckrDta6b82wBGCCTQBSZO",
	},
	{
		id: "fast",
		label: "Fast",
		description: "1-3 business days",
		price: 30,
		stripePriceId: "shr_1OlclPDta6b82wBGtr7XLBmb",
	},
];
