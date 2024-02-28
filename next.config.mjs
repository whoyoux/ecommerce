/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "i.imgur.com",
				port: "",
			},
		],
	},
	// experimental: {
	// 	ppr: true,
	// },
};

export default nextConfig;
