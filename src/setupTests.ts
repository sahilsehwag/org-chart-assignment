import "@testing-library/jest-dom";

if (typeof DataTransfer === "undefined") {
	class MockDataTransfer {
		data: Record<string, unknown> = {};
		effectAllowed: string = "";

		constructor() {
			this.data = {};
		}

		setData(key: string, value: unknown) {
			this.data[key] = value;
		}

		getData(key: string) {
			return this.data[key] || "";
		}
	}
	// @ts-expect-error - DataTransfer is not typed
	global.DataTransfer = MockDataTransfer;
}

if (typeof DragEvent === "undefined") {
	class MockDragEvent extends Event {
		dataTransfer: DataTransfer;

		constructor(type: string, eventInitDict?: DragEventInit) {
			super(type, eventInitDict);
			this.dataTransfer = eventInitDict?.dataTransfer || new DataTransfer();
		}
	}
	// @ts-expect-error - DragEvent is not typed
	global.DragEvent = MockDragEvent;
}
