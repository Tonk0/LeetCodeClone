import {
  Box, Button, createListCollection, Flex,
} from '@chakra-ui/react';
import { Editor, Monaco } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import { useTheme } from 'next-themes';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { FormEvent, useRef, useState } from 'react';
import {
  SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText,
} from '../ui/select';
import { fetchTemplate, sendUserCode } from '@/helpers/api';
import { toaster } from '@/components/ui/toaster';

const frameworks = createListCollection({
  items: [
    { label: 'C++', value: 'C++', editorName: 'cpp' },
    { label: 'Python', value: 'Python', editorName: 'python' },
    { label: 'Java Script', value: 'Java Script', editorName: 'javascript' },
  ],
});

const editorOptions: editor.IStandaloneEditorConstructionOptions = {
  minimap: { enabled: false },
  lineDecorationsWidth: 0,
  lineNumbersMinChars: 3,
};
export function CodeEditor() {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const { id } = useParams({ from: '/problems/$id' });
  const handleBeforeMount = (monaco: Monaco) => {
    monaco.editor.defineTheme('customDarkTheme', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#141414',
      },
    });
  };
  const handleEditorDidMount = (editorInstance: editor.IStandaloneCodeEditor) => {
    editorRef.current = editorInstance;
  };
  const [language, setLanguage] = useState<string[]>([sessionStorage.getItem('lang') || 'Java Script']);
  const [editorLanguage, setEditorLanguage] = useState<string>(
    frameworks.items.find((el) => el.value === sessionStorage.getItem('lang'))?.editorName || 'javascript',
  );
  const { data } = useQuery({
    queryKey: ['template', language],
    queryFn: ({ queryKey }) => fetchTemplate(id, queryKey[1][0]),
  });
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ lang, code } : { lang: string, code: string }) => sendUserCode(id, lang, code),
    onError: (error: Error & { status: number }) => {
      if (error.status === 429) {
        toaster.create({
          description: error.message,
          type: 'warning',
        });
      }
    },
    mutationKey: ['submit'],
    onSuccess: (newData) => {
      queryClient.setQueryData(['submit'], newData);
    },
  });
  const handleChange = (e: string[]) => {
    setLanguage(e);
    setEditorLanguage(frameworks.items.find((el) => el.value === e.join())?.editorName || 'markdown'); // markdown, чтобы не подсвечивались ошибки синтаксиса
    sessionStorage.setItem('lang', e[0]);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editorRef.current) {
      mutateAsync({ lang: language[0], code: editorRef.current.getValue() });
    }
  };
  return (
    <form style={{ width: '100%', height: '100%' }} onSubmit={(e) => handleSubmit(e)}>
      <Flex width="100%" height="100%" direction="column">
        <Flex width="100%" justifyContent="space-between" mt="2" mb="2" pl="2" pr="2">
          <SelectRoot width="40%" collection={frameworks} value={language} onValueChange={(e) => handleChange(e.value)}>
            <SelectTrigger>
              <SelectValueText placeholder="Select framework" />
            </SelectTrigger>
            <SelectContent>
              {frameworks.items.map((framework) => (
                <SelectItem item={framework} key={framework.value}>
                  {framework.label}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
          <Button type="submit" loading={isPending} bg="green.500">Запустить</Button>
        </Flex>
        <Box w="100%" h="2px" bg="gray.700" flexShrink="0" mb="2" />
        {/* пришлось сделать так, ибо иногда,
        после перезагрузки страницы, template не показывался */
      data && (
        <Editor width="100%" value={data.template} language={editorLanguage} onMount={handleEditorDidMount} beforeMount={handleBeforeMount} theme={theme.theme === 'dark' ? 'customDarkTheme' : 'vs'} options={editorOptions} />
      )
      }
      </Flex>
    </form>

  );
}
