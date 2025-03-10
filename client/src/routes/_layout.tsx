import { Flex, Input } from '@chakra-ui/react';
import { createFileRoute, Link, Outlet } from '@tanstack/react-router';
import { LuSearch } from 'react-icons/lu';
import { InputGroup } from '@/components/ui/input-group';
import { ColorModeButton } from '@/components/ui/color-mode';

function RouteComponent() {
  return (
    <Flex width="100vw" height="100vh" justify="center">
      <Flex width="50vw" height="100vh" align="center" direction="column" pt="10">
        <nav>
          <Flex align="center" gap="5">
            <InputGroup startElement={<LuSearch />}>
              <Input placeholder="Поиск" />
            </InputGroup>
            <Link to="/problems">Задачи</Link>
            <Link to="/submissions">Попытки</Link>
            <ColorModeButton />
          </Flex>
        </nav>
        <Outlet />
        {/* page selector */}
      </Flex>
    </Flex>
  );
}

export const Route = createFileRoute('/_layout')({
  component: RouteComponent,
});
