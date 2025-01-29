import React from "react";
import PropTypes from "prop-types";

export default function IconButton({ children, href, className, ...props }) {
  return (
    <div
      className={`p-4 flex items-center justify-center hover:text-slate-800 dark:hover:text-amber-400 cursor-pointer ${className}`}
      onClick={() => {
        if (href) location.href = href;
      }}
      {...props}
    >
      {children}
    </div>
  );
}

IconButton.propTypes = {
  children: PropTypes.node.isRequired, // 아이콘이나 내용을 렌더링할 children
  href: PropTypes.string.isRequired, // 이동할 URL
  className: PropTypes.string, // 추가 스타일을 위한 클래스
};

IconButton.defaultProps = {
  className: "",
};
