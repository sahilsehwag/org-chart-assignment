import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import EmployeesSidebar from "./EmployeesSidebar";

const mockSetCenter = vi.fn();

vi.mock("@xyflow/react", () => ({
	useReactFlow: () => ({
		getNode: vi.fn(() => ({
			position: { x: 100, y: 100 },
		})),
		setCenter: mockSetCenter,
	}),
}));

vi.mock("../hooks/useEmployees", () => ({
	useEmployees: () => ({
		isLoading: false,
		teams: ["Engineering", "Product", "Leadership"],
		searchResults: [
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
		],
	}),
}));

describe("EmployeesSidebar", () => {
	const defaultProps = {
		filters: {
			search: "",
			team: "",
		},
		setSearch: vi.fn(),
		setTeam: vi.fn(),
		resetFilters: vi.fn(),
	};

	it("renders all components correctly", () => {
		render(<EmployeesSidebar {...defaultProps} />);

		expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
		expect(screen.getByText("Clear Filters")).toBeInTheDocument();
		expect(screen.getByText("John Doe")).toBeInTheDocument();
		expect(screen.getByText("Jane Smith")).toBeInTheDocument();
	});

	it("handles search input changes", () => {
		render(<EmployeesSidebar {...defaultProps} />);

		const searchInput = screen.getByPlaceholderText("Search...");
		fireEvent.change(searchInput, { target: { value: "John" } });

		expect(defaultProps.setSearch).toHaveBeenCalledWith("John");
	});

	it("handles clear filters click", () => {
		render(<EmployeesSidebar {...defaultProps} />);

		const clearButton = screen.getByText("Clear Filters");
		fireEvent.click(clearButton);

		expect(defaultProps.resetFilters).toHaveBeenCalled();
	});

	it("toggles sidebar visibility", () => {
		render(<EmployeesSidebar {...defaultProps} />);

		const toggleButton = screen.getByRole("button", { name: "" }); // The AlignJustify button
		const sidebar = screen.getByText("Clear Filters").parentElement;

		expect(sidebar).not.toHaveClass("-translate-x-full");

		fireEvent.click(toggleButton);

		expect(sidebar).toHaveClass("-translate-x-full");
	});

	it("displays search results", () => {
		render(<EmployeesSidebar {...defaultProps} />);

		expect(screen.getByText("John Doe")).toBeInTheDocument();
		expect(screen.getByText("CEO")).toBeInTheDocument();
		expect(screen.getByText("Leadership")).toBeInTheDocument();

		expect(screen.getByText("Jane Smith")).toBeInTheDocument();
		expect(screen.getByText("Engineering Manager")).toBeInTheDocument();
		expect(screen.getByText("Engineering")).toBeInTheDocument();
	});

	it("handles employee result click", () => {
		render(<EmployeesSidebar {...defaultProps} />);

		const firstResult = screen.getByTestId("search-result-1");
		if (!firstResult) throw new Error("Search result not found");

		fireEvent.click(firstResult);

		// Check if setCenter was called (via mocked useReactFlow)
		expect(mockSetCenter).toHaveBeenCalled();
	});
});
