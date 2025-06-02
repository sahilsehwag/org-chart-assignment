import { Card, CardContent } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import type { Employee } from "~/types";

type SearchResultsProps = {
	results: Employee[];
	isLoading: boolean;
	onClick: (id: Employee["id"]) => void;
};

export default function SearchResults({
	results,
	isLoading,
	onClick,
}: SearchResultsProps) {
	return (
		<div className="overflow-auto">
			{/* rounded-none border-x-0 border-t-0 m-0 */}
			{isLoading ? (
				<div className="flex flex-col gap-2">
					<Skeleton className="h-[10vh] w-full" />
					<Skeleton className="h-[10vh] w-full" />
					<Skeleton className="h-[10vh] w-full" />
					<Skeleton className="h-[10vh] w-full" />
					<Skeleton className="h-[10vh] w-full" />
					<Skeleton className="h-[10vh] w-full" />
					<Skeleton className="h-[10vh] w-full" />
					<Skeleton className="h-[10vh] w-full" />
				</div>
			) : (
				<div className="space-y-2 overflow-scroll rounded-lg pb-4">
					{results.map((emp) => (
						<Card
							key={emp.id}
							className="p-2 cursor-pointer hover:bg-gray-100"
							data-testid={`search-result-${emp.id}`}
							onClick={() => onClick(emp.id)}
						>
							<CardContent className="p-2">
								<div className="flex flex-row justify-start items-center gap-4">
									<img src={emp.avatar} alt={emp.name} className="w-10 h-10" />
									<div className="flex flex-col">
										<div>{emp.name}</div>
										<div className="text-sm text-gray-500">
											{emp.designation}
										</div>
										<div className="text-xs text-gray-400">{emp.team}</div>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
