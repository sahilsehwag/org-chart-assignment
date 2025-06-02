import { describe, it, expect, vi } from "vitest";
import { getInitialNodesAndEdges, getAllChildrenIds, canDrop } from "./helpers";
import { type HierarchyNode } from "d3-hierarchy";
import type { Employee } from "~/types";
import { ERROR_MESSAGES } from "./constants";

describe("getInitialNodesAndEdges", () => {
	const mockUpdateManager = vi.fn();

	const mockEmployees: Employee[] = [
		{
			id: "1",
			name: "CEO",
			designation: "CEO",
			team: "Leadership",
			manager: null,
			avatar: "ceo.jpg",
		},
		{
			id: "2",
			name: "Manager 1",
			designation: "Manager",
			team: "Engineering",
			manager: "1",
			avatar: "manager1.jpg",
		},
		{
			id: "3",
			name: "Manager 2",
			designation: "Manager",
			team: "Product",
			manager: "1",
			avatar: "manager2.jpg",
		},
		{
			id: "4",
			name: "Employee 1",
			designation: "Engineer",
			team: "Engineering",
			manager: "2",
			avatar: "employee1.jpg",
		},
	];

	it("should return empty arrays for empty employees list", () => {
		const [nodes, edges] = getInitialNodesAndEdges([], mockUpdateManager);
		expect(nodes).toEqual([]);
		expect(edges).toEqual([]);
	});

	it("should create correct hierarchy of nodes and edges", () => {
		const [nodes, edges] = getInitialNodesAndEdges(
			mockEmployees,
			mockUpdateManager
		);

		expect(nodes).toHaveLength(4);
		expect(edges).toHaveLength(3); // CEO -> 2 managers, Manager 1 -> 1 employee

		expect(
			edges.find((e) => e.source === "1" && e.target === "2")
		).toBeTruthy();
		expect(
			edges.find((e) => e.source === "1" && e.target === "3")
		).toBeTruthy();
		expect(
			edges.find((e) => e.source === "2" && e.target === "4")
		).toBeTruthy();
	});
});

describe("getAllChildrenIds", () => {
	it("should return all children ids in hierarchy", () => {
		const mockNode = {
			data: { id: "1" },
			children: [
				{
					data: { id: "2" },
					children: [{ data: { id: "4" }, children: [] }],
				},
				{
					data: { id: "3" },
					children: [],
				},
			],
		} as unknown as HierarchyNode<Employee>;

		const childrenIds = getAllChildrenIds(mockNode);
		expect(childrenIds).toEqual(["1", "2", "3", "4"]);
	});

	it("should handle nodes without children", () => {
		const mockNode = {
			data: { id: "1" },
			children: [],
		} as unknown as HierarchyNode<Employee>;

		const childrenIds = getAllChildrenIds(mockNode);
		expect(childrenIds).toEqual(["1"]);
	});
});

describe("canDrop", () => {
	it("should return [false, null] if draggedNode is already managed by targetNode", () => {
		const draggedNode = {
			data: { id: "2", manager: "1" },
			depth: 1,
		} as unknown as HierarchyNode<Employee>;
		const targetNode = {
			data: { id: "1" },
			depth: 0,
		} as unknown as HierarchyNode<Employee>;

		const result = canDrop(draggedNode, targetNode);
		expect(result).toEqual([false, null]);
	});

	it("should return [true, null] if draggedNode depth >= targetNode depth and not managed by targetNode", () => {
		const draggedNode = {
			data: { id: "2", manager: "3" },
			depth: 2,
		} as unknown as HierarchyNode<Employee>;
		const targetNode = {
			data: { id: "1" },
			depth: 1,
		} as unknown as HierarchyNode<Employee>;

		const result = canDrop(draggedNode, targetNode);
		expect(result).toEqual([true, null]);
	});

	it("should return [true, null] if draggedNode depth == targetNode depth", () => {
		const draggedNode = {
			data: { id: "2", manager: "3" },
			depth: 1,
		} as unknown as HierarchyNode<Employee>;
		const targetNode = {
			data: { id: "1" },
			depth: 1,
		} as unknown as HierarchyNode<Employee>;

		const result = canDrop(draggedNode, targetNode);
		expect(result).toEqual([true, null]);
	});

	it("should return [false, error] if targetNode is a descendant of draggedNode (cannot move to own subordinates)", () => {
		const ERROR = ERROR_MESSAGES.CANNOT_MOVE_TO_OWN_SUBORDINATES;
		// Build a chain: 1 (dragged) -> 2 -> 3 (target)
		const draggedNode = {
			data: { id: "1", manager: null },
			depth: 0,
			parent: null,
		} as unknown as HierarchyNode<Employee>;
		const childNode = {
			data: { id: "2", manager: "1" },
			depth: 1,
			parent: draggedNode,
		} as unknown as HierarchyNode<Employee>;
		const targetNode = {
			data: { id: "1" },
			depth: 2,
			parent: childNode,
		} as unknown as HierarchyNode<Employee>;

		// targetNode is a descendant of draggedNode (id: "1")
		const result = canDrop(draggedNode, targetNode);
		expect(result).toEqual([false, ERROR]);
	});

	it("should return [true, null] if targetNode is not a descendant and not the manager", () => {
		const draggedNode = {
			data: { id: "2", manager: "3" },
			depth: 1,
		} as unknown as HierarchyNode<Employee>;
		const targetNode = {
			data: { id: "4" },
			depth: 2,
			parent: {
				data: { id: "5" },
				depth: 1,
				parent: null,
			},
		} as unknown as HierarchyNode<Employee>;

		const result = canDrop(draggedNode, targetNode);
		expect(result).toEqual([true, null]);
	});
});
