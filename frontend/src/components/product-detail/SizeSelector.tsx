'use client';

import React from 'react';
import { SIZE_OPTIONS, type ProductSize } from '../../utils/pricing';

/**
 * [4.2] Tùy chọn Size (S / M / L)
 */
export interface SizeSelectorProps {
  value: ProductSize;
  onChange: (size: ProductSize) => void;
}

export function SizeSelector({ value, onChange }: SizeSelectorProps) {
  return (
    <div className="option-section">
      <div className="option-header">
        <span className="option-label">Chọn kích cỡ ly (Size)</span>
        <span className="option-required">Bắt buộc • Chọn 1</span>
      </div>
      <div className="size-options-grid">
        {SIZE_OPTIONS.map((option) => {
          const isSelected = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              className={`size-option-btn ${isSelected ? 'active' : ''}`}
              onClick={() => onChange(option.id)}
              aria-pressed={isSelected}
            >
              <span className="size-badge">{option.id}</span>
              <div className="size-meta">
                <strong>{option.label}</strong>
                <small>{option.subLabel}</small>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
