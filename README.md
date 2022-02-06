# Equal temperament playground

> Playground page to play with any equal temperament tuning system.

![](https://i.imgur.com/VDXI0gK.png)

## Dev

- `npm i`
- `npm run dev`
- [localhost:8080](http://localhost:8080)

## Building and running in production mode

To create an optimised version of the app:

```bash
npm run build
```

## Single-page app mode

By default, sirv will only respond to requests that match files in `public`. This is to maximise compatibility with static fileservers, allowing you to deploy your app anywhere.

If you're building a single-page app (SPA) with multiple routes, sirv needs to be able to respond to requests for *any* path. You can make it so by editing the `"start"` command in package.json:

```js
"start": "sirv public --single"
```
