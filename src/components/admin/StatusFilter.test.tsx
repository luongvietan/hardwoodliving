/**
 * StatusFilter – Unit tests for the status dropdown filter component.
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import StatusFilter from "./StatusFilter";

const options = [
  { value: "all", label: "All Statuses" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
];

describe("StatusFilter", () => {
  it("renders a select element with aria-label", () => {
    render(
      <StatusFilter value="all" onChange={vi.fn()} options={options} />,
    );
    expect(screen.getByLabelText("Filter by status")).toBeInTheDocument();
  });

  it("renders all options", () => {
    render(
      <StatusFilter value="all" onChange={vi.fn()} options={options} />,
    );
    expect(screen.getByText("All Statuses")).toBeInTheDocument();
    expect(screen.getByText("New")).toBeInTheDocument();
    expect(screen.getByText("Contacted")).toBeInTheDocument();
  });

  it("has the correct initial value", () => {
    render(
      <StatusFilter value="new" onChange={vi.fn()} options={options} />,
    );
    const select = screen.getByLabelText("Filter by status") as HTMLSelectElement;
    expect(select.value).toBe("new");
  });

  it("calls onChange when selection changes", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(
      <StatusFilter value="all" onChange={onChange} options={options} />,
    );

    const select = screen.getByLabelText("Filter by status");
    await user.selectOptions(select, "contacted");

    expect(onChange).toHaveBeenCalledWith("contacted");
  });

  it("renders with empty options array", () => {
    render(
      <StatusFilter value="" onChange={vi.fn()} options={[]} />,
    );
    const select = screen.getByLabelText("Filter by status");
    expect(select).toBeInTheDocument();
  });
});
