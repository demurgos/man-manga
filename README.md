# Manmanga

Awesome mangas and animes dedicated search engine.

## Run the project

### Prerequisites

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the required environment
and links to the tools description and installation instructions.

### Build and run

1. Clone the project

   ```shell
   git clone https://github.com/if-h4102/man-manga.git
   cd man-manga
   ```

2. Install needed dependencies

   ```shell
   npm install
   ```

3. Build it

   ```
   gulp all:clean-buid
   ```

4. Run it

   ```
   npm start
   ```

   And then go to the shown URL in your favorite browser
   (http://localhost:3000)

## Dev Notes

### Voice actors

When searching for character on dbpedia,
we often come across _voice actors_.
It could be nice to add them to the list of things that
we can search.

Moreover, people are fairly more documented in dbpedia than
fictional characters.

### Characters

Fictional characters are only well documents in dbpedia if
they are well known.
That's sad, but that's the truth.

To overcome this situation, we could force a second research
if the first one in wikipedia doesn't bring a character;
we could use anilist.o API `/character/search/{query}`.

### About time

There are a looooooot of awesome features to implement,
but to respect the deadline only the basic things will
be in the presentation.

I hope we will implement some more after the deadline.

## License

[AGPL-3.0](./LICENSE.txt)
