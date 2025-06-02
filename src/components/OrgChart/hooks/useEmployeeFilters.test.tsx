import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useEmployeeFilters } from "./useEmployeeFilters";

describe("useEmployeeFilters", () => {
	it("should initialize with empty filters", () => {
		const { result } = renderHook(() => useEmployeeFilters());

		expect(result.current.filters).toEqual({
			search: "",
			team: "",
		});
	});

	it("should update search filter", () => {
		const { result } = renderHook(() => useEmployeeFilters());

		act(() => {
			result.current.setSearch("John");
		});

		expect(result.current.filters).toEqual({
			search: "John",
			team: "",
		});
	});

	it("should update team filter", () => {
		const { result } = renderHook(() => useEmployeeFilters());

		act(() => {
			result.current.setTeam("Engineering");
		});

		expect(result.current.filters).toEqual({
			search: "",
			team: "Engineering",
		});
	});

	it("should reset filters", () => {
		const { result } = renderHook(() => useEmployeeFilters());

		act(() => {
			result.current.setSearch("John");
			result.current.setTeam("Engineering");
		});

		act(() => {
			result.current.resetFilters();
		});

		expect(result.current.filters).toEqual({
			search: "",
			team: "",
		});
	});

	it("should maintain previous filter values when updating one filter", () => {
		const { result } = renderHook(() => useEmployeeFilters());

		act(() => {
			result.current.setSearch("John");
			result.current.setTeam("Engineering");
		});

		act(() => {
			result.current.setSearch("Jane");
		});

		expect(result.current.filters).toEqual({
			search: "Jane",
			team: "Engineering",
		});
	});
});
