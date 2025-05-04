import {
  createContext, ReactNode, useContext, useMemo, useState,
} from 'react';

interface IPanelContext {
  leftPanel: ReactNode;
  rightPanel: ReactNode;
  setLeftPanel: (content: ReactNode) => void;
  setRightPanel: (content: ReactNode) => void;
}

const PanelContext = createContext<IPanelContext | null>(null);

export function PanelProvider({ children }: { children: ReactNode }) {
  const [leftPanel, setLeftPanel] = useState<ReactNode>(null);
  const [rightPanel, setRightPanel] = useState<ReactNode>(null);

  const obj = useMemo(() => ({
    leftPanel, rightPanel, setLeftPanel, setRightPanel,
  }), [leftPanel, rightPanel]);
  return (
    <PanelContext.Provider value={obj}>
      {children}
    </PanelContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePanel() {
  const context = useContext(PanelContext);
  if (!context) {
    throw new Error('usePanel должен использоваться внутри PanelProvider');
  }
  return context;
}
