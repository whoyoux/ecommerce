const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const categoriesJson = require("../data/categories.json");

const productsJson = require("../data/products.json");

async function main() {
	const categories = await prisma.$transaction(
		categoriesJson.map((category) =>
			prisma.category.create({ data: category }),
		),
	);

	const newData = productsJson.map((product) => ({
		label: product.label,
		description: product.description,
		price: product.price,
		images: product.images,
		rating: +(+(Math.random() * 3).toFixed(2) + 2).toFixed(2),
		inStock: Math.round(Math.random() * 100) + 1,

		categoryId:
			categories.find((category) => category.name === product.category.name)
				?.id ?? "NULL",
	}));

	const products = await prisma.product.createMany({
		data: newData,
	});
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
