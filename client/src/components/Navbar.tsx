import { Flex, Input } from '@chakra-ui/react';
import {
  Link, useNavigate, useRouterState,
} from '@tanstack/react-router';
import { LuSearch } from 'react-icons/lu';
import { useEffect, useState } from 'react';
import { InputGroup } from './ui/input-group';
import { ColorModeButton } from './ui/color-mode';

function Navbar() {
  const navigate = useNavigate();
  const router = useRouterState();
  const [searchValue, setSearchValue] = useState<string>(router.location.search.search || '');
  useEffect(() => {
    const redir = setTimeout(() => {
      navigate({
        from: router.location.pathname as '/problems' | '/submissions',
        search: (prev) => ({ ...prev, search: searchValue || undefined }),
        replace: true,
      });
    }, 500);
    return () => clearTimeout(redir);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, navigate]);
  return (
    <nav>
      <Flex align="center" gap="5" wrap="wrap" justify="center" rowGap="1.5">
        <InputGroup startElement={<LuSearch />}>
          <Input placeholder="Поиск" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
        </InputGroup>
        <Link search={{ page: 1 }} to="/problems">Задачи</Link>
        <Link search={{ page: 1 }} to="/submissions">Попытки</Link>
        <ColorModeButton />
      </Flex>
    </nav>
  );
}

export default Navbar;
