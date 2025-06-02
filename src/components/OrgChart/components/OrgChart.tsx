import { ReactFlowProvider } from "@xyflow/react";

import EmployeesSidebar from "./EmployeesSidebar";
import EmployeeChart from "./EmployeeChart";
import { useEmployeeFilters } from "../hooks/useEmployeeFilters";
import { useEmployees } from "../hooks/useEmployees";

export default function OrgChart() {
	const { filters, setSearch, setTeam, resetFilters } = useEmployeeFilters();

	const { employees, updateManager } = useEmployees({ filters });

	return (
		<ReactFlowProvider>
			<div className="flex flex-col md:flex-row min-h-screen relative">
				<EmployeesSidebar
					filters={filters}
					setSearch={setSearch}
					setTeam={setTeam}
					resetFilters={resetFilters}
				/>
				<EmployeeChart employees={employees} updateManager={updateManager} />
			</div>
		</ReactFlowProvider>
	);
}
