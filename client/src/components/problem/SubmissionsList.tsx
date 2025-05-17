import { Flex, Text } from '@chakra-ui/react';
import { Link, useParams } from '@tanstack/react-router';
import { SubmissionForProblem } from '@/helpers/api';
import { dateConverter } from '@/helpers/helpers';

interface SubmissionsListProps {
  submissions: SubmissionForProblem[]
}

export function SubmissionsList({ submissions } : SubmissionsListProps) {
  const { id } = useParams({ from: '/problems/$id' });
  return (
    <Flex direction="column">
      <Flex align="center" pl="5" pt="2" pb="2" w="100%" justifyContent="space-between">
        <Flex direction="column" flex="1">
          <Text>
            Статус
          </Text>
        </Flex>
        <Text flex="1" textAlign="center">
          Язык
        </Text>
        <Text flex="1" textAlign="center">Время выполнения</Text>
        <Text flex="1" textAlign="center">Память</Text>
      </Flex>
      {submissions.map((submission, index) => (
        <Link key={submission.id} to="/problems/$id/submissions/$submissionId" params={{ submissionId: submission.id.toString(), id }}>
          <Flex align="center" pl="5" pt="2" pb="2" w="100%" justifyContent="space-between" backgroundColor={index % 2 === 0 ? 'tile-bg' : ''}>
            <Flex direction="column" flex="1">
              <Text color={submission.status === 'Accepted' ? 'green.500' : 'red.500'}>
                {submission.status}
              </Text>
              <Text>
                {dateConverter(submission.submitted_at)}
              </Text>
            </Flex>
            <Text flex="1" textAlign="center">
              {submission.programming_language}
            </Text>
            <Text flex="1" textAlign="center">{submission.execution_time}</Text>
            <Text flex="1" textAlign="center">{submission.memory_used}</Text>
          </Flex>
        </Link>
      ))}
    </Flex>
  );
}
