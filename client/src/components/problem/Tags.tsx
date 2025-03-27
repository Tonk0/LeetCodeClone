import {
  createListCollection, Flex, ListCollection, Portal, Select,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { LuX } from 'react-icons/lu';
import { useNavigate } from '@tanstack/react-router';
import { fetchTags } from '@/helpers/api';

const statuses = createListCollection({
  items: [
    { label: 'Solved', value: 'solved' },
    { label: 'Attempted', value: 'attempted' },
  ],
});
interface TagCollection {
  id: number,
  value: string,
}
function Tags() {
  const navigate = useNavigate();
  const [tagsCollection, setTagsCollection] = useState<ListCollection<TagCollection>>(
    createListCollection({ items: [] }),
  );
  const [tagsValue, setTagsVaule] = useState<string[]>([]);
  const [statusValue, setStatusValue] = useState<string[]>([]);
  const { data, isPending } = useQuery({ queryKey: ['tags'], queryFn: fetchTags });

  useEffect(() => {
    if (data && data.length > 0) {
      setTagsCollection(createListCollection(
        { items: [...data.map((tag) => ({ id: tag.id, value: tag.name }))] },
      ));
    }
  }, [data]);
  const handleTags = (tags: string[]) => {
    setTagsVaule(tags);
  };
  useEffect(() => {
    if (tagsValue.length >= 0) {
      navigate({
        from: '/problems',
        search: (prev) => ({ ...prev, tags: tagsValue.join(',') || undefined }),
        replace: true,
      });
    }
  }, [tagsValue, navigate]);
  useEffect(() => {
    if (statusValue.length >= 0) {
      navigate({
        from: '/problems',
        search: (prev) => ({ ...prev, status: statusValue.join() || undefined }),
      });
    }
  }, [statusValue, navigate]);
  return (
    <Flex width="100%" gap="6" justify="center">
      <Select.Root value={tagsValue} onValueChange={(e) => handleTags(e.value)} disabled={isPending} multiple collection={tagsCollection} size="sm">
        <Select.Control>
          <Select.Trigger cursor="pointer">
            <Select.ValueText placeholder="Tags" />
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
              {tagsCollection.items.map((tag) => (
                <Select.Item item={tag} key={tag.id} cursor="pointer">
                  {tag.value}
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
      <Select.Root value={statusValue} onValueChange={(e) => setStatusValue(e.value)} collection={statuses} size="sm">
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
