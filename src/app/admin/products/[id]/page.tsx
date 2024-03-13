import React from "react";

const AdminProductPage = ({ params }: { params: { id: string } }) => {
	return <div>{params.id}</div>;
};

export default AdminProductPage;
