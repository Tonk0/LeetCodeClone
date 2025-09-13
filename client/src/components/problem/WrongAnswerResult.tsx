import { Flex, Text } from '@chakra-ui/react';
import { WrongAnswerAttempt } from '@/helpers/api';

export function WrongAnswerResult({ wrongAnswerResult }:
{ wrongAnswerResult: WrongAnswerAttempt }) {
  return (
    <Flex gap="5" direction="column">
      <Flex gap="2" align="center">
        <Text fontSize="20px" fontWeight="semibold" color="red.500">{wrongAnswerResult.status}</Text>
        <Text color="gray.500">
          {wrongAnswerResult.wrongTestCase - 1}
          /
          {wrongAnswerResult.numOfTestCases}
          {' '}
          тестов пройдено
        </Text>
      </Flex>
      {Object.entries(wrongAnswerResult.testCase.input).map(([key, value]) => (
        <Flex gap="2" direction="column" key={key}>
          <Text>
            {key}
            {' '}
            =
          </Text>
          <Flex rounded="md" p="4" w="100%" bg={{ base: 'gray.200', _dark: 'gray.800' }}>
            {JSON.stringify(value)}
          </Flex>
        </Flex>
      ))}
      {wrongAnswerResult.userLog.length > 0 && (
      <Flex gap="2" direction="column">
        <Text>Stdout</Text>
        <Flex direction="column" overflow="auto" maxHeight="30vh" rounded="md" p="4" w="100%" bg={{ base: 'gray.200', _dark: 'gray.800' }}>
          {wrongAnswerResult.userLog.map((line, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <Text key={`${line}_${index}`}>{line}</Text>
          ))}
        </Flex>
      </Flex>
      )}
      <Flex direction="column" gap="2">
        <Text>Вывод</Text>
        <Flex rounded="md" p="4" w="100%" bg={{ base: 'gray.200', _dark: 'gray.800' }}>
          {wrongAnswerResult.userOutput ? (
            <Text color="red.500">{wrongAnswerResult.userOutput}</Text>
          ) : (
            <Text>&nbsp;</Text>
          )}
        </Flex>
      </Flex>
      <Flex direction="column" gap="2">
        <Text>Ожидаемый вывод</Text>
        <Flex rounded="md" p="4" w="100%" bg={{ base: 'gray.200', _dark: 'gray.800' }}>
          <Text color="green.500">{JSON.stringify(wrongAnswerResult.testCase.expected_output)}</Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
