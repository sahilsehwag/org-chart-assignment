import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useEmployees } from "./useEmployees";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { Employee } from "~/types";

vi.mock("~/server", () => ({
	fetchEmployees: vi.fn(() => Promise.resolve(mockEmployees)),
	updateManager: vi.fn(() => Promise.resolve()),
}));

// Mock data
const mockEmployees: Employee[] = [
	{
		id: "1",
		name: "John Doe",
		designation: "CEO",
		team: "Leadership",
		manager: null,
		avatar: "john.jpg",
	},
	{
		id: "2",
		name: "Jane Smith",
		designation: "Engineering Manager",
		team: "Engineering",
		manager: "1",
		avatar: "jane.jpg",
	},
	{
		id: "3",
		name: "Bob Wilson",
		designation: "Product Manager",
		team: "Product",
		manager: "1",
		avatar: "bob.jpg",
	},
];

describe("useEmployees", () => {
	let queryClient: QueryClient;
	let wrapper: React.FC<{ children: React.ReactNode }>;

	beforeEach(() => {
		queryClient = new QueryClient();
		wrapper = ({ children }) => (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		);
		vi.clearAllMocks();
	});

	it("should fetch and return employees", async () => {
		const { result } = renderHook(
			() => useEmployees({ filters: { search: "", team: "" } }),
			{ wrapper }
		);

		await waitFor(() => {
			expect(result.current.employees).toEqual(mockEmployees);
		});
	});

	it("should filter employees by team", async () => {
		const { result } = renderHook(
			() => useEmployees({ filters: { search: "", team: "Engineering" } }),
			{ wrapper }
		);

		await waitFor(() => {
			expect(result.current.employees).toHaveLength(1);
			expect(result.current.employees[0].name).toBe("Jane Smith");
		});
	});

	it("should search employees across name, designation, and team", async () => {
		const { result } = renderHook(
			() => useEmployees({ filters: { search: "manager", team: "" } }),
			{ wrapper }
		);

		await waitFor(() => {
			expect(result.current.searchResults).toHaveLength(2);
			expect(result.current.searchResults.map((e) => e.name)).toEqual([
				"Jane Smith",
				"Bob Wilson",
			]);
		});
	});

	it("should return unique teams", async () => {
		const { result } = renderHook(
			() => useEmployees({ filters: { search: "", team: "" } }),
			{ wrapper }
		);

		await waitFor(() => {
			expect(result.current.teams).toEqual([
				"Leadership",
				"Engineering",
				"Product",
			]);
		});
	});

	it("should handle empty search results", async () => {
		const { result } = renderHook(
			() => useEmployees({ filters: { search: "nonexistent", team: "" } }),
			{ wrapper }
		);

		await waitFor(() => {
			expect(result.current.searchResults).toHaveLength(0);
		});
	});

	it("should combine team filter with search", async () => {
		const { result } = renderHook(
			() =>
				useEmployees({ filters: { search: "manager", team: "Engineering" } }),
			{ wrapper }
		);

		await waitFor(() => {
			expect(result.current.searchResults).toHaveLength(1);
			expect(result.current.searchResults[0].name).toBe("Jane Smith");
		});
	});
});
