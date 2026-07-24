// Импорт CSS-модуля даёт объект «имя класса → сгенерированное имя».
// Без этого объявления tsc не знает, что такое `import styles from './x.module.css'`.
//
// Файл обязан остаться без импортов и экспортов: объявление внешнего модуля
// («declare module '*.module.css'») действует только в глобальном файле. Стоит
// добавить сюда import — файл станет модулем, и объявление молча перестанет
// работать. Расширение типов для матчеров jest-dom поэтому лежит отдельно,
// в jest-dom.d.ts.
declare module '*.module.css' {
  const classes: Readonly<Record<string, string>>;
  export default classes;
}
