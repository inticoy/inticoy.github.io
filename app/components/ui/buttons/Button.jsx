import React from "react";
import PropTypes from "prop-types";
import { Button as MuiButton } from "@mui/material";

export default function Button({
  children,
  href,
  startIcon,
  endIcon,
  variant = "text",
  color = "primary",
  size = "small",
  className = "",
  onClick,
  ...props
}) {
  return (
    <MuiButton
      href={href}
      startIcon={startIcon}
      endIcon={endIcon}
      variant={variant}
      color={color}
      size={size}
      className={className}
      onClick={onClick}
      {...props}
    >
      {children}
    </MuiButton>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired, // 버튼 내부의 텍스트 또는 콘텐츠
  href: PropTypes.string, // 링크 이동 URL
  startIcon: PropTypes.node, // 왼쪽 아이콘
  endIcon: PropTypes.node, // 오른쪽 아이콘
  variant: PropTypes.oneOf(["text", "outlined", "contained"]), // 버튼 스타일
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "error",
    "info",
    "success",
    "warning",
  ]),
  size: PropTypes.oneOf(["small", "medium", "large"]), // 버튼 크기
  className: PropTypes.string, // 추가 스타일
  onClick: PropTypes.func, // 클릭 이벤트 핸들러
};

Button.defaultProps = {
  href: null,
  startIcon: null,
  endIcon: null,
  onClick: null,
};
