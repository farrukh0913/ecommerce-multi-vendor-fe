import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import * as ReactDOM from 'react-dom/client';
import * as React from 'react';
import { App as ReactEditor, store } from '../../shared/services/polotno/polotno-editor';


@Component({
    selector:'app-design-tool',
    standalone:false,
    templateUrl:'./design-tool.html',
    styleUrl:'./design-tool.scss'
})

export class DesignTool{
     root: ReactDOM.Root | undefined;
  store = store; // make store available in template
  
  ngAfterViewInit() {
  const container = document.getElementById('editor');
  if (container && !this.root) {
    this.root = ReactDOM.createRoot(container);
    this.root.render(React.createElement(ReactEditor));
  }
}
  ngOnDestroy() {
    this.root?.unmount();
  }
}