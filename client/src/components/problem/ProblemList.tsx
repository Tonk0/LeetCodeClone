import { Flex, Text } from '@chakra-ui/react';
import { Link } from '@tanstack/react-router';
import { LuCheck, LuLoader } from 'react-icons/lu';
import { Problem } from '@/helpers/api';

interface ProblemListProps {
  problems: Array<Problem>
}
function ProblemList({ problems }: ProblemListProps) {
  return (
    <Flex width="100%" direction="column" align="center" overflow="auto">
      {problems.map((problem, index) => (
        <Link to="/problems/$id" params={{ id: problem.id.toString() }} style={{ width: '100%' }} key={problem.id}>
          <Flex height="10" width="100%" align="center" justify="center" gap="2" backgroundColor={index % 2 === 0 ? 'tile-bg' : ''}>
            <Flex width="10%">
              {problem.statuses !== null && (problem.statuses.some((status) => status === 'Accepted') ? <LuCheck color="#16a34a" /> : <LuLoader color="#facc15" />)}
            </Flex>
            <Flex width="30%" align="flex-start" whiteSpace="nowrap">
              <Text overflow="hidden" textOverflow="ellipsis">{problem.id}</Text>
            </Flex>
            <Flex width="55%" align="flex-start" whiteSpace="nowrap">
              <Text overflow="hidden" textOverflow="ellipsis">{problem.title}</Text>
            </Flex>
          </Flex>
        </Link>
      ))}
    </Flex>
  );
}

export default ProblemList;
