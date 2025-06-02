export const NODE_WIDTH = 225;
export const NODE_HEIGHT = 225;
export const HORIZONTAL_SPACING = 20;
export const VERTICAL_SPACING = 50;

export const DRAG_HANDLE_ID = "drag-handle";

export const ERROR_MESSAGES = {
	CANNOT_MOVE_TO_OWN_SUBORDINATES:
		"You cannot move managers to their own subordinates",
	CANNOT_MOVE_BETWEEN_TEAMS: "You cannot move managers between different teams",
} as const;
