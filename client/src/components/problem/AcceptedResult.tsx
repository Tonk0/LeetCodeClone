import { Flex, Text } from '@chakra-ui/react';
import { CorrectAttempt } from '@/helpers/api';

export function AcceptedResult({ acceptedResult }: { acceptedResult: CorrectAttempt }) {
  return (
    <Flex direction="column" gap="5">
      <Flex gap="2" align="center">
        <Text fontSize="20px" fontWeight="semibold" color="green.500">{acceptedResult.status}</Text>
        <Text color="gray.500">
          {acceptedResult.numOfTestCases}
          /
          {acceptedResult.numOfTestCases}
          {' '}
          тестов пройдено
        </Text>
      </Flex>
      <Flex w="100%" gap="5">
        <Flex w="50%" borderRadius="md" direction="column" bg="gray.800" p="5">
          <Text fontSize="20px">Время выполнения</Text>
          <Flex align="center" gap="2">
            <Text fontSize="20px" fontWeight="semibold">
              {acceptedResult.runtime}
            </Text>
            <Text color="gray.400">
              ms
            </Text>
          </Flex>
        </Flex>
        <Flex w="50%" borderRadius="md" direction="column" bg="gray.800" p="5">
          <Text fontSize="20px">Использование памяти</Text>
          <Flex align="center" gap="2">
            <Text fontSize="20px" fontWeight="semibold">
              {Math.round((acceptedResult.memory / 1024 / 1024) * 100) / 100}
            </Text>
            <Text color="gray.400">
              МБ
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
