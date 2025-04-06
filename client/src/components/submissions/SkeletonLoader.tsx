import { Flex, Skeleton } from '@chakra-ui/react';

function SkeletonLoader() {
  return (
    <Flex gap="5" width={{ lg: '60%', base: '100%' }} flexGrow="1" align="center" direction="column" maxH="80%" overflow="auto">
      <Flex width="100%" justify="center">
        <Skeleton height="8" width="100%" />
      </Flex>
      {[...Array(30)].map((_, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <Flex width="100%" align="center" justify="center" gap="2" key={i}>
          <Skeleton height="5" width="40%" />
          <Skeleton height="5" width="30%" />
          <Skeleton height="5" width="25%" />
        </Flex>
      ))}
    </Flex>
  );
}

export default SkeletonLoader;
