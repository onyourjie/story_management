import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import TagInput from "../components/common/TagInput";
import Modal from "../components/common/Modal";
import Pagination from "../components/common/Pagination";

describe("Badge", () => {
  it("renders label", () => {
    render(<Badge label="test" />);
    expect(screen.getByText("test")).toBeInTheDocument();
  });

  it("renders remove button when onRemove provided", () => {
    const onRemove = vi.fn();
    render(<Badge label="tag" onRemove={onRemove} />);
    const btn = screen.getByRole("button");
    fireEvent.click(btn);
    expect(onRemove).toHaveBeenCalled();
  });

  it("applies publish variant styles", () => {
    const { container } = render(<Badge label="Publish" variant="publish" />);
    expect(container.firstChild).toHaveClass("bg-green-100");
  });

  it("applies draft variant styles", () => {
    const { container } = render(<Badge label="Draft" variant="draft" />);
    expect(container.firstChild).toHaveClass("bg-yellow-100");
  });
});

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("calls onClick handler", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(screen.getByText("Click"));
    expect(onClick).toHaveBeenCalled();
  });

  it("applies secondary variant styles", () => {
    const { container } = render(<Button variant="secondary">Btn</Button>);
    expect(container.firstChild).toHaveClass("bg-white");
  });

  it("is disabled when disabled prop passed", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText("Disabled")).toBeDisabled();
  });
});

describe("Input", () => {
  it("renders label", () => {
    render(<Input label="Name" />);
    expect(screen.getByText("Name")).toBeInTheDocument();
  });

  it("shows error message", () => {
    render(<Input error="Required" />);
    expect(screen.getByText("Required")).toBeInTheDocument();
  });

  it("handles onChange", () => {
    const onChange = vi.fn();
    render(<Input onChange={onChange} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "hello" } });
    expect(onChange).toHaveBeenCalled();
  });
});

describe("TagInput", () => {
  it("renders existing tags", () => {
    render(<TagInput tags={["react", "typescript"]} onChange={() => {}} />);
    expect(screen.getByText("react")).toBeInTheDocument();
    expect(screen.getByText("typescript")).toBeInTheDocument();
  });

  it("adds tag on Enter", () => {
    const onChange = vi.fn();
    render(<TagInput tags={[]} onChange={onChange} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "newtag" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith(["newtag"]);
  });

  it("removes tag on X click", () => {
    const onChange = vi.fn();
    render(<TagInput tags={["react"]} onChange={onChange} />);
    const removeBtn = screen.getByRole("button");
    fireEvent.click(removeBtn);
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it("does not show input in disabled mode", () => {
    render(<TagInput tags={["react"]} onChange={() => {}} disabled />);
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });
});

describe("Modal", () => {
  it("does not render when closed", () => {
    render(
      <Modal isOpen={false} onClose={() => {}} title="Test">
        <p>Content</p>
      </Modal>
    );
    expect(screen.queryByText("Content")).not.toBeInTheDocument();
  });

  it("renders when open", () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="My Modal">
        <p>Modal content</p>
      </Modal>
    );
    expect(screen.getByText("My Modal")).toBeInTheDocument();
    expect(screen.getByText("Modal content")).toBeInTheDocument();
  });

  it("calls onClose when X clicked", () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Close Test">
        <p>test</p>
      </Modal>
    );
    const closeBtn = screen.getByRole("button");
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });
});

describe("Pagination", () => {
  it("renders page numbers", () => {
    render(<Pagination page={1} totalPages={3} onPageChange={() => {}} />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("calls onPageChange when page clicked", () => {
    const onPageChange = vi.fn();
    render(<Pagination page={1} totalPages={3} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByText("2"));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("prev button is disabled on first page", () => {
    render(<Pagination page={1} totalPages={3} onPageChange={() => {}} />);
    expect(screen.getByText("←")).toBeDisabled();
  });

  it("next button is disabled on last page", () => {
    render(<Pagination page={3} totalPages={3} onPageChange={() => {}} />);
    expect(screen.getByText("→")).toBeDisabled();
  });
});
