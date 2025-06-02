import { Handle, useReactFlow } from "@xyflow/react";
import { Position } from "@xyflow/react";
import { toast } from "sonner";

import type { NodeProps } from "@xyflow/react";
import type { Employee } from "~/types";
import type { HierarchyNode } from "d3-hierarchy";
import type { UpdateManagerParams } from "~/server";
import { ERROR_MESSAGES } from "../constants";
import { canDrop, getAllChildrenIds } from "../helpers";

type Data = {
	node: HierarchyNode<Employee>;
	updateManager: (params: UpdateManagerParams) => void;
};

export const NODE_TYPE = "employee";

export default function EmployeeNode({
	id,
	data,
	selected,
	isConnectable,
}: NodeProps & { data: Data }) {
	const { getNode } = useReactFlow();

	const { node, updateManager } = data;
	const employee = node.data;

	const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
		event.dataTransfer.setData("id", id);
		event.dataTransfer.effectAllowed = "move";
	};

	const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		const draggedNodeId = event.dataTransfer.getData("id");

		if (draggedNodeId !== id) {
			const draggedNode = getNode(draggedNodeId);

			if (!draggedNode) return;

			const [canDropFlag, error] = canDrop(
				draggedNode.data.node as HierarchyNode<Employee>,
				node
			);

			if (canDropFlag) {
				updateManager({
					id: draggedNodeId,
					managerId: id,
					team: employee.team,
					ids: getAllChildrenIds(
						draggedNode.data.node as HierarchyNode<Employee>
					),
				});
				toast.success(
					`${employee.name} is now managing ${
						(draggedNode.data as Data).node.data.name
					}`
				);
			} else {
				if (error) {
					toast.error("", {
						description: error,
						cancel: {
							label: "Cancel",
							onClick: () => {
								toast.dismiss();
							},
						},
					});
				}
			}
		}
	};

	return (
		<>
			<Handle
				type="target"
				position={Position.Top}
				isConnectable={isConnectable}
			/>
			<div
				className={`drag-handle w-full h-full rounded text-center cursor-grab bg-white flex flex-col justify-center content-center items-center gap-2 shadow-md border-1 ${
					selected ? "border-blue-600" : "border-gray-100"
				}`}
				draggable
				onDragStart={onDragStart}
				onDragOver={(e) => e.preventDefault()}
				onDrop={onDrop}
			>
				<img src={employee.avatar} alt={employee.name} className="w-16 h-16" />
				<div className="font-semibold">{employee.name}</div>
				<div className="text-sm text-gray-600">{employee.designation}</div>
				<div className="text-xs text-gray-400">{employee.team}</div>
			</div>
			<Handle
				type="source"
				position={Position.Bottom}
				isConnectable={isConnectable}
			/>
		</>
	);
}
