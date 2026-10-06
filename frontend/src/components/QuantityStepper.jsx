import { Minus, Plus } from "lucide-react";

export default function QuantityStepper({ value, disabled, decreaseDisabled = false, increaseDisabled = false, onDecrease, onIncrease }) {
  return (
    <div className="quantity-stepper" aria-label="Quantity">
      <button type="button" disabled={disabled || decreaseDisabled} onClick={onDecrease} title="Decrease quantity">
        <Minus size={16} />
      </button>
      <strong>{value}</strong>
      <button type="button" disabled={disabled || increaseDisabled} onClick={onIncrease} title="Increase quantity">
        <Plus size={16} />
      </button>
    </div>
  );
}