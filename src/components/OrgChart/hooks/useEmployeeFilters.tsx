import { useState } from "react";

export type EmployeeFilters = {
	search: string;
	team: string;
};

const initialFilters: EmployeeFilters = {
	search: "",
	team: "",
};

export function useEmployeeFilters() {
	const [filters, setFilters] = useState<EmployeeFilters>(initialFilters);

	const setSearch = (search: string) => {
		setFilters((prev) => ({ ...prev, search }));
	};

	const setTeam = (team: string) => {
		setFilters((prev) => ({ ...prev, team }));
	};

	const resetFilters = () => {
		setFilters(initialFilters);
	};

	return {
		filters,
		setSearch,
		setTeam,
		resetFilters,
	};
}
