<p align="center">
  <img src="src/assets/logo-comments.svg" width="200"/>
</p>

<h1 align="center"> lexical-comments </h1>

Example implementation of having Google-Docs like comments in https://lexical.dev . Main ingredient that makes this possible is [CommentNode](https://github.com/sereneinserenade/lexical-comments/blob/main/src/lexical-nodes/comment.ts#L41) which is Highly inspired by the [LinkNode](https://github.com/facebook/lexical/blob/main/packages/lexical-link/src/index.js) from Lexical.

If you 👍 / ❤️ what I'm doing, **consider 🌟ing the repo**, I and the Open Source Community appreciate it ❤️.

## Demo

- Try it out at https://sereneinserenade.github.io/lexical-comments/.

https://user-images.githubusercontent.com/45892659/163717603-b98c4c29-6e53-499b-b596-c6b59950dc1f.mp4

## How to use

The real implementation of CommentNode for Lexical is in [comment.ts](src/lexical-nodes/comment.ts), you can copy-paste that file in your project. Rest is just a custom implementation of using CommentNode and storing comments in Recoil state on update and updating comments via commands provided in [comment.ts](src/lexical-nodes/comment.ts). 

If you have any questions/suggestions about the implementation, [open an issue](https://github.com/sereneinserenade/lexical-comments/issues) or [create a Pull Request](https://github.com/sereneinserenade/lexical-comments/pulls).

<img src="https://user-images.githubusercontent.com/45892659/163718058-5de37a96-84ff-4562-9551-769655b62eaf.gif" width="200" />

## Contributing

Show your ❤️ by ⭐️ing this repository. Your support means a lot.

Clone the repo, do something, make a PR(or not). You know what's the drill. Looking forward to your PRs, you amazing devs.

## LICENCE

<details>
  <summary> MIT License </summary>

```
MIT License

Copyright (c) 2022 Jeet Mandaliya (github: sereneinserenade)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
</details>

## Stargazers

[![Stargazers repo roster for @sereneinserenade/lexical-comments](https://reporoster.com/stars/dark/sereneinserenade/lexical-comments)](https://github.com/sereneinserenade/lexical-comments/stargazers)

## Made possible by these badass packages!

```
    "@lexical/react": "^0.2.1",
    "@nextui-org/react": "^1.0.8-beta.5",
    "lexical": "^0.2.1",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "react-icons": "^4.3.1",
    "recoil": "^0.7.2",
    "sass": "^1.50.0",
    "uuid": "^8.3.2"

    "typescript": "^4.6.3",
    "vite": "^2.9.2"
```


