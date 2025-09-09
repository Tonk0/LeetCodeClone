import { Flex } from '@chakra-ui/react';
import { useLoaderData } from '@tanstack/react-router';
import Tags from './Tags';
import { SubmissionsList } from './SubmissionsList';

export function SubmissionsPage() {
  const submissions = useLoaderData({ from: '/_layout/submissions' });
  return (
    <Flex overflow="auto" gap="5px" width={{ lg: '60%', base: '100%' }} direction="column" align="center" flexGrow="1">
      <Tags />
      <SubmissionsList submissions={submissions} />
    </Flex>

  );
}
