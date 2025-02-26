import { Flex } from '@chakra-ui/react';
import { createFileRoute } from '@tanstack/react-router';
import { ColorModeButton } from '@/components/ui/color-mode';

function Index() {
  return (
    <Flex bg="gray.500">
      <h1>Hello</h1>
      <ColorModeButton />
    </Flex>
  );
}

export const Route = createFileRoute('/')({
  component: Index,
});
