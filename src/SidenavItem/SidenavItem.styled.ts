import styled from "../utils/styled"
import { sidenavBackground } from "../utils/constants"
import { setAlpha } from "../utils"

export const StyledSidenavItem = styled("div", {
  shouldForwardProp: prop =>
    !["isDark", "hasIcon", "hasItems", "compact", "hasOnClick", "as", "isActive"].includes(prop),
})<{
  as: "a" | "div"
  isActive: boolean
  isDark: boolean
  compact: boolean
  hasIcon: boolean
  hasItems: boolean
  hasOnClick: boolean
}>`
  position: relative;
  display: grid;
  grid-template-rows: ${({ compact }) => (compact ? "40px min-content" : "auto")};
  text-align: ${({ compact }) => (compact ? "center" : "initial")};
  align-items: center;
  padding: ${({ compact, theme }) => (compact ? `${theme.space.small}px 0` : `${theme.space.content}px`)};
  font-size: ${({ theme, compact }) => (compact ? theme.font.size.tiny : theme.font.size.body)}px;
  min-height: min-content;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  word-wrap: break-word;
  hyphens: auto;
  background: ${({ theme, isActive, isDark }) => {
    if (!isActive) {
      return "none"
    }
    return isDark ? theme.color.white : setAlpha(0.2)(theme.color.primary)
  }};
  color: ${({ theme, isActive, isDark }) =>
    isActive ? theme.color.primary : isDark ? theme.color.white : theme.color.text.default};
  cursor: ${({ hasOnClick }) => (hasOnClick ? "pointer" : "initial")};
  grid-template-columns: ${({ hasItems, hasIcon, compact }) => {
    if (!compact) {
      if (hasIcon && hasItems) {
        return "40px auto 40px"
      }
      if (hasIcon && !hasItems) {
        return "40px auto"
      }
      if (!hasIcon && hasItems) {
        return "auto 40px"
      }
      return "auto"
    }
  }};

  :link,
  :visited {
    color: ${({ theme, isActive, isDark }) =>
      isActive ? theme.color.primary : isDark ? theme.color.white : theme.color.text.default};
    cursor: pointer;
  }

  ${({ as }) => (as === "a" ? ":focus," : "")}
  :hover {
    background: ${({ theme, isActive, isDark }) => {
      if (isActive) {
        return isDark ? theme.color.white : setAlpha(0.2)(theme.color.primary)
      }
      return isDark ? theme.color.black : setAlpha(0.15)(theme.color.primary)
    }};
  }

  svg {
    pointer-events: none;
  }

  outline: none;
`

export const Caret = styled("div")<{ isOpen: boolean }>`
  width: 0;
  height: 0;
  margin-left: auto;
  border: 4px solid transparent;
  border-left-color: ${({ theme, isOpen }) => (isOpen ? theme.color.primary : sidenavBackground)};
`

export const IconContainer = styled("div")<{ compact: boolean }>`
  margin-left: ${({ compact }) => (compact ? "auto" : 0)};
  margin-right: ${({ compact }) => (compact ? "auto" : 0)};
`
