import {
  createListCollection, Flex,
  Portal,
  Select,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { LuX } from 'react-icons/lu';

const statuses = createListCollection({
  items: [
    { label: 'Accepted', value: 'Accepted' },
    { label: 'Wrong Answer', value: 'Wrong Answer' },
    { label: 'Time Limit Exceeded', value: 'Time Limit Exceeded' },
    { label: 'Runtime Error', value: 'Runtime Error' },
    { label: 'Memory Limit Exceeded', value: 'Memory Limit Exceeded' },
    { label: 'Compilation Error', value: 'Compilation Error' },
  ],
});
function Tags() {
  const navigate = useNavigate();
  const [statusValue, setStatusValue] = useState<string[]>([]);

  useEffect(() => {
    if (statusValue.length >= 0) {
      navigate({
        from: '/submissions',
        search: (prev) => ({ ...prev, statuses: statusValue.join() || undefined }),
      });
    }
  }, [statusValue, navigate]);
  return (
    <Flex width="100%" gap="6" justify="center">
      <Select.Root value={statusValue} onValueChange={(e) => setStatusValue(e.value)} multiple collection={statuses} size="sm">
        <Select.Control>
          <Select.Trigger cursor="pointer">
            <Select.ValueText placeholder="Statuses" />
          </Select.Trigger>
          <Select.IndicatorGroup marginLeft="1">
            <Select.ClearTrigger pointerEvents="auto" color="fg.muted" cursor="pointer">
              <LuX color="currentColor" />
            </Select.ClearTrigger>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
        <Portal>
          <Select.Positioner>
            <Select.Content gap="1">
              {statuses.items.map((status) => (
                <Select.Item item={status} key={status.value} cursor="pointer">
                  {status.label}
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
    </Flex>
  );
}

export default Tags;
