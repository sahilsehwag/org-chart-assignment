import { useReactFlow } from "@xyflow/react";
import { AlignJustify } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { NODE_HEIGHT, NODE_WIDTH } from "../constants";
import type { EmployeeFilters } from "../hooks/useEmployeeFilters";
import { useEmployees } from "../hooks/useEmployees";
import SearchResults from "./SearchResults";
import TeamSelect from "./TeamSelect";
import type { Employee } from "~/types";

type EmployeesSidebarProps = {
	filters: EmployeeFilters;
	setSearch: (search: string) => void;
	setTeam: (team: string) => void;
	resetFilters: () => void;
};

export default function EmployeesSidebar({
	filters,
	setSearch,
	setTeam,
	resetFilters,
}: EmployeesSidebarProps) {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	const { isLoading, teams, searchResults } = useEmployees({ filters });

	const { getNode, setCenter } = useReactFlow();

	const handleClick = (id: Employee["id"]) => {
		const node = getNode(id);
		if (node) {
			setCenter(
				node.position.x + NODE_WIDTH / 2,
				node.position.y + NODE_HEIGHT / 2,
				{
					zoom: 0.75,
					duration: 500,
				}
			);
		}
	};

	return (
		<div>
			<Button
				className={`p-1 rounded-md hover:bg-gray-100 absolute top-3 left-3 w-10 h-10 cursor-pointer z-10 transition-all duration-300 ${
					isSidebarOpen ? "translate-x-[407px] rotate-0" : "rotate-180"
				}`}
				variant="ghost"
				onClick={() => {
					setIsSidebarOpen(!isSidebarOpen);
				}}
			>
				<AlignJustify className="w-4 h-4" />
			</Button>
			<div
				className={`min-w-[400px] p-4 pb-0 flex flex-col border-b md:border-b-0 md:border-r shadow-lg min-h-screen max-h-screen gap-2 absolute top-0 left-0 z-10 transition-all duration-300 bg-white ${
					isSidebarOpen ? "" : "-translate-x-full"
				}`}
			>
				<Input
					placeholder="Search..."
					value={filters.search}
					onChange={(e) => setSearch(e.target.value)}
					className="p-4"
				/>
				<TeamSelect filters={filters} onChange={setTeam} teams={teams} />
				<Button onClick={resetFilters} className="text-sm text-gray-500">
					Clear Filters
				</Button>
				<SearchResults
					results={searchResults}
					isLoading={isLoading}
					onClick={handleClick}
				/>
			</div>
		</div>
	);
}
