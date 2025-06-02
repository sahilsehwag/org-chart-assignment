import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { runServer } from "./server";

import OrgChart from "./components/OrgChart";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

export default function App() {
	useEffect(() => {
		runServer();
	}, []);

	return (
		<QueryClientProvider client={queryClient}>
			<Toaster position="top-center" richColors />
			<OrgChart />
		</QueryClientProvider>
	);
}
