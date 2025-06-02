import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import EmployeeNode, { NODE_TYPE } from "./EmployeeNode";
import type { HierarchyNode } from "d3-hierarchy";
import type { Employee } from "~/types";
import type { Node } from "@xyflow/react";

// Mock useReactFlow hook
vi.mock("@xyflow/react", () => ({
	useReactFlow: () => ({
		getNode: vi.fn().mockImplementation((id) => {
			if (id === "2") {
				return {
					data: {
						node: {
							data: {
								id: "2",
								name: "Employee 2",
								designation: "Engineer",
								team: "Engineering",
								manager: "1",
								avatar: "avatar2.jpg",
							},
							depth: 1,
						},
					},
				};
			}
			return null;
		}),
	}),
	Handle: ({ type, position, children }: any) => (
		<div data-testid={`handle-${type}`} data-position={position}>
			{children}
		</div>
	),
	Position: {
		Top: "top",
		Bottom: "bottom",
	},
}));

describe("EmployeeNode", () => {
	const mockUpdateManager = vi.fn();
	const mockNode = {
		data: {
			id: "1",
			name: "Employee 1",
			designation: "Manager",
			team: "Engineering",
			manager: null,
			avatar: "avatar1.jpg",
		},
		depth: 0,
	} as HierarchyNode<Employee>;

	const defaultProps = {
		id: "1",
		type: NODE_TYPE,
		data: {
			node: mockNode,
			updateManager: mockUpdateManager,
		},
	} as unknown as Node<Employee>;

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renders employee information correctly", () => {
		// @ts-ignore
		render(<EmployeeNode {...defaultProps} />);

		expect(screen.getByText("Employee 1")).toBeInTheDocument();
		expect(screen.getByText("Manager")).toBeInTheDocument();
		expect(screen.getByText("Engineering")).toBeInTheDocument();
		expect(screen.getByAltText("Employee 1")).toHaveAttribute(
			"src",
			"avatar1.jpg"
		);
	});
});
