<script setup lang="ts">
import { computed } from 'vue';
import AnsiToHtml from 'ansi-to-html';
import { useThemeStore } from '@/store/modules/theme';

const props = defineProps<{
  code: string;
}>();

const themeStore = useThemeStore();

// GitHub Dark Default ANSI palette
const darkConverter = new AnsiToHtml({
  fg: '#e6edf3',
  bg: 'transparent',
  escapeXML: true,
  colors: {
    0: '#484f58',
    1: '#ff7b72',
    2: '#3fb950',
    3: '#d29922',
    4: '#58a6ff',
    5: '#bc8cff',
    6: '#39c5cf',
    7: '#b1bac4',
    8: '#6e7681',
    9: '#ffa198',
    10: '#56d364',
    11: '#e3b341',
    12: '#79c0ff',
    13: '#d2a8ff',
    14: '#56d4dd',
    15: '#f0f6fc'
  }
});

// GitHub Light Default ANSI palette
const lightConverter = new AnsiToHtml({
  fg: '#1f2328',
  bg: 'transparent',
  escapeXML: true,
  colors: {
    0: '#24292f',
    1: '#cf222e',
    2: '#116329',
    3: '#9a6700',
    4: '#0969da',
    5: '#8250df',
    6: '#1b7c83',
    7: '#6e7781',
    8: '#57606a',
    9: '#a40e26',
    10: '#1a7f37',
    11: '#633c01',
    12: '#218bff',
    13: '#a475f9',
    14: '#3192aa',
    15: '#8c959f'
  }
});

const html = computed(() => {
  const converter = themeStore.darkMode ? darkConverter : lightConverter;
  return converter.toHtml(props.code);
});
</script>

<template>
  <pre class="ansi-traceback" v-html="html" />
</template>

<style scoped>
.ansi-traceback {
  background: #f6f8fa;
  color: #1f2328;
  border: 1px solid #d1d9e0;
  padding: 16px;
  border-radius: 6px;
  font-family: 'ui-monospace', 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', 'Liberation Mono', monospace;
  font-size: 12px;
  line-height: 1.6;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
}

html.dark .ansi-traceback {
  background: #0d1117;
  color: #e6edf3;
  border-color: #30363d;
}
</style>
