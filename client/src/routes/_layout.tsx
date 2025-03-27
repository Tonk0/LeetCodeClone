import { Flex } from '@chakra-ui/react';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import Navbar from '@/components/Navbar';
import PageSelector from '@/components/PageSelector';

function RouteComponent() {
  return (
    <Flex width="100vw" height="100vh" justify="center">
      <Flex width={{ lg: '50vw', base: '60vw' }} height="100vh" align="center" justify="space-between" direction="column" pt="10" pb="10" position="relative" gap="4">
        <Navbar />
        <Outlet />
        {/* page selector */}
        <PageSelector />
      </Flex>
    </Flex>
  );
}

export const Route = createFileRoute('/_layout')({
  component: RouteComponent,
});
