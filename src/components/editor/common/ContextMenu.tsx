import * as React from 'react';

import './ContextMenu.scss';

class ContextMenuProps {
  id?: string;
  visible: boolean;
  left: number;
  top: number;
  // onHide: () => void;
  children: any;
}
const ContextMenu: React.FC<ContextMenuProps> = (props: ContextMenuProps) => {
  const { id, visible, left, top, children } = props;
  return (
    <div
      id={id ? `context-menu-${id}` : 'context-menu'}
      style={{ display: visible ? 'block' : 'none', left, top }}
      className="contextMenu-layer">
      <div className="contextMenu">{children}</div>
    </div>
  );
};
class ContextEditableProps {
  id?: string;
  visible: boolean;
  left: number;
  top: number;
  // onHide: () => void;
  children: any;
}
const ContextEditable: React.FC<ContextEditableProps> = (props: ContextEditableProps) => {
  const { id, visible, left, top, children } = props;
  return (
      <div
          id={id ? `context-editable-${id}` : 'editable-menu'}
          style={{ display: visible ? 'block' : 'none', left, top }}
          className="contextEditable-layer">
        <div className="contextEditable">{children}</div>
      </div>
  );
};

export { ContextMenu,ContextEditable };
