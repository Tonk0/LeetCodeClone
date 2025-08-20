/* eslint-disable react/prop-types */
/* eslint-disable react/no-unstable-nested-components */
import {
  Blockquote, Code, Flex, Text,
} from '@chakra-ui/react';
import Markdown, { Components } from 'react-markdown';
import { ProblemDesc as Task } from '@/helpers/api';

interface ProblemDescProps {
  task: Task
}
const components: Components = {
  blockquote(props) {
    const { children } = props;
    return (
      <Blockquote.Root>
        <Blockquote.Content>
          {children}
        </Blockquote.Content>
      </Blockquote.Root>
    );
  },
  p(props) {
    const { children } = props;
    return (
      <Text>
        {children}
      </Text>
    );
  },
  code(props) {
    const { children } = props;
    return (
      <Code colorPalette="gray" variant="surface">
        {children}
      </Code>
    );
  },
};
export function ProblemDesc({ task }: ProblemDescProps) {
  return (
    <Flex p="5" direction="column">
      <Markdown components={components}>
        {task && task.description}
      </Markdown>
    </Flex>

  );
}
