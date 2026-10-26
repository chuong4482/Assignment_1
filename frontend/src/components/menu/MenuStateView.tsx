'use client';

import React from 'react';

/**
 * [3.3] Xử lý trạng thái UI cho Trang Menu (Loading / Empty / Error)
 */
export interface MenuStateViewProps {
  status: 'loading' | 'empty' | 'error';
  searchQuery?: string;
  errorMessage?: string;
  onRetry?: () => void;
  onResetFilter?: () => void;
}

export function MenuStateView({
  status,
  searchQuery,
  errorMessage,
  onRetry,
  onResetFilter,
}: MenuStateViewProps) {
  if (status === 'loading') {
    return (
      <div className="products-grid" aria-busy="true" aria-label="Đang tải danh sách sản phẩm">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div key={idx} className="product-card skeleton-card">
            <div className="skeleton-img" />
            <div className="card-info">
              <div className="skeleton-line skeleton-title" />
              <div className="skeleton-line skeleton-desc" />
              <div className="skeleton-line skeleton-price" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="menu-state-box error-state">
        <div className="state-icon">⚠️</div>
        <h3>Không thể kết nối dữ liệu thực đơn</h3>
        <p>{errorMessage || 'Đã xảy ra lỗi khi tải danh sách đồ uống. Vui lòng thử lại.'}</p>
        {onRetry && (
          <button type="button" className="btn-primary" onClick={onRetry}>
            Thử tải lại
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="menu-state-box empty-state">
      <div className="state-icon">☕</div>
      <h3>Không tìm thấy món phù hợp</h3>
      <p>
        {searchQuery?.trim()
          ? `Không có sản phẩm nào khớp với từ khóa "${searchQuery}".`
          : 'Hiện chưa có sản phẩm nào trong danh mục này.'}
      </p>
      {onResetFilter && (
        <button type="button" className="btn-primary" onClick={onResetFilter}>
          Xem toàn bộ thực đơn
        </button>
      )}
    </div>
  );
}
