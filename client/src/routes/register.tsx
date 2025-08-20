import {
  Button, Flex, Heading, Input, Text,
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { FormEvent, useState } from 'react';
import { Message, sha512 } from 'js-sha512';
import { fetchAuth, RegData } from '@/helpers/api';
import { PasswordInput } from '@/components/ui/password-input';
import { Field } from '@/components/ui/field';

function Register() {
  const [passEqualityError, setPassEqualityError] = useState<null | string>(null);
  const [serverError, setServerError] = useState<null | string>(null);
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: RegData) => fetchAuth<RegData>('register', data),
    onError: (err) => setServerError(err.message),
    onSuccess: () => navigate({ to: '/problems', search: { page: 1 } }),
  });
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setServerError(null);
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = formData.get('password');
    const repeatedPassword = formData.get('repeated-password');
    if (password !== repeatedPassword) {
      setPassEqualityError('Пароли не совпадают');
      return;
    }
    const regData: RegData = {
      login: formData.get('login') as string,
      email: formData.get('email') as string,
      password: sha512(password as Message),
    };
    await mutateAsync(regData);
  };
  return (
    <Flex direction="column" align="center" pt="32">
      <Heading size="2xl">Регистрация</Heading>
      <form onSubmit={(e) => handleSubmit(e)}>
        <Flex direction="column" width={{ lg: '25vw', base: '50vw' }} gap="4" mt="3" align="center">
          <Field label="Логин" required>
            <Input type="text" placeholder="MyLogin" name="login" id="login" />
          </Field>
          <Field label="Почта" required>
            <Input type="email" name="email" id="email" placeholder="example@email.com" />
          </Field>
          <Field label="Пароль" required>
            <PasswordInput name="password" id="password" />
          </Field>
          <Field label="Повтор пароля" required>
            <PasswordInput name="repeated-password" id="repeated-password" />
          </Field>
          <Button loading={isPending} type="submit" width="100%">Зарегестрироваться</Button>
          {serverError && (
            <Text textAlign="center" color="red.400">{serverError}</Text>
          )}
          {passEqualityError && !serverError && (
            <Text textAlign="center" color="red.400">{passEqualityError}</Text>
          )}
        </Flex>
      </form>
    </Flex>
  );
}

export const Route = createFileRoute('/register')({
  component: Register,
});
