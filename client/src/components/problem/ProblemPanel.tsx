import {
  Box, Flex, Text, useBreakpointValue,
} from '@chakra-ui/react';
import { useParams, Link } from '@tanstack/react-router';
import { LuFileText, LuHistory } from 'react-icons/lu';
import { useEffect, useState } from 'react';
import { usePanel } from '@/context/PanelContext';
import { useMoveHorizontally } from '@/hooks/useMoveHorizontally';
import { useMoveVertically } from '@/hooks/useMoveVertically';
import { useElementWidth } from '@/hooks/useElementWidth';

export function ProblemPanel() {
  const { leftPanel, rightPanel } = usePanel();
  const { id } = useParams({ from: '/problems/$id' });
  const {
    containerRef, leftContainerRef, handleMouseDown, handleTouchStart,
  } = useMoveHorizontally();
  const {
    containerRef: secondHalfRef,
    topContainerRef, handleMouseDown: handleMouseDownVert, handleTouchStart: handleTouchStartVert,
  } = useMoveVertically();
  const width = useElementWidth(leftContainerRef);
  const [isFolded, setIsFolded] = useState(false);
  const isMobile = useBreakpointValue({ base: true, lg: false });
  useEffect(() => {
    if (containerRef.current) {
      if ((width / containerRef.current.getBoundingClientRect().width) * 100 <= 3) {
        setIsFolded(true);
      } else {
        setIsFolded(false);
      }
    }
  }, [width, containerRef]);

  useEffect(() => {
    if (leftContainerRef.current) {
      if (isMobile) {
        setIsFolded(false);
        leftContainerRef.current.style.width = '100%';
      } else {
        leftContainerRef.current.style.width = '50%';
      }
    }
  }, [isMobile, leftContainerRef]);
  return (
    <Flex alignItems="flex-start" direction={{ lg: 'row', base: 'column' }} w="100vw" h="100vh" ref={containerRef}>
      <Flex ref={leftContainerRef} width={{ lg: '50%', base: '100%' }} minW="3%" flexShrink="0" flexDirection="column" h={{base: 'auto', lg: '100%'}}>
        <Flex gap="5" w="100%" bg={{ base: 'gray.200', _dark: 'gray.800' }} h={isFolded ? '100%' : '5%'} writingMode={isFolded ? 'vertical-lr' : 'inherit'} align="center" padding="5" overflow="hidden">
          <Link to="/problems/$id/desc" params={{ id }}>
            <Flex align="center" gap="2">
              <LuFileText />
              Описание
            </Flex>
          </Link>
          <Link to="/problems/$id/submissions" params={{ id }}>
            <Flex align="center" gap="2">
              <LuHistory />
              Попытки
            </Flex>
          </Link>
        </Flex>
        {!isFolded && (
        <Flex padding="5" w="100%" direction="column" overflow="auto">
          {leftPanel}
        </Flex>
        )}

      </Flex>
      <Box flexShrink="0" onMouseDown={handleMouseDown} display={{ lg: 'inherit', base: 'none' }} onTouchStart={handleTouchStart} h="100%" w="3px" backgroundColor="blue.400" cursor="ew-resize" userSelect="none" />
      <Flex ref={secondHalfRef} h={{ base: '', lg: '100%' }} direction="column" flex={{ base: '', lg: '1' }} alignItems="center" justify="center">
        <Flex w="100%" h="50%" align="center" justify="center" ref={topContainerRef}>
          {rightPanel}
          <Text>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit eaque officia,
            praesentium cumque distinctio facere excepturi est ipsa fugiat
            neque veritatis ea quam iure rerum! Labore quis temporibus consectetur dicta!
          </Text>
        </Flex>
        <Box display={{ lg: 'inherit', base: 'none' }} w="100%" h="3px" onMouseDown={handleMouseDownVert} onTouchStart={handleTouchStartVert} backgroundColor="blue.400" cursor="ns-resize" />
        <Flex w="100%" h="50%" flex="1" align="center" justify="center">
          bikinibottom
        </Flex>
      </Flex>
    </Flex>
  );
}
