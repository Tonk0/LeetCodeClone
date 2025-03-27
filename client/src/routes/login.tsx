import {
  Button, Flex, Heading, Input, Text,
} from '@chakra-ui/react';
import { createFileRoute } from '@tanstack/react-router';
import { FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Message, sha512 } from 'js-sha512';
import { Field } from '@/components/ui/field';
import { PasswordInput } from '@/components/ui/password-input';
import { fetchAuth, LogData } from '@/helpers/api';

function Login() {
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: (data: LogData) => fetchAuth<LogData>('login', data),
  });
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const logData: LogData = {
      login: formData.get('login') as string,
      password: sha512(formData.get('password') as Message),
    };
    mutateAsync(logData);
  };
  return (
    <Flex direction="column" align="center" pt="32">
      <Heading size="2xl">Вход</Heading>
      <form onSubmit={(e) => handleSubmit(e)}>
        <Flex direction="column" width={{ lg: '25vw', base: '50vw' }} gap="4" mt="3">
          <Field label="Логин" required>
            <Input type="text" placeholder="MyLogin" name="login" id="login" />
          </Field>
          <Field label="Пароль" required>
            <PasswordInput name="password" id="password" />
          </Field>
          <Button loading={isPending} type="submit">Войти</Button>
          {error && (
            <Text textAlign="center" color="red.400">{error.message}</Text>
          )}
        </Flex>
      </form>
    </Flex>
  );
}

export const Route = createFileRoute('/login')({
  component: Login,
});
