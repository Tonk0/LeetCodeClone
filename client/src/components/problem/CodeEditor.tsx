import { Flex } from '@chakra-ui/react';
import { Editor, Monaco } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import { useTheme } from 'next-themes';

const editorOptions: editor.IStandaloneEditorConstructionOptions = {
  minimap: { enabled: false },
  lineDecorationsWidth: 0,
  lineNumbersMinChars: 3,
};
export function CodeEditor() {
  const theme = useTheme();
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
  return (
    <Flex width="100%" height="100%" overflow="hidden">
      <Editor width="100%" defaultLanguage="javascript" beforeMount={handleBeforeMount} theme={theme.theme === 'dark' ? 'customDarkTheme' : 'vs'} options={editorOptions} />
    </Flex>
  );
}
