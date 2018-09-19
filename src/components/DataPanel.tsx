import * as React from 'react';
import { DataView } from '../types';
import { TezosFilter } from 'conseiljs';
import { Tab } from './Tab';
/* tslint:disable no-import-side-effect */
import '../style.css';
/* tslint:enable */

interface DataPanelProps {
  filters: TezosFilter;
  dataView: DataView;
  network: string;
  switchTab(dataView: DataView): void;
}

export const DataPanel = (props: DataPanelProps) =>
  (
    <div id="data">
      <div id="data_tabs">
        <button onClick={() => props.switchTab(DataView.Blocks)}>Blocks</button>
        <button onClick={() => props.switchTab(DataView.Operations)}>
          Operations
        </button>
        <button onClick={() => props.switchTab(DataView.Accounts)}>
          Accounts
        </button>
      </div>
      <div id="data_content">
        <Tab
          dataView={DataView.Blocks}
          hidden={props.dataView !== DataView.Blocks}
          filters={props.filters}
          network={props.network}
        />
        <Tab
          dataView={DataView.Operations}
          hidden={props.dataView !== DataView.Operations}
          filters={props.filters}
          network={props.network}
        />
        <Tab
          dataView={DataView.Accounts}
          hidden={props.dataView !== DataView.Accounts}
          filters={props.filters}
          network={props.network}
        />
      </div>
    </div>
  );
