# Uptime test exercise

## What is it?
It is a RSS viewer website that fetches its initial content from: [Flipboard](https://flipboard.com/@raimoseero/feed-nii8kd0sz.rss)

## How to use it?
In the terminal:

```cd lolo-v5```

```npm i```

```npm run dev```

Server opens on localhost:3000

### Api folder explanation

#### rss.js
This file parses the rss feeds that the user adds. It uses the rss-parser package.

#### parse.js
This file feeds the requested URL through the Uptime web parser and returns the receieved content.

## Current limitations/problems/my mistakes
1. The article tags can get long and there can be a lot of them. I wanted to have one row of horizontally scrollable tags but then I discovered that during resizing the window it doesn't shrink properly and causes overflow issues. So I opted for a vertically scrolling tags list which can sometimes cover most of the image.
2. GIFs and SVGs aren't being parsed properly (by the web parser probably? or I am doing something wrong) so it will display a blank image. And sometimes the article isn't parsed but the recommended articles below it are.
3. The number of different combinations of html tags is big so there might be some things that aren't styled properly (weird white spaces, margins, paddigns etc.).
4. "7 sins of software development" article is empty because the web parser returns only an empty div. "QuivrHQ/quivr: Your GenAI Second Brain.." is on Github and also isn't being parsed correctly.
