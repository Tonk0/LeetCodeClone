import { Flex, Text } from '@chakra-ui/react';
import { ErrorAttempt } from '@/helpers/api';

export function ErrorResult({ errorResult }: { errorResult: ErrorAttempt }) {
  return (
    <Flex gap="5" direction="column">
      <Text fontSize="20px" fontWeight="semibold" color="red.500">{errorResult.status}</Text>
      {errorResult.errorData && (
      <Flex rounded="md" p="4" w="100%" bg={{ base: 'gray.200', _dark: 'gray.800' }}>
        <Text color="red.500">{errorResult.errorData}</Text>
      </Flex>
      )}
    </Flex>
  );
}
