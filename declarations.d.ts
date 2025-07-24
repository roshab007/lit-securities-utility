declare module '*?worker&inline' {
  const workerFactory: { new (): Worker }
  export default workerFactory
}
