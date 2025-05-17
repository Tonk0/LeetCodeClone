import { RefObject, useEffect, useState } from 'react';

interface UseContainerFoldProps {
  parentContainer: RefObject<HTMLDivElement>;
  elementWidth: number;
  threshold: number;
}
export const useContainerFold = ({ parentContainer, elementWidth, threshold }:
UseContainerFoldProps) => {
  const [isFolded, setIsFolded] = useState(false);

  useEffect(() => {
    if (!parentContainer.current) return;

    const widthPercent = (
      elementWidth / parentContainer.current.getBoundingClientRect().width
    ) * 100;

    setIsFolded(widthPercent <= threshold);
  }, [parentContainer, elementWidth, threshold]);

  return isFolded;
};
