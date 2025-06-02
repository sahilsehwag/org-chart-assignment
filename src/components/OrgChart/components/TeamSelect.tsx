import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from "~/components/ui/select";
import type { EmployeeFilters } from "../hooks/useEmployeeFilters";

type TeamSelectProps = {
	filters: EmployeeFilters;
	teams: string[];
	onChange: (team: string) => void;
};

export default function TeamSelect({
	filters,
	teams,
	onChange,
}: TeamSelectProps) {
	return (
		<Select value={filters.team} onValueChange={onChange}>
			<SelectTrigger className="w-full text-sm font-normal">
				{filters.team || <span className="text-gray-500">Filter by team</span>}
			</SelectTrigger>
			<SelectContent>
				{teams.map((team) => (
					<SelectItem key={team} value={team}>
						{team}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
