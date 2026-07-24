// Матчеры jest-dom (toBeInTheDocument, toHaveClass и прочие) дописываются
// в Assertion самим этим импортом. Выполняется он в vitest.setup.ts, но тот
// лежит в корне и в программу пакета ds не входит — поэтому расширение типов
// подключается здесь, иначе tsc не знает матчеров, хотя тесты проходят.
import '@testing-library/jest-dom/vitest';
