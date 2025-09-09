/* eslint-disable @typescript-eslint/no-use-before-define */
import { createFileRoute, Link } from '@tanstack/react-router';
import { Flex, Text } from '@chakra-ui/react';
import { fetchSubmission } from '@/helpers/api';
import { dateConverter, getTime } from '@/helpers/helpers';
import { SubmissionDetails } from '@/components/problem/SubmissionDetails';

function RouteComponent() {
  const submission = Route.useLoaderData();
  return (
    <Flex w="100vw" h="100vh" justify="center">
      <Flex p="5" w="50%" h="100%" direction="column" align="flex-start">
        <Link to="/problems/$id" params={{ id: submission.taskId }}>
          <Text flexGrow="0" textDecoration="underline" fontSize="20px" fontWeight="bold">{submission.taskTitle}</Text>
        </Link>
        <Flex flexGrow="0" gap="2">
          <Text>{submission.programming_language}</Text>
          <Text> | </Text>
          <Text>{`${dateConverter(submission.submitted_at)}, ${getTime(submission.submitted_at)}`}</Text>
        </Flex>
        <SubmissionDetails submission={submission} />
      </Flex>
    </Flex>

  );
}

export const Route = createFileRoute('/submissions/$id')({
  component: RouteComponent,
  loader: ({ params: { id } }) => fetchSubmission(id),
});
