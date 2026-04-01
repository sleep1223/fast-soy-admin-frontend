import { onActivated, onBeforeUnmount, onDeactivated, onMounted, ref } from 'vue';

/**
 * 轮询 Hook，支持页面可见性检测。
 *
 * - 页面不可见（切换浏览器 Tab）时自动暂停轮询
 * - 组件 deactivated（keep-alive 切换）时自动暂停
 * - 组件 activated / 页面重新可见时自动恢复
 *
 * @param callback 轮询回调
 * @param interval 轮询间隔（毫秒），默认 3000
 * @param options.immediate 是否在挂载时立即执行一次回调，默认 true
 */
export function usePolling(
  callback: () => void | Promise<void>,
  interval = 3000,
  options: { immediate?: boolean } = {}
) {
  const { immediate = true } = options;

  const active = ref(true);
  let timer: ReturnType<typeof setInterval> | null = null;

  function start() {
    stop();
    if (active.value) {
      timer = setInterval(callback, interval);
    }
  }

  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function pause() {
    active.value = false;
    stop();
  }

  function resume() {
    active.value = true;
    start();
  }

  function handleVisibilityChange() {
    if (document.visibilityState === 'hidden') {
      stop();
    } else if (active.value) {
      callback();
      start();
    }
  }

  onMounted(() => {
    if (immediate) {
      callback();
    }
    start();
    document.addEventListener('visibilitychange', handleVisibilityChange);
  });

  onActivated(() => {
    if (active.value) {
      callback();
      start();
    }
  });

  onDeactivated(() => {
    stop();
  });

  onBeforeUnmount(() => {
    stop();
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  });

  return { active, pause, resume };
}
