/* eslint-disable no-nested-ternary */
import { Flex } from '@chakra-ui/react';
import { AttemptResult } from '@/helpers/api';
import { ErrorResult } from './ErrorResult';
import { AcceptedResult } from './AcceptedResult';
import { WrongAnswerResult } from './WrongAnswerResult';

export function TestResults({ attemptResult }: { attemptResult: AttemptResult }) {
  return (
    <Flex gap="5" direction="column">
      {attemptResult.isError ? (
        <ErrorResult errorResult={attemptResult} />
      ) : (
        attemptResult.isCorrect ? (
          <AcceptedResult acceptedResult={attemptResult} />
        ) : (
          <WrongAnswerResult wrongAnswerResult={attemptResult} />
        )
      )}
    </Flex>
  );
}
