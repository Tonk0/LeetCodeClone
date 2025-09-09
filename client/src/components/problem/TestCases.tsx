import { useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { Button, Flex, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { fetchFirstThreeTestCases } from '@/helpers/api';

export function TestCases() {
  const params = useParams({ from: '/problems/$id' });
  const [selectedTestCaseIndex, setSelectedTestCaseIndex] = useState(0);
  const { data } = useQuery({
    queryKey: ['testcases', params.id],
    queryFn: () => fetchFirstThreeTestCases(params.id),
  });

  const handleClick = (index: number) => {
    setSelectedTestCaseIndex(index);
  };
  return (
    <Flex w="100%" gap="5" direction="column">
      {data && (
        <>
          <Flex gap="8">
            {data.map((testCase, index) => (
              <Button variant={index === selectedTestCaseIndex ? 'solid' : 'ghost'} w="28" key={testCase.id} onClick={() => handleClick(index)}>
                Тест
                {' '}
                {index + 1}
              </Button>
            ))}
          </Flex>
          <Flex gap="5" direction="column">
            {Object.entries(data[selectedTestCaseIndex].input).map(([key, value]) => (
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
          </Flex>
        </>
      )}
    </Flex>
  );
}
