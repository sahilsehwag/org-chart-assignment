import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

import {
	fetchEmployees,
	updateManager,
	type UpdateManagerParams,
} from "~/server";

import type { Employee } from "~/types";
import type { EmployeeFilters } from "./useEmployeeFilters";
import { useDebounce } from "@uidotdev/usehooks";

type UseEmployeesProps = {
	filters: EmployeeFilters;
};

export const useEmployees = ({ filters }: UseEmployeesProps) => {
	const queryClient = useQueryClient();

	const { search, team } = filters;
	const debouncedSearch = useDebounce(search, 500);

	const { data: employees = [], isLoading } = useQuery<Employee[]>({
		queryKey: ["employees"],
		queryFn: fetchEmployees,
		staleTime: 1000 * 60 * 5, // 5 minutes
	});

	const updateManagerMutation = useMutation<void, Error, UpdateManagerParams>({
		mutationFn: updateManager,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["employees"] }),
	});

	const filtered = useMemo(() => {
		return employees.filter((emp) => {
			const matchTeam = team ? emp.team === team : true;
			return matchTeam;
		});
	}, [employees, team]);

	const searchResults = useMemo(() => {
		return filtered.filter((emp) => {
			const matchSearch = [emp.name, emp.designation, emp.team].some(
				(field) => {
					return field.toLowerCase().includes(debouncedSearch.toLowerCase());
				}
			);
			return matchSearch;
		});
	}, [filtered, debouncedSearch]);

	const teams = useMemo(
		() => Array.from(new Set(employees.map((e) => e.team))),
		[employees]
	);

	return {
		employees: filtered,
		searchResults,
		teams,
		isLoading,
		updateManager: updateManagerMutation.mutate,
	};
};
