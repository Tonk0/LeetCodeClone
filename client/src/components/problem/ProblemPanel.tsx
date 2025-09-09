import {
  Box, Button, Flex, useBreakpointValue, Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Link, useParams } from '@tanstack/react-router';
import {
  LuCode, LuFileText, LuHistory, LuTestTubeDiagonal,
} from 'react-icons/lu';
import { useQuery } from '@tanstack/react-query';
import { useMoveHorizontally } from '@/hooks/useMoveHorizontally';
import { useMoveVertically } from '@/hooks/useMoveVertically';
import { useElementWidth } from '@/hooks/useElementWidth';
import { useContainerFold } from '@/hooks/useContainerFold';
import { useFixedWidthBelowThreshold } from '@/hooks/useFixedWidthBelowThreshold';
import { usePanel } from '@/context/PanelContext';
import { CodeEditor } from './CodeEditor';
import { TestCases } from './TestCases';
import { AttemptResult } from '@/helpers/api';
import { TestResults } from './TestResults';

export function ProblemPanel() {
  const { leftPanel, rightPanel, setRightPanel } = usePanel();
  const { data: submitData } = useQuery<AttemptResult>({
    queryKey: ['submit'],
  });
  const { id } = useParams({ from: '/problems/$id' });
  const {
    containerRef, leftContainerRef, handleMouseDown, handleTouchStart,
  } = useMoveHorizontally();
  const {
    containerRef: rightContainerRef,
    topContainerRef, handleMouseDown: handleMouseDownVert, handleTouchStart: handleTouchStartVert,
  } = useMoveVertically();

  const isMobile = useBreakpointValue({ base: true, lg: false });
  const leftContainerWidth = useElementWidth(leftContainerRef);
  const rightContainerWidth = useElementWidth(rightContainerRef);
  const [showTestResults, setShowTestResults] = useState(false);
  const isLeftFolded = useContainerFold({
    parentContainer: containerRef,
    elementWidth: leftContainerWidth,
    threshold: 3,
  });

  const isRightFolded = useContainerFold({
    parentContainer: containerRef,
    elementWidth: rightContainerWidth,
    threshold: 3,
  });

  const leftContent = useFixedWidthBelowThreshold({
    threshold: 30,
    elementWidth: leftContainerWidth,
    containerRef,
  });
  const rightTopContent = useFixedWidthBelowThreshold({
    threshold: 30,
    elementWidth: rightContainerWidth,
    containerRef,
  });
  const rightBottomContent = useFixedWidthBelowThreshold({
    threshold: 30,
    elementWidth: rightContainerWidth,
    containerRef,
  });

  useEffect(() => {
    if (!leftContainerRef.current || !rightContainerRef.current || !topContainerRef.current) return;

    if (isMobile) {
      leftContainerRef.current.style.width = '100%';
      rightContainerRef.current.style.width = '100%';
      topContainerRef.current.style.height = '50%';
    } else {
      leftContainerRef.current.style.width = '50%';
    }

    // eslint-disable-next-line consistent-return
    return () => {
      sessionStorage.removeItem('submissionId');
    };
  }, [isMobile, leftContainerRef, rightContainerRef, topContainerRef]);

  useEffect(() => {
    if (submitData) {
      setShowTestResults(true);
    }
  }, [submitData]);

  return (
    <Flex ref={containerRef} w="100vw" height="100vh" alignItems="flex-start" direction={{ lg: 'row', base: 'column' }}>
      <Flex ref={leftContainerRef} w={{ lg: '50%', base: '100%' }} h={{ lg: '100%', base: 'auto' }} minW="3%" direction="column" overflow="hidden">
        <Flex w="100%" h={isLeftFolded ? '100vh' : '5vh'} writingMode={isLeftFolded ? 'vertical-lr' : 'inherit'} bg={{ base: 'gray.200', _dark: 'gray.800' }} flexShrink="0" align="center" gap="5" padding="5">
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
        <Flex h="100%" overflow="auto" display={isLeftFolded ? 'none' : 'flex'}>
          <div ref={leftContent}>
            {leftPanel}
          </div>
        </Flex>
      </Flex>
      <Box onMouseDown={handleMouseDown} onTouchStart={handleTouchStart} display={{ lg: 'inherit', base: 'none' }} h="100%" w="3px" backgroundColor="blue.400" cursor="ew-resize" userSelect="none" />
      <Flex ref={rightContainerRef} minW="3%" flex={{ lg: '1', base: '' }} h={{ lg: '100%', base: 'auto' }} direction="column" overflow="hidden">
        <Flex minH="5vh" ref={topContainerRef} h="50%" direction="column">
          <Flex w="100%" h={isRightFolded ? '100%' : '5vh'} writingMode={isRightFolded ? 'vertical-lr' : 'inherit'} bg={{ base: 'gray.200', _dark: 'gray.800' }} align="center" gap="5" padding="5">
            <Button variant="plain" fontSize="1em" p="0" h="auto" onClick={() => setRightPanel(<CodeEditor />)}>
              <Flex align="center" gap="2">
                <LuCode style={{ width: '16px', height: '16px' }} />
                Редактор
              </Flex>
            </Button>
            {sessionStorage.getItem('submissionId') && (
              // refresh добавлен, ибо ссылка при переключении на редактор не меняется,
              // а значит обратно на попытку перейти не получится
              <Link to="/problems/$id/submissions/$submissionId" params={{ submissionId: sessionStorage.getItem('submissionId') || '', id }} search={{ refresh: Date.now() }}>
                <Flex align="center" gap="2">
                  Попытка
                  {' '}
                  {sessionStorage.getItem('submissionId')}
                </Flex>
              </Link>
            )}
          </Flex>
          <Flex h={{ lg: '100%', base: '100vh' }} overflow="auto" display={isRightFolded ? 'none' : 'flex'}>
            <div ref={rightTopContent} style={{ width: '100%' }}>
              { rightPanel }
            </div>
          </Flex>
        </Flex>
        <Box onMouseDown={handleMouseDownVert} onTouchStart={handleTouchStartVert} display={{ lg: 'inherit', base: 'none' }} h="3px" w="100%" backgroundColor="blue.400" flexShrink="0" cursor="ns-resize" userSelect="none" />
        <Flex minH="5vh" flex="1" direction="column">
          <Flex w="100%" h={isRightFolded ? '100%' : '5vh'} writingMode={isRightFolded ? 'vertical-lr' : 'inherit'} bg={{ base: 'gray.200', _dark: 'gray.800' }} align="center" gap="5" padding="5">
            <Button fontSize="16px" onClick={() => setShowTestResults(false)} variant="plain" p="0">
              <Flex align="center" gap="2">
                <LuTestTubeDiagonal style={{ width: '16px', height: '16px' }} />
                Тесты
              </Flex>
            </Button>
            {submitData && (
            <Button fontSize="16px" onClick={() => setShowTestResults(true)} variant="plain" p="0">
              <Flex align="center" gap="2">
                <Text>
                  Результат попытки
                </Text>
              </Flex>
            </Button>
            )}
          </Flex>
          <Flex h={{ lg: '100%', base: '100vh' }} overflow="auto" display={isRightFolded ? 'none' : 'flex'}>
            <Flex w="100%" p="5">
              <div ref={rightBottomContent} style={{ width: '100%' }}>
                {submitData && showTestResults
                  ? <TestResults attemptResult={submitData} /> : <TestCases />}
              </div>
            </Flex>

          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
