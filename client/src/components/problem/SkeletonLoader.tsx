import { Flex, Skeleton } from '@chakra-ui/react';

function SkeletonLoader() {
  return (
    <Flex gap="5" width={{ lg: '60%', base: '100%' }} flexGrow="1" align="center" direction="column" maxH="80%" overflow="auto">
      <Flex width="100%" justify="center" gap="6">
        <Skeleton height="8" width="50%" />
        <Skeleton height="8" width="50%" />
      </Flex>
      {[...Array(30)].map((_, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <Flex width="100%" align="center" justify="center" gap="2" key={i}>
          <Skeleton height="4" width={{ base: '5%', sm: '10%' }} />
          <Skeleton height="4" width="30%" />
          <Skeleton height="4" width="50%" />
        </Flex>
      ))}
    </Flex>
  );
}

export default SkeletonLoader;
