import React, { useEffect } from 'react';
import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from 'polotno';
import { SidePanel, DEFAULT_SECTIONS } from 'polotno/side-panel';
import { Toolbar } from 'polotno/toolbar/toolbar';
import { Workspace } from 'polotno/canvas/workspace';
import { ZoomButtons } from 'polotno/toolbar/zoom-buttons';
import { PolotnoService } from '../shared/services/polotno.service';

interface AppProps {
  service: PolotnoService;
}

// ✅ The shared React component for Polotno
export const App: React.FC<AppProps> = ({ service }) => {
  const { store } = service;

  // Notify service when workspace is mounted
  useEffect(() => {
    service.markWorkspaceReady();
  }, [service]);

  const sections = DEFAULT_SECTIONS.filter((section) =>
    ['text', 'photos', 'elements', 'upload'].includes(section.name)
  );

  return (
    <PolotnoContainer style={{ height: '90vh' }}>
      <SidePanelWrap>
        <SidePanel store={store} sections={sections} />
      </SidePanelWrap>
      <WorkspaceWrap>
        <Toolbar store={store} />
        <Workspace store={store} />
        <ZoomButtons store={store} />
      </WorkspaceWrap>
    </PolotnoContainer>
  );
};
