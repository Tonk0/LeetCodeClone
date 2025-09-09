import { Flex, Text } from '@chakra-ui/react';
import { SubmissionDetails as SubmissionDetailsType } from '@/helpers/api';
import { TestResults } from './TestResults';

export function SubmissionDetails({ submission }:{ submission: SubmissionDetailsType }) {
  return (
    <Flex gap="5" p="5" direction="column">
      <TestResults attemptResult={submission.attemptData} />
      <Flex gap="2" direction="column">
        <Text>Пользовательский код</Text>
        <Flex rounded="md" p="4" w="100%" bg={{ base: 'gray.200', _dark: 'gray.800' }}>
          <pre style={{ fontSize: '16px', fontFamily: 'system-ui' }}>
            {submission.code.trim()}
          </pre>
        </Flex>
      </Flex>
    </Flex>
  );
}
