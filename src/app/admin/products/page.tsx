import AdminProductsList from "@/components/admin-page/products-list";
import { prisma } from "@/lib/prisma";

const AdminProductsPage = async () => {
	const products = await prisma.product.findMany();

	return (
		<div>
			<AdminProductsList products={products} />
		</div>
	);
};

export default AdminProductsPage;
