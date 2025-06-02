import "@testing-library/jest-dom";

if (typeof DataTransfer === "undefined") {
	class MockDataTransfer {
		data: Record<string, any> = {};
		effectAllowed: string = "";

		constructor() {
			this.data = {};
		}

		setData(key: string, value: any) {
			this.data[key] = value;
		}

		getData(key: string) {
			return this.data[key] || "";
		}
	}
	// @ts-ignore
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
	// @ts-ignore
	global.DragEvent = MockDragEvent;
}
