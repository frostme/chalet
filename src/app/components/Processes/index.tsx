import * as React from "react";

import { IMonitor } from "../../Store";

import "./index.css";

interface IProps {
  monitor: IMonitor;
  onClose: () => void;
}

const Processes: React.FC<IProps> = (props) => {
  return (
    <div>
      <span>Example</span>
    </div>
  );
}

export default Processes;
