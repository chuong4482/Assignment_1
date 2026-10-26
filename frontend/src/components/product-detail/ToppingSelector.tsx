'use client';

import React from 'react';
import { TOPPING_OPTIONS, formatCurrency } from '../../utils/pricing';

/**
 * [4.2] Tùy chọn Topping (Trân châu, Kem cheese, Shot espresso)
 */
export interface ToppingSelectorProps {
  selectedToppings: string[];
  onChange: (toppings: string[]) => void;
}

export function ToppingSelector({ selectedToppings, onChange }: ToppingSelectorProps) {
  const toggleTopping = (name: string) => {
    if (selectedToppings.includes(name)) {
      onChange(selectedToppings.filter((item) => item !== name));
    } else {
      onChange([...selectedToppings, name]);
    }
  };

  return (
    <div className="option-section">
      <div className="option-header">
        <span className="option-label">Topping thêm (+7.000 ₫/loại)</span>
        <span className="option-optional">Tùy chọn • Có thể chọn nhiều</span>
      </div>
      <div className="topping-options-list">
        {TOPPING_OPTIONS.map((topping) => {
          const isChecked = selectedToppings.includes(topping.name);
          return (
            <label
              key={topping.name}
              className={`topping-option-card ${isChecked ? 'active' : ''}`}
            >
              <div className="topping-left">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleTopping(topping.name)}
                />
                <div>
                  <div className="topping-name">{topping.name}</div>
                  <div className="topping-desc">{topping.description}</div>
                </div>
              </div>
              <span className="topping-price">
                {isChecked ? `✓ +${formatCurrency(topping.price)}` : `+${formatCurrency(topping.price)}`}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
