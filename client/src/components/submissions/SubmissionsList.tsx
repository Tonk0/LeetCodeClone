import { Flex, Text } from '@chakra-ui/react';
import { Link } from '@tanstack/react-router';
import { Submission } from '@/helpers/api';
import { dateConverter } from '@/helpers/helpers';

interface SubmissionsListProps {
  submissions: Array<Submission>
}
export function SubmissionsList({ submissions }: SubmissionsListProps) {
  return (
    <Flex width="100%" direction="column" align="center">
      {submissions.map((submission, index) => (
        <Link to="/submissions/$id" params={{ id: submission.id.toString() }} style={{ width: '100%' }} key={submission.id}>
          <Flex height="10" width="100%" align="center" justify="center" gap="2" backgroundColor={index % 2 === 0 ? 'tile-bg' : ''}>
            <Flex width="40%" align="flex-start" whiteSpace="nowrap">
              <Text overflow="hidden" textOverflow="ellipsis">
                {submission.status}
              </Text>
            </Flex>
            <Flex width="30%" align="flex-start" whiteSpace="nowrap">
              <Text overflow="hidden" textOverflow="ellipsis">{submission.title}</Text>
            </Flex>
            <Flex width="25%" align="flex-start" whiteSpace="nowrap">
              <Text overflow="hidden" textOverflow="ellipsis">{dateConverter(submission.submitted_at)}</Text>
            </Flex>
          </Flex>
        </Link>
      ))}
    </Flex>
  );
}
