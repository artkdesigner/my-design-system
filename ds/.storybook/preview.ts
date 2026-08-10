import type { Preview } from '@storybook/react-vite';
import '../src/tokens/index.css';
import './preview.css';

/**
 * Каждый переключатель витрины — это режим коллекции Figma, выведенный
 * в отдельный data-атрибут. Значения обязаны совпадать с селекторами
 * в ds/src/tokens/*.css, иначе переключатель молча ничего не сделает.
 *
 * Тема, акцент и размер всегда выставлены. Состояние, сообщение и onAccent
 * по умолчанию сняты: это надбавки поверх обычного вида.
 */
const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Тема оформления',
      toolbar: {
        title: 'Тема',
        items: [
          { value: 'light', title: 'Светлая' },
          { value: 'dark', title: 'Тёмная' }
        ]
      }
    },
    accent: {
      description: 'Акцентный цвет',
      toolbar: {
        title: 'Акцент',
        items: [
          { value: 'blue', title: 'Синий' },
          { value: 'sky', title: 'Голубой' },
          { value: 'purple', title: 'Фиолетовый' },
          { value: 'ruby', title: 'Рубиновый' }
        ]
      }
    },
    state: {
      description: 'Принудительное состояние',
      toolbar: {
        title: 'Состояние',
        items: [
          { value: '', title: 'Обычное' },
          { value: 'hover', title: 'Наведение' },
          { value: 'pressed', title: 'Нажатие' },
          { value: 'disabled', title: 'Недоступно' }
        ]
      }
    },
    size: {
      description: 'Размер компонентов',
      toolbar: {
        title: 'Размер',
        items: [
          { value: 'l', title: 'L' },
          { value: 'm', title: 'M' },
          { value: 's', title: 'S' }
        ]
      }
    },
    message: {
      description: 'Тон сообщения',
      toolbar: {
        title: 'Сообщение',
        items: [
          { value: '', title: 'Нет' },
          { value: 'info', title: 'Инфо' },
          { value: 'success', title: 'Успех' },
          { value: 'warning', title: 'Предупреждение' },
          { value: 'error', title: 'Ошибка' }
        ]
      }
    },
    onAccent: {
      description: 'Содержимое на акцентной подложке',
      toolbar: {
        title: 'На акценте',
        items: [
          { value: '', title: 'Обычный фон' },
          { value: 'true', title: 'На акценте' }
        ]
      }
    }
  },
  initialGlobals: {
    theme: 'light',
    accent: 'blue',
    state: '',
    size: 'l',
    message: '',
    onAccent: ''
  },
  decorators: [
    (Story, context) => {
      const root = document.documentElement;
      const globals = context.globals as Record<string, string>;

      for (const key of ['theme', 'accent', 'state', 'size', 'message', 'onAccent']) {
        const value = globals[key];
        if (value) root.dataset[key] = value;
        else delete root.dataset[key];
      }

      return Story();
    }
  ]
};

export default preview;
