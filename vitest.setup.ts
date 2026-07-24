import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Очистка после каждого теста регистрируется руками. Сама Testing Library
// вешает её только когда afterEach лежит в глобальных, а globals в конфиге
// не включены — без этого отрисованное в предыдущем тесте остаётся в документе
// и getByRole находит несколько кнопок вместо одной.
afterEach(cleanup);
