import {
	Background,
	Controls,
	MiniMap,
	ReactFlow,
	useEdgesState,
	useNodesState,
	useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useEffect, useMemo } from "react";

import type { Employee } from "~/types";
import { getInitialNodesAndEdges } from "../helpers";
import EmployeeNode, { NODE_TYPE } from "./EmployeeNode";
import type { UpdateManagerParams } from "~/server";

type EmployeeChartProps = {
	employees: Employee[];
	updateManager: (params: UpdateManagerParams) => void;
};

const nodeTypes = {
	[NODE_TYPE]: EmployeeNode,
};

export default function EmployeeChart({
	employees,
	updateManager,
}: EmployeeChartProps) {
	const [initialNodes, initialEdges] = useMemo(
		() => getInitialNodesAndEdges(employees, updateManager), // TODO: update manager
		[employees, updateManager]
	);

	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

	useEffect(() => {
		setEdges(initialEdges);
		setNodes(initialNodes);
	}, [initialEdges, initialNodes]);

	const { fitView } = useReactFlow();

	useEffect(() => {
		fitView({ duration: 500, maxZoom: 0.75 });
	}, [employees]);

	return (
		<div className="w-full overflow-auto bg-gray-50">
			<div className="h-full w-full">
				<ReactFlow
					nodes={nodes}
					edges={edges}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					nodeTypes={nodeTypes}
					minZoom={0.25}
					panOnScroll={true}
					panOnScrollSpeed={1}
				>
					<Controls position="top-right" />
					<MiniMap
						position="bottom-right"
						nodeStrokeWidth={3}
						className="border-1 border-gray-300"
					/>
					<Background />
				</ReactFlow>
			</div>
		</div>
	);
}
