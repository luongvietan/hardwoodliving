/**
 * DateFilter – Unit tests for the date range filter component.
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DateFilter from "./DateFilter";

describe("DateFilter", () => {
  it("renders two date inputs with labels", () => {
    render(
      <DateFilter
        startDate=""
        endDate=""
        onStartDateChange={vi.fn()}
        onEndDateChange={vi.fn()}
      />,
    );
    expect(screen.getByLabelText("Filter from date")).toBeInTheDocument();
    expect(screen.getByLabelText("Filter to date")).toBeInTheDocument();
  });

  it("renders 'to' separator text", () => {
    render(
      <DateFilter
        startDate=""
        endDate=""
        onStartDateChange={vi.fn()}
        onEndDateChange={vi.fn()}
      />,
    );
    expect(screen.getByText("to")).toBeInTheDocument();
  });

  it("displays the initial date values", () => {
    render(
      <DateFilter
        startDate="2026-01-01"
        endDate="2026-01-31"
        onStartDateChange={vi.fn()}
        onEndDateChange={vi.fn()}
      />,
    );
    const fromInput = screen.getByLabelText("Filter from date") as HTMLInputElement;
    const toInput = screen.getByLabelText("Filter to date") as HTMLInputElement;
    expect(fromInput.value).toBe("2026-01-01");
    expect(toInput.value).toBe("2026-01-31");
  });

  it("calls onStartDateChange when start date changes", async () => {
    const onStartDateChange = vi.fn();
    const user = userEvent.setup();

    render(
      <DateFilter
        startDate=""
        endDate=""
        onStartDateChange={onStartDateChange}
        onEndDateChange={vi.fn()}
      />,
    );

    const fromInput = screen.getByLabelText("Filter from date");
    await user.type(fromInput, "2026-02-01");

    expect(onStartDateChange).toHaveBeenCalled();
  });

  it("calls onEndDateChange when end date changes", async () => {
    const onEndDateChange = vi.fn();
    const user = userEvent.setup();

    render(
      <DateFilter
        startDate=""
        endDate=""
        onStartDateChange={vi.fn()}
        onEndDateChange={onEndDateChange}
      />,
    );

    const toInput = screen.getByLabelText("Filter to date");
    await user.type(toInput, "2026-02-28");

    expect(onEndDateChange).toHaveBeenCalled();
  });
});
