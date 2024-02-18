<div align="center">
	<h1>
		@vyke/sola
	</h1>
</div>

## Installation
```sh
npm i @vyke/sola
```

## API
### Sola
Core sola class

```ts
const sola = new Sola({ tag: 'my-app' })

sola.log('hello sola') // <- my-app hello sola

const customTag = sola.withTag('mytag')

customTag.log('hello sola') // <- my-app:mytag hello sola
```

## Others vyke projects
- [Flowmodoro app by vyke](https://github.com/albizures/vyke-flowmodoro)
- [@vyke/tsdocs](https://github.com/albizures/vyke-tsdocs)
- [@vyke/val](https://github.com/albizures/vyke-val)
- [@vyke/dom](https://github.com/albizures/vyke-dom)
