// polotno/editor.tsx
import React from 'react';
import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from 'polotno';
import { Toolbar } from 'polotno/toolbar/toolbar';
import { ZoomButtons } from 'polotno/toolbar/zoom-buttons';
import { SidePanel } from 'polotno/side-panel';
import { Workspace } from 'polotno/canvas/workspace';
import { createStore } from 'polotno/model/store';

// Blueprint styles for Polotno UI
import '@blueprintjs/core/lib/css/blueprint.css';

export const store = createStore({
  key: 'nFA5H9elEytDyPyvKL7T',
  showCredit: true,
});
store.addPage();

export const App = () => {
  return (
    <PolotnoContainer style={{ height: '90vh' }}>
      <SidePanelWrap>
        <SidePanel store={store} />
      </SidePanelWrap>
      <WorkspaceWrap>
        <Toolbar store={store} />
        <Workspace store={store} />
        <ZoomButtons store={store} />
      </WorkspaceWrap>
    </PolotnoContainer>
  );
};