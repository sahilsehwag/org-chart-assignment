import type { Edge, Node } from "@xyflow/react";
import { stratify, tree, type HierarchyNode } from "d3-hierarchy";
import type { Employee } from "~/types";
import type { UpdateManagerParams } from "~/server";
import {
	HORIZONTAL_SPACING,
	NODE_HEIGHT,
	NODE_WIDTH,
	VERTICAL_SPACING,
	DRAG_HANDLE_ID,
	ERROR_MESSAGES,
} from "./constants";
import { NODE_TYPE } from "./components/EmployeeNode";

export function getInitialNodesAndEdges(
	employees: Employee[],
	updateManager: (params: UpdateManagerParams) => void
) {
	if (!employees.length) return [[], []] as [Node[], Edge[]];

	const hierarchy = stratify<Employee>()
		.id((node) => node.id)
		.parentId((node) => {
			const manager = employees.find((emp) => emp.id === node.manager);
			return manager?.id ?? null;
		});

	const root = hierarchy(employees);
	const layout = tree<Employee>()
		.nodeSize([NODE_WIDTH + HORIZONTAL_SPACING, NODE_HEIGHT + VERTICAL_SPACING])
		.separation((a, b) => (a.parent === b.parent ? 1 : 2));

	layout(root);

	const nodes: Record<string, Node> = {};
	const edges: Record<string, Edge> = {};

	root.descendants().forEach((node) => {
		if (node.height < 0) return;

		if (!nodes[node.data.id]) {
			nodes[node.data.id] = {
				id: node.data.id,
				position: { x: node.x ?? 0, y: node.y ?? 0 },
				type: NODE_TYPE,
				style: {
					width: NODE_WIDTH,
					height: NODE_HEIGHT,
				},
				dragHandle: DRAG_HANDLE_ID,
				data: { node, updateManager },
			};
		}

		if (node.parent?.data?.id) {
			const edgeId = `${node.parent.data.id}->${node.data.id}`;
			if (!edges[edgeId]) {
				edges[edgeId] = {
					id: `${node.parent.data.id}-${node.data.id}`,
					source: node.parent.data.id,
					target: node.data.id,
					type: "smoothstep",
				};
			}
		}
	});

	return [Object.values(nodes), Object.values(edges)] as const;
}

export function getAllChildrenIds(node: HierarchyNode<Employee>) {
	const ids: Employee["id"][] = [];
	const queue: HierarchyNode<Employee>[] = [node];

	while (queue.length > 0) {
		const currentNode = queue.shift();
		if (currentNode) {
			ids.push(currentNode.data.id);
			if (Array.isArray(currentNode.children)) {
				queue.push(...currentNode.children);
			}
		}
	}
	return ids;
}

export function canDrop(
	draggedNode: HierarchyNode<Employee>,
	targetNode: HierarchyNode<Employee>
) {
	if (draggedNode.data.manager === targetNode.data.id) {
		return [false, null];
	}
	if (draggedNode.depth >= targetNode.depth) return [true, null];

	let currentNode: HierarchyNode<Employee> | null = targetNode;

	while (currentNode && currentNode.depth >= draggedNode.depth) {
		if (currentNode.data.id === draggedNode.data.id) {
			return [false, ERROR_MESSAGES.CANNOT_MOVE_TO_OWN_SUBORDINATES];
		}
		currentNode = currentNode.parent;
	}
	return [true, null];
}
