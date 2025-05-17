import { Button, Flex, Heading } from '@chakra-ui/react';
import { createFileRoute, Link } from '@tanstack/react-router';
import {
  useContext, useEffect, useRef, useState,
} from 'react';
import classes from '@/styles/index.module.css';
import { AuthContext } from '@/context/AuthContext';

const DATA_TEXT = 'Тут должен быть громкий заголовок';
function Index() {
  const [text, setText] = useState('');
  const { isAuth } = useContext(AuthContext);
  const count = useRef(0);
  useEffect(() => {
    const intervalID = setInterval(() => {
      setText(DATA_TEXT.slice(0, count.current));
      count.current += 1;
      if (count.current > DATA_TEXT.length) {
        clearInterval(intervalID);
      }
    }, 100);

    return () => clearInterval(intervalID);
  }, []);
  return (
    <Flex width="100vw" height="100vh" justify="center">
      <Flex direction="column" align="center" gap="5" marginTop="60">
        <Flex align="flex-end">
          <Heading textAlign="center" className={classes.caret} size="4xl">{text}</Heading>
        </Flex>
        <Button size="xl" asChild>
          <Link to={isAuth ? '/' : '/login'}>Начать</Link>
        </Button>
      </Flex>
    </Flex>
  );
}

export const Route = createFileRoute('/')({
  component: Index,
});
